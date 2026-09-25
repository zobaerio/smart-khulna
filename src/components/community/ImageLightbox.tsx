import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Download,
  ExternalLink,
  Info
} from 'lucide-react';
import { PostImage } from '../../types/community';
import { downloadImageSafely } from '../../lib/downloadHelper';

interface ImageLightboxProps {
  images: PostImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  authorName?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  postTitle,
  authorName
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Touch Swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Sync initial index when modal opens or images change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (isOpen && thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentIndex, isOpen]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomLevel > 1) {
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(z => Math.min(3.5, z + 0.5));
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel(z => {
          const next = Math.max(1, z - 0.5);
          if (next === 1) setPanPosition({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, zoomLevel]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return; // Allow pinch/pan when zoomed
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (zoomLevel > 1 || touchStartX.current === null || touchEndX.current === null) return;
    
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = (touchStartY.current || 0) - (touchEndY.current || 0);

    // Horizontal swipe (left = next, right = prev)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (deltaY < -100 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
      // Swipe down to dismiss
      onClose();
    }

    // Reset touch refs
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Zoom helpers
  const zoomIn = () => setZoomLevel(z => Math.min(3.5, z + 0.5));
  const zoomOut = () => {
    setZoomLevel(z => {
      const next = Math.max(1, z - 0.5);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Convert number to Bengali
  const toBn = (n: number) => {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().replace(/\d/g, d => bnNums[parseInt(d, 10)]);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div
      ref={containerRef}
      id="community-image-lightbox"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div
        className="w-full flex items-center justify-between p-3 sm:p-4 text-white bg-gradient-to-b from-black/80 via-black/40 to-transparent z-30 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Counter & Title */}
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-wide shrink-0 border border-white/10 backdrop-blur-xs flex items-center gap-1.5">
            <span className="text-emerald-400">ছবি</span>
            <span>{toBn(currentIndex + 1)} / {toBn(images.length)}</span>
          </div>

          {(postTitle || authorName) && (
            <div className="hidden sm:block truncate text-xs text-slate-300">
              {postTitle ? (
                <span className="font-semibold text-white truncate mr-1.5">{postTitle}</span>
              ) : null}
              {authorName && <span className="text-slate-400">({authorName})</span>}
            </div>
          )}
        </div>

        {/* Right: Controls (Zoom, Fullscreen, Download, Info, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10 backdrop-blur-xs">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 transition cursor-pointer"
              title="জুম কমান (-)"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-[11px] font-mono px-1.5 min-w-10 text-center text-slate-200">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoomLevel >= 3.5}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 transition cursor-pointer"
              title="জুম বাড়ান (+)"
            >
              <ZoomIn size={16} />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition cursor-pointer"
                title="রিসেট (0)"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Info Toggle */}
          {currentImg.caption && (
            <button
              type="button"
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                showInfo ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="ছবির বিবরণ"
            >
              <Info size={16} />
            </button>
          )}

          {/* Download button */}
          <button
            type="button"
            onClick={async () => {
              const suggestedName = currentImg.caption
                ? `${currentImg.caption.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_').slice(0, 30)}.jpg`
                : `smartkhulna-photo-${toBn(currentIndex + 1)}.jpg`;
              await downloadImageSafely(currentImg.url, suggestedName);
            }}
            className="p-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-bold"
            title="ছবি ডাউনলোড করুন"
          >
            <Download size={16} />
            <span className="hidden sm:inline">ডাউনলোড</span>
          </button>

          {/* Open full size in new tab */}
          <a
            href={currentImg.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
            title="নতুন ট্যাবে সম্পূর্ণ ছবি দেখুন"
          >
            <ExternalLink size={16} />
          </a>

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
            title={isFullscreen ? 'ফুলস্ক্রিন থেকে বের হন' : 'ফুলস্ক্রিন করুন'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition cursor-pointer shadow-sm ml-1"
            title="বন্ধ করুন (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. MAIN IMAGE VIEWPORT WITH SWIPE AND PINCH/ZOOM */}
      <div
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-2 sm:px-12 py-2"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-4 z-30 p-3 sm:p-3.5 bg-black/60 hover:bg-emerald-700 text-white rounded-full transition cursor-pointer backdrop-blur-sm border border-white/15 shadow-xl hover:scale-105 active:scale-95"
            aria-label="Previous image"
            title="পূর্ববর্তী ছবি (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Display Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
            cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          onDoubleClick={() => {
            if (zoomLevel > 1) resetZoom();
            else setZoomLevel(2);
          }}
        >
          <img
            src={currentImg.url}
            alt={currentImg.caption || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-[72vh] sm:max-h-[76vh] object-contain rounded-lg shadow-2xl transition-all select-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-4 z-30 p-3 sm:p-3.5 bg-black/60 hover:bg-emerald-700 text-white rounded-full transition cursor-pointer backdrop-blur-sm border border-white/15 shadow-xl hover:scale-105 active:scale-95"
            aria-label="Next image"
            title="পরবর্তী ছবি (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Mobile Swipe Guidance Overlay hint (fades out) */}
        <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 text-slate-300 text-[10px] px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
          ছবি পরিবর্তনের জন্য সোয়াইপ করুন ↔
        </div>
      </div>

      {/* 3. CAPTION & METADATA BAR (IF AVAILABLE) */}
      {(currentImg.caption || showInfo) && (
        <div
          className="w-full max-w-3xl mx-auto px-4 py-2 text-center text-xs text-slate-200 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 mb-2 z-30 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          {currentImg.caption && (
            <p className="font-medium text-slate-100">{currentImg.caption}</p>
          )}
          {authorName && (
            <span className="text-[11px] text-slate-400 block mt-0.5">
              পোস্টকারী: {authorName}
            </span>
          )}
        </div>
      )}

      {/* 4. BOTTOM THUMBNAIL STRIP */}
      {images.length > 1 && (
        <div
          className="w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent py-3 px-4 z-30 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <div
            ref={thumbnailsRef}
            className="max-w-2xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          >
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setPanPosition({ x: 0, y: 0 });
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 border-2 cursor-pointer ${
                    isActive
                      ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/20 opacity-100 ring-2 ring-emerald-500/50'
                      : 'border-white/20 opacity-50 hover:opacity-90 hover:scale-102'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
