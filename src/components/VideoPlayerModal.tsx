
import React, { useEffect, useRef } from 'react';
import { ResultItem } from '../utils/types';
import { XIcon } from './icons/XIcon';

interface VideoPlayerModalProps {
  result: ResultItem;
  startTime: number;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ result, startTime, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Set the start time and play the video
      video.currentTime = startTime;
      video.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Modal video play failed:", error);
        }
      });
    }

    // Add keyboard listener for closing the modal with Escape key
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
          onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [startTime, onClose]);

  // This modal is only for videos
  if (result.type !== 'video') {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-title"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden relative border border-slate-700"
        onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking on content
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Close video player"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="w-full aspect-video bg-black">
            <video
                ref={videoRef}
                src={result.fullUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
            >
                Your browser does not support the video tag.
            </video>
        </div>
        
        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
            <h2 id="video-title" className="text-lg font-bold text-white truncate mb-4">{result.title}</h2>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors text-sm font-semibold">
                    Utility Button 1
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors text-sm font-semibold">
                    Utility Button 2
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors text-sm font-semibold">
                    Utility Button 3
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
