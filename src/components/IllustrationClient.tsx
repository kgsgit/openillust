// 파일 경로: src/components/IllustrationClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaShareAlt, FaCoffee } from 'react-icons/fa';
import DownloadModal from '@/components/DownloadModal';
import Banner from '@/components/Banner';
import { useDownloadLimit } from '@/hooks/useDownloadLimit';

interface IllustrationData {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  download_count_svg?: number;
  download_count_png?: number;
  created_at?: string;
}

interface RelatedImage {
  id: number;
  image_url: string;
}

interface Tag {
  id: number;
  name: string;
}

interface IllustrationClientProps {
  data: IllustrationData;
  tags: Tag[];
  related: RelatedImage[];
}

function toCdnUrl(raw: string): string {
  const m = raw.match(/public\/illustrations\/images\/(.+)$/);
  return m ? `/cdn/illustrations/images/${m[1]}` : raw;
}

const IllustrationClient: React.FC<IllustrationClientProps> = ({
  data,
  tags,
  related,
}) => {
  const { remaining, incrementLocalCount } = useDownloadLimit(data.id);
  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  useEffect(() => {
    if (showModal && remaining > 0) {
      setButtonsEnabled(false);
      const t = setTimeout(() => setButtonsEnabled(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showModal, remaining]);

  const handleDownload = async (fmt: 'svg' | 'png') => {
    setShowModal(false);
    if (remaining <= 0) {
      alert('Download limit reached for today.');
      return;
    }
    const res = await fetch(`/api/download?illustration=${data.id}&format=${fmt}`);
    const json = await res.json();
    if (!res.ok || json.error) {
      alert(json.error || 'Download failed.');
      return;
    }
    const url = toCdnUrl(data.image_url);

    if (fmt === 'svg') {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.id}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      incrementLocalCount();
    } else {
      const fileRes = await fetch(url);
      if (!fileRes.ok) {
        alert('Download failed.');
        return;
      }
      let svgText = await fileRes.text();
      svgText = svgText.replace(/\s(width|height)="[^"]*"/g, '');
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      let vbW = 0,
        vbH = 0;
      const viewBox = svgEl?.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number);
        vbW = parts[2];
        vbH = parts[3];
      }
      const scale = 8;
      const canvas = document.createElement('canvas');
      canvas.width = vbW * scale;
      canvas.height = vbH * scale;
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (pngBlob) => {
            if (pngBlob) {
              const pngUrl = URL.createObjectURL(pngBlob);
              const a = document.createElement('a');
              a.href = pngUrl;
              a.download = `${data.id}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(pngUrl);
              incrementLocalCount();
            } else {
              alert('PNG conversion failed.');
            }
          },
          'image/png'
        );
        URL.revokeObjectURL(svgUrl);
      };
      img.onerror = () => {
        alert('PNG conversion failed.');
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* 이미지 & 워터마크 */}
        <div className="md:w-1/2 w-full">
          <div className="relative">
            <img
              src={toCdnUrl(data.image_url)}
              alt={data.title}
              className="w-full h-auto rounded"
            />
            <div className="absolute inset-0 flex flex-wrap items-center justify-center pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-5xl text-gray-200 -rotate-45 opacity-20 m-8 select-none"
                >
                  openillust
                </span>
              ))}
            </div>
            <div
              className="absolute inset-0"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/categories/${t.id}`}
                  className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 정보 & 다운로드 */}
        <div className="md:w-1/2 w-full space-y-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          {data.description && (
            <p className="text-gray-700">{data.description}</p>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              disabled={remaining <= 0}
              className={`px-4 py-2 text-white rounded ${
                remaining > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Download
            </button>
            <Link
              href="https://www.buymeacoffee.com/openillust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <FaCoffee size={20} />
              <span>Buy me a coffee</span>
            </Link>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>* Up to 10 free downloads per day. Remaining: {remaining}</p>
            <p>* Commercial use allowed.</p>
            <p>* Modifications and derivative works permitted.</p>
            <p>* Resale or redistribution prohibited.</p>
            <p>
              * Attribution optional.&nbsp;
              <Link
                href="/info/terms"
                className="underline text-blue-600 hover:text-blue-800"
              >
                View license
              </Link>
            </p>
          </div>

          {/* 공유 버튼 */}
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
              className="flex items-center gap-2 px-2 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              <FaFacebookF size={15} />
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                  )}`,
                  '_blank'
                )
              }
              className="flex items-center gap-2 px-2 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              <FaTwitter size={15} />
            </button>
            <button
              onClick={() => navigator.share?.({ url: window.location.href })}
              className="flex items-center gap-2 px-2 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <FaShareAlt size={15} />
            </button>
          </div>

          {/* 배너 */}
          <div className="mt-6">
            <Banner />
          </div>
        </div>
      </div>

      {/* Related Images */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Related Images</h2>
          <div className="grid gap-4 overflow-x-auto pb-2 grid-flow-col grid-rows-2 md:grid-flow-row md:grid-cols-5 md:grid-rows-1">
            {related.map((img) => (
              <Link
                key={img.id}
                href={`/illustration/${img.id}`}
                className="relative block overflow-hidden rounded flex-shrink-0 w-[40vw] md:w-full"
              >
                <img
                  src={toCdnUrl(img.image_url)}
                  alt=""
                  className="w-full h-auto rounded"
                />
                <div
                  className="absolute inset-0"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDownload={handleDownload}
        remaining={remaining}
        buttonsEnabled={buttonsEnabled}
      />
    </div>
  );
};

export default IllustrationClient;
