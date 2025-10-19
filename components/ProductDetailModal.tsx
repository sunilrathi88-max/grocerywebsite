import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Product, Review, ToastMessage, Variant, QnA as QnAType } from '../types';
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
import { GlobeIcon } from './icons/GlobeIcon';
import { TagIcon } from './icons/TagIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EyeIcon } from './icons/EyeIcon';
import QnA from './QnA';
import ProductSlider from './ProductSlider';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LeafIcon } from './icons/LeafIcon';
import { TruckIcon } from './icons/TruckIcon';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  onAddReview: (productId: number, review: Omit<Review, 'id'>) => void;
  onDeleteReview: (productId: number, reviewId: number) => void;
  onSelectCategoryAndClose: (category: string) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
  onAskQuestion: (productId: number, question: { author: string; question: string }) => void;
  onSelectProduct: (product: Product) => void;
  onNotifyMe: (productName: string) => void;
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/F8E3D9/333333?text=Tattva+Co.';
const PLACEHOLDER_THUMB = 'https://via.placeholder.com/100x100/F8E3D9/333333?text=Tattva+Co.';

// Mock data for "Frequently Bought Together"
const FBT_MOCK: { [key: number]: number[] } = {
  1: [2, 6], // Saffron -> Pepper, Garam Masala
  2: [1, 4], // Pepper -> Saffron, Turmeric
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, allProducts, onClose, onAddToCart, onAddReview, onDeleteReview, onSelectCategoryAndClose, addToast, onAskQuestion, onSelectProduct, onNotifyMe }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants.find(v => v.stock > 0) || product.variants[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'qna'>('description');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 10) + 2);
  const [isStickyButtonVisible, setStickyButtonVisible] = useState(false);

  const mainButtonRef = useRef<HTMLButtonElement>(null);

  // Handle image load errors with branded placeholder
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.src !== PLACEHOLDER_IMAGE) {
      img.src = PLACEHOLDER_IMAGE;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => Math.max(2, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyButtonVisible(!entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    if (mainButtonRef.current) {
      observer.observe(mainButtonRef.current);
    }

    return () => {
      if (mainButtonRef.current) {
        observer.unobserve(mainButtonRef.current);
      }
    };
  }, [mainButtonRef]);

  const media = useMemo(() => {
    const images = product.images.map(url => ({ type: 'image' as const, url, thumb: url }));
    const fallbackThumb = product.images[0] || PLACEHOLDER_THUMB;
    const videos = (product.videos || []).map(url => ({ type: 'video' as const, url, thumb: fallbackThumb }));
    return [...images, ...videos];
  }, [product.images, product.videos]);

  const frequentlyBoughtTogetherProducts = useMemo(() => {
    const fbtIds = FBT_MOCK[product.id] || [];
    return allProducts.filter(p => fbtIds.includes(p.id));
  }, [product.id, allProducts]);

  const [fbtSelection, setFbtSelection] = useState<number[]>(frequentlyBoughtTogetherProducts.map(p => p.id));

  const handleToggleFbt = (productId: number) => {
    setFbtSelection(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };
  
  const handleAddFbtToCart = () => {
    const itemsToAdd = [
      { product, variant: selectedVariant, quantity: 1 },
      ...frequentlyBoughtTogetherProducts
        .filter(p => fbtSelection.includes(p.id))
        .map(p => ({ product: p, variant: p.variants[0], quantity: 1 }))
    ];
    
    itemsToAdd.forEach(item => onAddToCart(item.product, item.variant, item.quantity));
    addToast(`${itemsToAdd.length} items added to cart!`, 'success');
  };

  const fbtSubtotal = useMemo(() => {
    const mainPrice = selectedVariant.salePrice ?? selectedVariant.price;
    const extrasPrice = frequentlyBoughtTogetherProducts
      .filter(p => fbtSelection.includes(p.id))
      .reduce((sum, p) => sum + (p.variants[0].salePrice ?? p.variants[0].price), 0);
    return mainPrice + extrasPrice;
  }, [selectedVariant, fbtSelection, frequentlyBoughtTogetherProducts]);


  const activeMedia = media[activeIndex];

  const handleNext = () => setActiveIndex(prev => (prev + 1) % media.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + media.length) % media.length);

  const isOutOfStock = useMemo(() => selectedVariant.stock === 0, [selectedVariant]);
  const isLowStock = useMemo(() => selectedVariant.stock > 0 && selectedVariant.stock <= 5, [selectedVariant]);
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
  const handleMouseLeave = () => setZoomStyle({});

  const breadcrumbItems = [
    { label: 'Home', onClick: () => onSelectCategoryAndClose('All') },
    { label: 'Products', onClick: () => onSelectCategoryAndClose('All') },
    { label: product.category, onClick: () => onSelectCategoryAndClose(product.category) },
    { label: product.name }
  ];

  const estimatedDelivery = useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);
  
  const recommendations = useMemo(() => {
    return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  }, [allProducts, product]);


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-0 sm:p-4 animate-fade-in" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-none sm:rounded-lg shadow-2xl w-full h-full sm:w-full sm:max-w-4xl sm:max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-serif font-bold text-brand-dark truncate">{product.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close product details">
            <XIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="px-6 pt-4 hidden sm:block">
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
                    onError={handleImageError}
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
                        <button onClick={handlePrev} className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-md hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Previous image"><ChevronLeftIcon className="h-6 w-6" /></button>
                        <button onClick={handleNext} className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-md hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Next image"><ChevronRightIcon className="h-6 w-6" /></button>
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
                            <img src={item.thumb} alt={`${product.name} thumbnail ${idx+1}`} className="w-full h-full object-cover" onError={handleImageError} />
                            {item.type === 'video' && (<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"><PlayIcon className="h-8 w-8 text-white drop-shadow-lg" /></div>)}
                        </button>
                    ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-red-500 font-bold mb-2 animate-pulse">
                <EyeIcon className="h-5 w-5" />
                <span>{viewers} people are viewing this right now</span>
              </div>
              
              {/* Variant Selection */}
              {product.variants.length > 1 && (
                  <div className="mb-4">
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
                <div className="mb-4">
                  {onSale ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-red-500 font-sans">${selectedVariant.salePrice!.toFixed(2)}</span>
                      <span className="text-2xl font-sans text-gray-500 line-through">${selectedVariant.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-brand-dark font-sans">${selectedVariant.price.toFixed(2)}</span>
                  )}
                   {isLowStock && (
                    <p className="text-yellow-600 font-bold mt-2">Hurry! Only {selectedVariant.stock} left in stock.</p>
                  )}
                   <p className="text-sm text-gray-600 mt-2">Estimated delivery by <span className="font-bold text-green-700">{estimatedDelivery}</span></p>
                </div>

                {isOutOfStock ? (
                  <button 
                    ref={mainButtonRef}
                    onClick={() => onNotifyMe(`${product.name} (${selectedVariant.name})`)}
                    className="w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
                  >
                    Notify Me When Available
                  </button>
                ) : (
                  <button 
                    ref={mainButtonRef}
                    onClick={() => onAddToCart(product, selectedVariant)}
                    className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                )}

                <div className="mt-4 flex items-center justify-around text-sm text-gray-600">
                    <div className="flex items-center gap-2"><ShieldCheckIcon className="h-5 w-5 text-green-600" /><span>Secure Checkout</span></div>
                    <div className="flex items-center gap-2"><LeafIcon className="h-5 w-5 text-green-600" /><span>Quality Assured</span></div>
                    <div className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-green-600" /><span>Fast Shipping</span></div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-2">Share this product:</p>
                    <div className="flex justify-center items-center gap-4">
                        <a href="#" aria-label="Share on Facebook" className="text-gray-400 hover:text-blue-600 transition-colors"><FacebookIcon /></a>
                        <a href="#" aria-label="Share on Twitter" className="text-gray-400 hover:text-blue-400 transition-colors"><TwitterIcon /></a>
                        <a href="#" aria-label="Share on Pinterest" className="text-gray-400 hover:text-red-600 transition-colors"><PinterestIcon /></a>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="p-6 border-t">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Description</button>
                    <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Reviews ({product.reviews.length})</button>
                    <button onClick={() => setActiveTab('qna')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'qna' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Q&A ({product.qna?.length || 0})</button>
                </nav>
              </div>
              
              <div>
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                    <div className="space-y-4 my-6">
                      {product.tags && product.tags.length > 0 && (<div className="flex items-start gap-3"><TagIcon className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" /><div><h4 className="font-bold text-sm text-gray-600">Tags:</h4><div className="flex flex-wrap gap-2 mt-1">{product.tags.map(tag => (<span key={tag} className="bg-brand-secondary text-brand-dark text-xs font-bold px-2 py-1 rounded-full">{tag}</span>))}</div></div></div>)}
                      {product.origin && (<div className="flex items-center gap-3"><GlobeIcon className="h-6 w-6 text-brand-primary flex-shrink-0" /><div><h4 className="font-bold text-sm text-gray-600">Origin:</h4><p className="text-brand-dark">{product.origin}</p></div></div>)}
                      {product.nutrition && product.nutrition.length > 0 && (<div className="flex items-start gap-3"><SparklesIcon className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" /><div><h4 className="font-bold text-sm text-gray-600 mb-1">Nutrition Highlights:</h4><ul className="text-sm text-brand-dark list-disc list-inside">{product.nutrition.map(n => <li key={n.key}><strong>{n.key}:</strong> {n.value}</li>)}</ul></div></div>)}
                    </div>
                  </div>
                )}
                 {activeTab === 'reviews' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><h4 className="font-bold text-brand-dark mb-4">Leave a Review</h4><ReviewForm onSubmit={(review) => onAddReview(product.id, review)} addToast={addToast} /></div>
                    <div><h4 className="font-bold text-brand-dark mb-4">What others are saying</h4><div className="max-h-64 overflow-y-auto pr-2 -mr-2 space-y-4"><ReviewList reviews={product.reviews} productId={product.id} onDelete={onDeleteReview} /></div></div>
                  </div>
                )}
                {activeTab === 'qna' && <QnA qna={product.qna || []} onAskQuestion={(q) => onAskQuestion(product.id, q)} />}
              </div>
          </div>

          {/* Frequently Bought Together */}
          {frequentlyBoughtTogetherProducts.length > 0 && (
            <div className="p-6 border-t bg-brand-accent/50">
              <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Frequently Bought Together</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center flex-wrap gap-4">
                  <div className="text-center w-24"><img src={product.images[0] || PLACEHOLDER_IMAGE} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow-md" onError={handleImageError} /><p className="text-xs mt-1 font-bold truncate">{product.name}</p></div>
                  {frequentlyBoughtTogetherProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className="text-2xl font-light text-gray-400">+</span>
                      <div className="flex items-center gap-2">
                         <input type="checkbox" id={`fbt-${p.id}`} checked={fbtSelection.includes(p.id)} onChange={() => handleToggleFbt(p.id)} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"/>
                         <label htmlFor={`fbt-${p.id}`} className="text-center w-24 cursor-pointer"><img src={p.images[0] || PLACEHOLDER_IMAGE} alt={p.name} className="w-24 h-24 object-cover rounded-lg shadow-md" onError={handleImageError} /><p className="text-xs mt-1 font-bold truncate">{p.name}</p></label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-inner text-center">
                  <p className="text-gray-600">Total Price: <span className="font-bold text-xl text-brand-dark">${fbtSubtotal.toFixed(2)}</span></p>
                  <button onClick={handleAddFbtToCart} className="mt-2 bg-brand-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
                    Add Selected to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="p-6 border-t">
              <ProductSlider 
                title="Customers Also Viewed" 
                products={recommendations} 
                onAddToCart={(p, v) => onAddToCart(p, v)} 
                onToggleWishlist={() => {}} 
                wishlistedIds={new Set()}
                onSelectProduct={onSelectProduct}
                onNotifyMe={onNotifyMe}
              />
            </div>
          )}
        </div>
        {/* Sticky add to cart button */}
        {isStickyButtonVisible && !isOutOfStock && (
            <div className="sticky bottom-0 left-0 right-0 md:hidden bg-white p-4 border-t shadow-lg-top animate-slide-up">
                 <button 
                  onClick={() => onAddToCart(product, selectedVariant)}
                  className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
                >
                  Add to Cart - ${onSale ? selectedVariant.salePrice!.toFixed(2) : selectedVariant.price.toFixed(2)}
                </button>
            </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .shadow-lg-top { box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1); }
        .prose { max-width: none; }
      `}</style>
    </div>
  );
};

export default ProductDetailModal;