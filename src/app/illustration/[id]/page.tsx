'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useDownloadLimit } from '@/hooks/useDownloadLimit';
import Banner from '@/components/Banner';
import { FaFacebookF, FaTwitter, FaShareAlt, FaCoffee } from 'react-icons/fa';

interface IllustrationData {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  tags?: string[] | null;
  collection_id?: number | null;
}

interface RelatedImage {
  id: number;
  image_url: string;
}

interface Tag {
  id: number;
  name: string;
}

// raw Supabase URL → 로컬/Prod 모두 /cdn/... 로 매핑해 주는 헬퍼
function toCdnUrl(raw: string) {
  const m = raw.match(/public\/illustrations\/images\/(.+)$/);
  return m ? `/cdn/illustrations/images/${m[1]}` : raw;
}

export default function IllustrationPage() {
  const { id } = useParams();
  const illustrationId = Number(id);
  const [data, setData] = useState<IllustrationData | null>(null);
  const [related, setRelated] = useState<RelatedImage[]>([]);
  const [tagObjs, setTagObjs] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const { remaining, recordDownload } = useDownloadLimit(illustrationId);

  // load illustration & tags
  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/illustrations/${id}`);
      const json: IllustrationData = await res.json();
      setData(json);
      if (json.tags?.length) {
        const { data: tagsData } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', json.tags);
        if (tagsData) setTagObjs(tagsData);
      }
    })();
  }, [id]);

  // load related
  useEffect(() => {
    if (!data?.collection_id) return;
    (async () => {
      const { data: rel, error } = await supabase
        .from('illustrations')
        .select('id, image_url')
        .eq('collection_id', data.collection_id)
        .neq('id', illustrationId)
        .eq('visible', true)
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error && rel) setRelated(rel);
    })();
  }, [data, illustrationId]);

  // interstitial timer
  useEffect(() => {
    if (showModal && remaining > 0) {
      setButtonsEnabled(false);
      const t = setTimeout(() => setButtonsEnabled(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showModal, remaining]);

  const handleDownload = async (fmt: 'svg' | 'png') => {
    setShowModal(false);
    if (remaining <= 0) return;
    await recordDownload(fmt);
    if (!data) return;
    // 다운로드는 원본 Supabase URL 에서
    const resp = await fetch(data.image_url);
    if (!resp.ok) return alert('Failed to fetch file.');
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `illustration_${data.id}.${fmt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <main className="container mx-auto max-w-screen-lg px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Image + Tags */}
        <div className="md:w-1/2 w-full">
          <img
            src={toCdnUrl(data.image_url)}
            alt={data.title}
            className="w-full h-auto rounded"
          />
          {tagObjs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tagObjs.map(tag => (
                <Link
                  key={tag.id}
                  href={`/categories/${tag.id}`}
                  className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info + Download */}
        <div className="md:w-1/2 w-full space-y-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          {data.description && (
            <p className="text-gray-700">{data.description}</p>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download
            </button>
            <a
              href="https://www.buymeacoffee.com/openillust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <FaCoffee size={20} />
              <span>Buy me a coffee</span>
            </a>
          </div>

          {/* License & Info */}
          <div className="text-left text-sm text-gray-600 space-y-1">
            <p>* Up to 10 free downloads per day. Remaining downloads: {remaining}</p>
            <p>* Commercial use allowed.</p>
            <p>* Modifications and derivative works permitted.</p>
            <p>* Resale or redistribution prohibited.</p>
            <p>
              * Attribution optional but appreciated.{' '}
              <Link
                href="/info/terms"
                className="underline text-blue-600 hover:text-blue-800"
              >
                View license
              </Link>
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`,
                  '_blank'
                )
              }
              className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              <FaFacebookF size={20} />
              <span className="sr-only">Share on Facebook</span>
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                  )}&text=Check%20out%20this%20image!`,
                  '_blank'
                )
              }
              className="flex items-center gap-2 px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              <FaTwitter size={20} />
              <span className="sr-only">Tweet this</span>
            </button>

            <button
              onClick={() => navigator.share?.({ url: window.location.href })}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <FaShareAlt size={20} />
              <span className="sr-only">Share</span>
            </button>
          </div>

          {/* Banner */}
          <div className="mt-6">
            <Banner />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 text-left">
              Select file format
            </h2>
            <hr className="border-gray-300 mb-4" />

            {remaining > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-600 text-left">
                  You may download up to 10 files per day. Please select only
                  the images you need.
                </p>

                {/* AdSense Banner */}
                <div className="w-full mb-4">
                  <img
                    src="/adsense-banner-placeholder.png"
                    alt="Advertisement"
                    className="w-full h-auto rounded"
                  />
                </div>

                {/* Download Buttons */}
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => handleDownload('svg')}
                    disabled={!buttonsEnabled}
                    className={`flex-1 px-4 py-2 text-white rounded ${
                      buttonsEnabled
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    SVG Download
                  </button>
                  <button
                    onClick={() => handleDownload('png')}
                    disabled={!buttonsEnabled}
                    className={`flex-1 px-4 py-2 text-white rounded ${
                      buttonsEnabled
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    PNG Download
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600">
                You have reached your download limit for today.<br />
                Please come back tomorrow.
              </p>
            )}

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Related Images */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">
            Other images in this collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {related.map(img => (
              <Link key={img.id} href={`/illustration/${img.id}`}>
                <img
                  src={toCdnUrl(img.image_url)}
                  alt=""
                  className="w-full h-40 object-cover rounded hover:opacity-90 transition"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
