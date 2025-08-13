
import React, { useState, useRef, useEffect } from 'react';
import { ResultItem } from '../utils/types';
import { getRankColor } from '../utils/color';
import { PlayIcon } from './icons/PlayIcon';

interface ResultCardProps {
  result: ResultItem;
  onViewResult: (result: ResultItem, currentTime: number) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onViewResult }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const borderColor = getRankColor(result.sourceVideoId);

  // Custom hook to manage video segment looping
  useEffect(() => {
    const video = videoRef.current;
    // Ensure all conditions are met to set up the loop handler
    if (
      !video ||
      result.type !== 'video' ||
      typeof result.startTime !== 'number' ||
      typeof result.endTime !== 'number'
    ) {
      return;
    }

    const onTimeUpdate = () => {
      // When current time exceeds the segment's end, loop back to the start.
      if (video.currentTime >= result.endTime!) {
        video.currentTime = result.startTime!;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);

    // Cleanup listener on component unmount or when dependencies change
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [result.startTime, result.endTime, result.type]);


  const handleMouseEnter = () => {
    if (result.type === 'video' && result.videoPreviewUrl) {
      hoverTimeoutRef.current = window.setTimeout(() => {
        setIsHovering(true);
        const video = videoRef.current;
        if (video) {
          // Set the start time for the preview segment
          video.currentTime = result.startTime ?? 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              if (error.name !== 'AbortError') {
                console.error("Video play failed:", error);
              }
            });
          }
        }
      }, 300); // Small delay to prevent accidental hovers
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (result.type === 'video') {
      setIsHovering(false);
      const video = videoRef.current;
      if (video) {
        video.pause();
        // Reset to the start of the segment, not just 0
        video.currentTime = result.startTime ?? 0;
      }
    }
  };

  const handleClick = () => {
    if (result.type === 'video') {
      // If the video is playing, use its current time. Otherwise, default to the segment start time.
      const currentTime = videoRef.current?.paused === false ? videoRef.current.currentTime : (result.startTime ?? 0);
      onViewResult(result, currentTime);
    }
  };

  return (
    <div
      className={`group relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/20 ${result.type === 'video' ? 'cursor-pointer' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="listitem"
      aria-label={`Result: ${result.title}`}
    >
      <div
        className="absolute inset-0 border-2 rounded-lg transition-colors"
        style={{ borderColor: borderColor }}
      ></div>
      
      {result.type === 'video' && result.videoPreviewUrl ? (
        <>
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            className={`w-full h-full object-contain transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
          />
          <video
            ref={videoRef}
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={result.videoPreviewUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayIcon className="w-12 h-12 text-white/80" />
          </div>
        </>
      ) : (
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <span className="absolute top-1 left-1 bg-black/50 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          #{result.rank}
        </span>
        <p className="text-sm font-semibold text-white truncate text-right mt-4">{result.title}</p>
      </div>
    </div>
  );
};
