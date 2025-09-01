// 파일 경로: src/components/DownloadModal.tsx
import React, { useEffect } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: 'svg' | 'png') => void;
  remaining: number;
  buttonsEnabled: boolean;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  remaining,
  buttonsEnabled,
}) => {
  // AdSense 광고 초기화
  useEffect(() => {
    if (isOpen && remaining > 0) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isOpen, remaining]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h2 className="text-lg font-bold text-gray-900">Select file format</h2>
        </div>

        <div className="p-6">
          {remaining > 0 ? (
            <>
              <p className="mb-6 text-sm text-gray-600">
                Up to 10 files/day. Please choose your preferred format.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => onDownload('svg')}
                  disabled={!buttonsEnabled}
                  className={`w-full px-6 py-4 text-white rounded-lg font-medium transition-all touch-manipulation ${
                    buttonsEnabled
                      ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>📁</span>
                    <span>SVG Download</span>
                  </div>
                  <div className="text-xs mt-1 opacity-90">Vector format • Scalable</div>
                </button>
                <button
                  onClick={() => onDownload('png')}
                  disabled={!buttonsEnabled}
                  className={`w-full px-6 py-4 text-white rounded-lg font-medium transition-all touch-manipulation ${
                    buttonsEnabled
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>🖼️</span>
                    <span>PNG Download</span>
                  </div>
                  <div className="text-xs mt-1 opacity-90">Raster format • High quality</div>
                </button>
              </div>
              
              {/* AdSense 광고 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <ins 
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-2152944666199864"
                    data-ad-slot="1362593602"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  ></ins>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600 font-medium">Download limit reached</p>
              <p className="text-sm text-gray-500 mt-2">Please come back tomorrow for more downloads.</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
