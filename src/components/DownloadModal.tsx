// 파일 경로: src/components/DownloadModal.tsx
import React from 'react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2 text-left">Select file format</h2>
        <hr className="border-gray-300 mb-4" />

        {remaining > 0 ? (
          <>
            <p className="mb-4 text-sm text-gray-600 text-left">
              Up to 10 files/day. Please choose.
            </p>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => onDownload('svg')}
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
                onClick={() => onDownload('png')}
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
            Download limit reached. Please come back tomorrow.
          </p>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
