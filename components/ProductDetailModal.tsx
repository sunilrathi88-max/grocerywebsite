import React, { useState, useRef, useMemo } from 'react';
import { Product, Review, ToastMessage, Variant } from '../types';
import { XIcon } from './icons/XIcon';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import Breadcrumbs from './Breadcrumbs';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlayIcon } from './icons/PlayIcon';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant) => void;
  onAddReview: (productId: number, review: Omit<Review, 'id'>) => void;
  onDeleteReview: (productId: number, reviewId: number) => void;
  onSelectCategoryAndClose: (category: string) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
}

const PLACEHOLDER_THUMB = 'https://via.placeholder.com/100x100.png?text=Tattva+Co.';

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onAddReview, onDeleteReview, onSelectCategoryAndClose, addToast }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants.find(v => v.stock > 0) || product.variants[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const media = useMemo(() => {
    const images = product.images.map(url => ({ type: 'image' as const, url, thumb: url }));
    const fallbackThumb = product.images[0] || PLACEHOLDER_THUMB;
    const videos = (product.videos || []).map(url => ({ type: 'video' as const, url, thumb: fallbackThumb }));
    return [...images, ...videos];
  }, [product.images, product.videos]);

  const activeMedia = media[activeIndex];

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + media.length) % media.length);
  };

  const isOutOfStock = useMemo(() => selectedVariant.stock === 0, [selectedVariant]);
  const onSale = useMemo(() => selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.price, [selectedVariant]);

  const [zoomStyle, setZoomStyle] = useState({});
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imageRef.current || activeMedia?.type !== 'image') return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => onSelectCategoryAndClose('All') },
    { label: 'Products', onClick: () => onSelectCategoryAndClose('All') },
    { label: product.category, onClick: () => onSelectCategoryAndClose(product.category) },
    { label: product.name }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-serif font-bold text-brand-dark">{product.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close product details">
            <XIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="px-6 pt-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column: Media Gallery */}
            <div>
              <div 
                className="relative bg-gray-200 rounded-lg overflow-hidden group mb-4"
                onMouseMove={activeMedia?.type === 'image' ? handleMouseMove : undefined}
                onMouseLeave={activeMedia?.type === 'image' ? handleMouseLeave : undefined}
              >
                {activeMedia?.type === 'image' ? (
                  <img 
                    ref={imageRef}
                    src={activeMedia.url} 
                    alt={product.name} 
                    className="w-full h-auto object-cover aspect-square rounded-lg shadow-md transition-transform duration-300 ease-in-out group-hover:scale-150"
                    style={zoomStyle}
                    loading="lazy"
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
                ) : null }

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
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                      <span className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              {media.length > 1 && (
                <div className="flex gap-2 justify-center">
                    {media.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveIndex(idx)} 
                            className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${activeIndex === idx ? 'border-brand-primary' : 'border-transparent hover:border-brand-primary/50'}`}
                            aria-label={`View ${item.type} ${idx + 1}`}
                        >
                            <img src={item.thumb} alt={`${product.name} thumbnail ${idx+1}`} className="w-full h-full object-cover"/>
                            {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <PlayIcon className="h-8 w-8 text-white drop-shadow-lg" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col">
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              {/* Variant Selection */}
              {product.variants.length > 1 && (
                  <div className="mb-6">
                      <h4 className="font-bold text-sm text-gray-600 mb-2">Size / Weight:</h4>
                      <div className="flex flex-wrap gap-2">
                          {product.variants.map(variant => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 border ${
                                  selectedVariant.id === variant.id
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                    : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'
                                } ${variant.stock === 0 ? 'line-through text-gray-400 cursor-not-allowed' : ''}`}
                                disabled={variant.stock === 0}
                              >
                                  {variant.name}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
              
              <div className="mt-auto">
                <div className="mb-6">
                  {onSale ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-red-500 font-sans">${selectedVariant.salePrice!.toFixed(2)}</span>
                      <span className="text-2xl font-sans text-gray-500 line-through">${selectedVariant.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-brand-dark font-sans">${selectedVariant.price.toFixed(2)}</span>
                  )}
                </div>
                <button 
                  onClick={() => onAddToCart(product, selectedVariant)}
                  disabled={isOutOfStock}
                  className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Add to Cart
                </button>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-2">Share this product:</p>
                    <div className="flex justify-center items-center gap-4">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <FacebookIcon />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20out%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                            <TwitterIcon />
                        </a>
                        <a href={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(media[0].url)}&description=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Pinterest" className="text-gray-400 hover:text-red-600 transition-colors">
                            <PinterestIcon />
                        </a>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="p-6 border-t bg-brand-accent/50">
            <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-brand-dark mb-4">Leave a Review</h4>
                <ReviewForm onSubmit={(review) => onAddReview(product.id, review)} addToast={addToast} />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark mb-4">What others are saying</h4>
                <div className="max-h-64 overflow-y-auto pr-2 -mr-2 space-y-4">
                    <ReviewList reviews={product.reviews} productId={product.id} onDelete={onDeleteReview} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailModal;