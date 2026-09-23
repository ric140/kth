import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ImageCarouselProps {
  images: string[];
  title?: string;
  categoryName?: string;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  title = 'Service Photo',
  categoryName,
  className = '',
}) => {
  // Ensure we have at least one valid image string
  const validImages = images.length > 0 ? images : ['https://picsum.photos/seed/kth_default/1200/800'];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(() => new Array(validImages.length).fill(false));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Keep index in range if images change
  useEffect(() => {
    setCurrentIndex(0);
    setIsLoaded(new Array(validImages.length).fill(false));
  }, [images]);

  // Handle image load
  const handleImageLoaded = (index: number) => {
    setIsLoaded(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    setZoomLevel(1);
  }, [validImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setZoomLevel(1);
  }, [validImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [currentIndex]);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && validImages.length > 1 && !isLightboxOpen) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, validImages.length, nextSlide, isLightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isLightboxOpen]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      nextSlide(); // Swiped left
    } else if (diff < -45) {
      prevSlide(); // Swiped right
    }
    setTouchStartX(null);
  };

  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen);
    setZoomLevel(1);
  };

  return (
    <div className={`flex flex-col w-full select-none ${className}`}>
      {/* Main Carousel Card */}
      <div 
        className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] bg-gray-900 rounded-t-xl lg:rounded-tr-none lg:rounded-tl-xl overflow-hidden group shadow-inner"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            {categoryName && (
              <span className="bg-primary/85 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                {categoryName}
              </span>
            )}
            <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentIndex + 1} / {validImages.length} Photos</span>
            </span>
          </div>

          {/* Action buttons top right */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-200 text-white text-xs flex items-center justify-center cursor-pointer ${
                  isPlaying ? 'bg-secondary text-primary font-bold shadow-lg shadow-secondary/30' : 'bg-black/50 hover:bg-black/75'
                }`}
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={toggleLightbox}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer shadow-md"
              title="View full screen"
              aria-label="View full screen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slides Container */}
        <div className="w-full h-full relative overflow-hidden cursor-zoom-in" onClick={toggleLightbox}>
          {validImages.map((src, index) => {
            const isCurrent = index === currentIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out transform ${
                  isCurrent ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                {/* Blur backdrop for aspect ratios */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110"
                  style={{ backgroundImage: `url(${src})` }}
                />

                {/* Main image */}
                <img
                  src={src}
                  alt={`${title} - Photo ${index + 1}`}
                  onLoad={() => handleImageLoaded(index)}
                  className="w-full h-full object-cover object-center relative z-10 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to high quality placeholder if link broken
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${index + 10}/1200/800`;
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom Bar: Dots indicator */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-secondary shadow-sm shadow-secondary'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                }`}
                aria-label={`Jump to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {validImages.length > 1 && (
        <div className="bg-gray-900/90 border-t border-gray-800 p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <span>Photo Gallery</span>
              <span className="text-[11px] font-normal text-gray-500">({validImages.length} views)</span>
            </span>
            <span className="text-xs text-secondary font-medium hidden sm:inline-block">
              Click photo to enlarge
            </span>
          </div>

          <div
            ref={thumbnailContainerRef}
            className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent snap-x"
          >
            {validImages.map((src, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`relative flex-shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer snap-center group/thumb ${
                    isActive
                      ? 'border-secondary ring-2 ring-secondary/50 scale-102 shadow-lg shadow-secondary/20'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-600'
                  }`}
                  aria-label={`Select photo ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${index + 10}/200/150`;
                    }}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-secondary/10 pointer-events-none" />
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono pointer-events-none">
                    #{index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div
            className="flex items-center justify-between text-white pb-3 border-b border-gray-800 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                {title}
              </h4>
              <p className="text-xs text-gray-400">
                Photo {currentIndex + 1} of {validImages.length}
                {categoryName && ` • ${categoryName}`}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Zoom controls */}
              <div className="hidden sm:flex items-center space-x-1 bg-gray-800/80 rounded-lg p-1 border border-gray-700">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
                  title="Zoom out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xs font-mono px-1.5 text-gray-300">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
                  title="Zoom in"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="text-[10px] px-1.5 py-1 text-secondary hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white p-2.5 rounded-full border border-gray-700 cursor-pointer transition-colors"
                title="Close (Esc)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lightbox Main Image */}
          <div
            className="flex-grow flex items-center justify-center relative overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validImages[currentIndex]}
              alt={`${title} - Enlarged Photo ${currentIndex + 1}`}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[75vh] max-w-full object-contain transition-transform duration-200 rounded-lg shadow-2xl select-none"
            />

            {/* Modal Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                  title="Previous photo (Left Arrow)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                  title="Next photo (Right Arrow)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Strip */}
          {validImages.length > 1 && (
            <div
              className="flex justify-center items-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {validImages.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`w-14 h-10 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    index === currentIndex
                      ? 'border-secondary ring-2 ring-secondary/50 scale-105'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
