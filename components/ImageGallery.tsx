import React, { useState, useEffect, MouseEvent } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlayIcon } from './icons/PlayIcon';

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
    const [activeMedia, setActiveMedia] = useState<MediaItem>(media[0]);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        setActiveMedia(media[0]);
    }, [media]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
    };

    const handlePrev = (e: MouseEvent) => {
        e.stopPropagation();
        const currentIndex = media.findIndex((m) => m.url === activeMedia.url);
        const prevIndex = (currentIndex - 1 + media.length) % media.length;
        setActiveMedia(media[prevIndex]);
    };

    const handleNext = (e: MouseEvent) => {
        e.stopPropagation();
        const currentIndex = media.findIndex((m) => m.url === activeMedia.url);
        const nextIndex = (currentIndex + 1) % media.length;
        setActiveMedia(media[nextIndex]);
    };

    const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
    };

    return (
        <div>
            <div
                className="relative bg-gray-200 rounded-lg overflow-hidden group mb-4 cursor-zoom-in"
                onMouseMove={activeMedia?.type === 'image' ? handleMouseMove : undefined}
                onMouseLeave={activeMedia?.type === 'image' ? handleMouseLeave : undefined}
            >
                {activeMedia?.type === 'image' ? (
                    <OptimizedImage
                        src={activeMedia.url}
                        alt={productName}
                        className="w-full h-auto object-cover aspect-square rounded-lg shadow-md transition-transform duration-300 ease-in-out"
                        type="detail"
                        priority="high"
                        width={800}
                        height={800}
                        onError={handleMainImageError}
                        style={zoomStyle}
                    />
                ) : activeMedia?.type === 'video' ? (
                    <video
                        key={activeMedia.url}
                        src={activeMedia.url}
                        className="w-full h-auto object-cover aspect-square rounded-lg shadow-md"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : null}

                {media.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-md hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-md hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    </>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none">
                        <span className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full text-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {media.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                    {media.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveMedia(item)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeMedia.url === item.url ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <OptimizedImage
                                src={item.thumb}
                                alt={`${productName} view ${idx + 1}`}
                                className="w-full h-full object-cover"
                                type="thumbnail"
                                width={80}
                                height={80}
                            />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <PlayIcon className="h-8 w-8 text-white opacity-80" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
