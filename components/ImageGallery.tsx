import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import Slider from 'react-slick';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlayIcon } from './icons/PlayIcon';

// Add type declaration for react-slick if missing
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumb: string;
}

interface ImageGalleryProps {
  media: MediaItem[];
  productName: string;
  isOutOfStock?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ media, productName, isOutOfStock }) => {
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable zoom on mobile
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
    setIsZooming(false);
  };

  const handleMainImageError = imageErrorHandlers.product;

  const mainSliderSettings = {
    dots: false,
    infinite: media.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We'll use custom arrows or rely on swipe
    asNavFor: nav2 || undefined,
    beforeChange: (_current: number, next: number) => setActiveSlide(next),
  };

  const thumbSliderSettings = {
    dots: false,
    infinite: media.length > 1,
    speed: 500,
    slidesToShow: Math.min(media.length, 4),
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    asNavFor: nav1 || undefined,
    centerMode: false,
    arrows: false,
  };

  // Custom Arrows
  const next = () => {
    slider1.current?.slickNext();
  };
  const previous = () => {
    slider1.current?.slickPrev();
  };

  return (
    <div className="image-gallery-wrapper">
      <div
        className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 group"
        onMouseMove={media[activeSlide]?.type === 'image' ? handleMouseMove : undefined}
        onMouseLeave={media[activeSlide]?.type === 'image' ? handleMouseLeave : undefined}
      >
        <Slider ref={slider1} {...mainSliderSettings} className="main-slider">
          {media.map((item, idx) => (
            <div key={`${item.url}-${idx}`} className="outline-none">
              <div className="relative aspect-square w-full overflow-hidden">
                {item.type === 'image' ? (
                  <OptimizedImage
                    src={item.url}
                    alt={`${productName} - View ${idx + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZooming && activeSlide === idx ? '' : ''}`}
                    type="detail"
                    priority={idx === 0 ? 'high' : 'auto'}
                    width={800}
                    height={800}
                    onError={handleMainImageError}
                    style={activeSlide === idx ? zoomStyle : {}}
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
                    <span className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full text-lg shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>

        {/* Custom Navigation Arrows (Desktop mainly, but visible on mobile tap) */}
        {media.length > 1 && (
          <>
            <button
              onClick={previous}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm z-10 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6 text-brand-dark" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm z-10 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6 text-brand-dark" />
            </button>
          </>
        )}

        {/* Mobile Dots/Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none md:hidden z-10">
          {activeSlide + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnail Slider */}
      {media.length > 1 && (
        <div className="thumb-slider-wrapper px-2">
          <Slider ref={slider2} {...thumbSliderSettings} className="thumb-slider -mx-2">
            {media.map((item, idx) => (
              <div key={`thumb-${idx}`} className="px-2 outline-none">
                <div
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    activeSlide === idx
                      ? 'border-brand-primary ring-1 ring-brand-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <OptimizedImage
                    src={item.thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    type="thumbnail"
                    width={100}
                    height={100}
                    onError={imageErrorHandlers.thumb}
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayIcon className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      <style>{`
        .slick-track { display: flex !important; }
        .slick-slide { height: auto; }
        .slick-slide > div { height: 100%; }
      `}</style>
    </div>
  );
};

export default ImageGallery;
