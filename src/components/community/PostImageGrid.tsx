import React, { useState } from 'react';
import { Maximize2, Layers, ImageOff } from 'lucide-react';
import { PostImage } from '../../types/community';
import { ImageLightbox } from './ImageLightbox';

interface PostImageGridProps {
  images: PostImage[];
  postTitle?: string;
  authorName?: string;
  className?: string;
}

export const PostImageGrid: React.FC<PostImageGridProps> = ({
  images,
  postTitle,
  authorName,
  className = ''
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (!images || images.length === 0) return null;

  const handleImageError = (imgIdOrIdx: string | number) => {
    setFailedImages(prev => ({ ...prev, [imgIdOrIdx]: true }));
  };

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const totalCount = images.length;

  return (
    <>
      <div
        className={`relative w-full overflow-hidden bg-slate-900/5 select-none ${className}`}
      >
        {/* ================= 1 IMAGE LAYOUT ================= */}
        {totalCount === 1 && (
          <div
            className="relative w-full max-h-[460px] overflow-hidden cursor-pointer bg-slate-950 flex items-center justify-center group"
            onClick={() => openLightbox(0)}
          >
            {failedImages[images[0].id || 0] ? (
              <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 gap-2">
                <ImageOff size={32} />
                <span className="text-xs">ছবি লোড করা যায়নি</span>
              </div>
            ) : (
              <>
                <img
                  src={images[0].url}
                  alt={images[0].caption || postTitle || 'Post image'}
                  onError={() => handleImageError(images[0].id || 0)}
                  className="w-full max-h-[460px] object-cover sm:object-contain group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {images[0].caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white text-xs">
                    <p className="line-clamp-2">{images[0].caption}</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md">
                  <Maximize2 size={15} />
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= 2 IMAGES LAYOUT ================= */}
        {totalCount === 2 && (
          <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-80">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative h-full overflow-hidden cursor-pointer group bg-slate-100"
                onClick={() => openLightbox(idx)}
              >
                {failedImages[img.id || idx] ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 gap-1 text-xs">
                    <ImageOff size={24} />
                    <span>ছবি লোড ব্যর্থ</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={img.url}
                      alt={img.caption || `Post image ${idx + 1}`}
                      onError={() => handleImageError(img.id || idx)}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[11px] truncate">
                        {img.caption}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                      <Maximize2 size={13} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= 3 IMAGES LAYOUT ================= */}
        {totalCount === 3 && (
          <div className="grid grid-cols-3 gap-1.5 h-72 sm:h-88">
            {/* 1st image: takes 2 columns */}
            <div
              className="col-span-2 relative h-full overflow-hidden cursor-pointer group bg-slate-100"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0].url}
                alt={images[0].caption || 'Post image 1'}
                onError={() => handleImageError(images[0].id || 0)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {images[0].caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white text-xs truncate">
                  {images[0].caption}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                <Maximize2 size={13} />
              </div>
            </div>

            {/* 2nd & 3rd images: stacked vertically in 1 column */}
            <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
              {images.slice(1, 3).map((img, subIdx) => {
                const actualIdx = subIdx + 1;
                return (
                  <div
                    key={img.id || actualIdx}
                    className="relative h-full overflow-hidden cursor-pointer group bg-slate-100"
                    onClick={() => openLightbox(actualIdx)}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Post image ${actualIdx + 1}`}
                      onError={() => handleImageError(img.id || actualIdx)}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                      <Maximize2 size={11} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4 IMAGES LAYOUT ================= */}
        {totalCount === 4 && (
          <div className="grid grid-cols-2 gap-1.5 h-72 sm:h-96">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative h-full overflow-hidden cursor-pointer group bg-slate-100"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Post image ${idx + 1}`}
                  onError={() => handleImageError(img.id || idx)}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[11px] truncate">
                    {img.caption}
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                  <Maximize2 size={12} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 5+ IMAGES LAYOUT ================= */}
        {totalCount >= 5 && (
          <div className="space-y-1.5">
            {/* Top row: 2 images */}
            <div className="grid grid-cols-2 gap-1.5 h-44 sm:h-56">
              {images.slice(0, 2).map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative h-full overflow-hidden cursor-pointer group bg-slate-100"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Post image ${idx + 1}`}
                    onError={() => handleImageError(img.id || idx)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <Maximize2 size={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row: 3 tiles (if > 5, 3rd tile has a frosted +N overlay) */}
            <div className="grid grid-cols-3 gap-1.5 h-32 sm:h-44">
              {images.slice(2, 5).map((img, subIdx) => {
                const actualIdx = subIdx + 2;
                const isLastVisibleTile = subIdx === 2;
                const remainingCount = totalCount - 5;
                const showRemainingBadge = isLastVisibleTile && remainingCount > 0;

                return (
                  <div
                    key={img.id || actualIdx}
                    className="relative h-full overflow-hidden cursor-pointer group bg-slate-100"
                    onClick={() => openLightbox(actualIdx)}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Post image ${actualIdx + 1}`}
                      onError={() => handleImageError(img.id || actualIdx)}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        showRemainingBadge ? 'brightness-75' : 'group-hover:scale-[1.03]'
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Overflow "+N" Overlay */}
                    {showRemainingBadge ? (
                      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition hover:bg-black/65">
                        <div className="flex items-center gap-1">
                          <Layers size={18} className="text-emerald-400" />
                          <span className="text-lg sm:text-2xl font-bold tracking-tight">
                            +{remainingCount}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-200 mt-0.5">
                          আরও ছবি দেখুন
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-1.5 right-1.5 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        <Maximize2 size={11} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= LIGHTBOX MODAL WITH SWIPE & KEYBOARD SUPPORT ================= */}
      <ImageLightbox
        images={images}
        initialIndex={activeLightboxIndex ?? 0}
        isOpen={activeLightboxIndex !== null}
        onClose={closeLightbox}
        postTitle={postTitle}
        authorName={authorName}
      />
    </>
  );
};
