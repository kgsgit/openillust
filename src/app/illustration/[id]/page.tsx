// 파일 경로: src/app/illustration/[id]/page.tsx

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
  const { remaining, incrementLocalCount } = useDownloadLimit(illustrationId);

  // 1) 상세 데이터 로드
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

  // 2) 연관 이미지 로드
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

  // 3) 모달 내 버튼 활성 지연
  useEffect(() => {
    if (showModal && remaining > 0) {
      setButtonsEnabled(false);
      const t = setTimeout(() => setButtonsEnabled(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showModal, remaining]);

  // 4) 다운로드 핸들러 (SVG 직접 또는 Canvas→PNG 변환)
  const handleDownload = async (fmt: 'svg' | 'png') => {
    setShowModal(false);
    if (remaining <= 0) {
      alert('오늘 다운로드 한도(10회)를 모두 사용하셨습니다.');
      return;
    }

    // 4-1) RPC 호출 및 서명 URL 획득
    const rpcRes = await fetch(
      `/api/download?illustration=${illustrationId}&format=${fmt}&mode=signed`
    );
    const rpcJson = await rpcRes.json();
    if (!rpcRes.ok) {
      alert(rpcJson.error || '다운로드 실패');
      return;
    }
    const signedUrl = rpcJson.url as string;

    if (fmt === 'svg') {
      // SVG 직접 다운로드
      const fileRes = await fetch(signedUrl);
      if (!fileRes.ok) {
        alert('다운로드 실패');
        return;
      }
      const blob = await fileRes.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `${illustrationId}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
      incrementLocalCount();

    } else {
      // PNG 변환 다운로드 (해상도 2배 예시)
      const fileRes = await fetch(signedUrl);
      if (!fileRes.ok) {
        alert('다운로드 실패');
        return;
      }
      const svgText = await fileRes.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const scale = 3;  // 여기서 배율을 조정하세요 (예: 3, 4)
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(pngBlob => {
            if (pngBlob) {
              const pngUrl = URL.createObjectURL(pngBlob);
              const a = document.createElement('a');
              a.href = pngUrl;
              a.download = `${illustrationId}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(pngUrl);
              incrementLocalCount();
            } else {
              alert('PNG 변환 실패');
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(svgUrl);
      };
      img.onerror = () => {
        alert('PNG 변환 실패');
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    }
  };

  if (!data) return <div className="p-8 text-center">Loading…</div>;

  return (
    <main className="container mx-auto max-w-screen-lg px-4 py-8">
      {/* ... 이하 UI는 변동 없습니다 ... */}
      {/* 다운로드 포맷 선택 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 text-left">Select file format</h2>
            <hr className="border-gray-300 mb-4" />
            {remaining > 0 ? (
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleDownload('svg')}
                  disabled={!buttonsEnabled}
                  className={`flex-1 px-4 py-2 text-white rounded ${
                    buttonsEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'
                  }`}
                >
                  SVG Download
                </button>
                <button
                  onClick={() => handleDownload('png')}
                  disabled={!buttonsEnabled}
                  className={`flex-1 px-4 py-2 text-white rounded ${
                    buttonsEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                  }`}
                >
                  PNG Download
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Download limit reached. Please come back tomorrow.
              </p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
