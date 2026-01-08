import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Product, Review, ToastMessage, Variant, Recipe } from '../types';
import { XIcon } from './icons/XIcon';
import { OptimizedImage } from './OptimizedImage';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import ReviewSummary from './ReviewSummary';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

import { GlobeIcon } from './icons/GlobeIcon';
import { TagIcon } from './icons/TagIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EyeIcon } from './icons/EyeIcon';
import QnA from './QnA';
import ProductSlider from './ProductSlider';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LeafIcon } from './icons/LeafIcon';
import { UsersIcon } from './icons/UsersIcon';

import TrustBadges from './TrustBadges';
import CertificationsBanner from './CertificationsBanner';
import ImageGallery from './ImageGallery';
import { getBundleSuggestions } from '../utils/recommendations';
import PincodeChecker from './PincodeChecker';
import { FrequentlyBoughtTogether } from './FrequentlyBoughtTogether';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  recipes: Recipe[];
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  onAddReview: (productId: number, review: Omit<Review, 'id'>) => void;
  onDeleteReview: (productId: number, reviewId: number) => void;
  onSelectCategoryAndClose: (category: string) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
  onAskQuestion: (productId: number, question: { author: string; question: string }) => void;
  onSelectProduct: (product: Product) => void;
  onNotifyMe: (productName: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  isOpen: boolean;
}

import { PLACEHOLDER_URLS, imageErrorHandlers } from '../utils/imageHelpers';
import { useViewingHistory } from '../hooks/useViewingHistory';

import { SEO } from './SEO';
import {
  pageSEO,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateRecipeSchema,
} from '../utils/seo';

const PLACEHOLDER_THUMB = PLACEHOLDER_URLS.thumb;

// Mock data for "Frequently Bought Together"
const FBT_MOCK: { [key: number]: number[] } = {
  1: [2, 6], // Saffron -> Pepper, Garam Masala
  2: [1, 4], // Pepper -> Saffron, Turmeric
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  allProducts,
  recipes,
  onClose,
  onAddToCart,
  onAddReview,
  onDeleteReview,
  onSelectCategoryAndClose,
  addToast,
  onAskQuestion,
  onSelectProduct,
  onNotifyMe,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.stock > 0) || product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

  // Reset quantity on product change handled by key prop on container
  // useEffect(() => {
  //   setQuantity(1);
  // }, [product.id]);

  const { addToHistory } = useViewingHistory();

  useEffect(() => {
    if (isOpen && product) {
      addToHistory(product);
    }
  }, [isOpen, product, addToHistory]);

  const [activeTab, setActiveTab] = useState<
    'description' | 'nutrition' | 'sourcing' | 'reviews' | 'qna' | 'recipes' | ''
  >('description');
  // Use lazy initialization to set random viewer count only once
  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 10) + 2);
  // const [isStickyButtonVisible, setStickyButtonVisible] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);

  // Image error handlers

  const handleThumbImageError = imageErrorHandlers.thumb;

  const mainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => Math.max(2, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* Removed unused sticky button observer effect */

  const isOutOfStock = selectedVariant.stock === 0;
  // const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock < 10;
  const onSale =
    selectedVariant.salePrice !== undefined && selectedVariant.salePrice < selectedVariant.price;

  const relatedRecipes = useMemo(() => {
    return recipes ? recipes.filter((r) => r.relatedProductIds.includes(product.id)) : [];
  }, [recipes, product.id]);

  const media = useMemo(() => {
    const images = product.images.map((url) => ({ type: 'image' as const, url, thumb: url }));
    const fallbackThumb = product.images[0] || PLACEHOLDER_THUMB;
    const videos = (product.videos || []).map((url) => ({
      type: 'video' as const,
      url,
      thumb: fallbackThumb,
    }));
    return [...images, ...videos];
  }, [product.images, product.videos]);

  const frequentlyBoughtTogetherProducts = useMemo(() => {
    const fbtIds = FBT_MOCK[product.id] || [];
    return allProducts.filter((p) => fbtIds.includes(p.id));
  }, [product.id, allProducts]);

  const [fbtSelection, setFbtSelection] = useState<number[]>(
    frequentlyBoughtTogetherProducts.map((p) => p.id)
  );

  const handleToggleFbt = (productId: number) => {
    setFbtSelection((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddFbtToCart = () => {
    const itemsToAdd = [
      { product, variant: selectedVariant, quantity: 1 },
      ...frequentlyBoughtTogetherProducts
        .filter((p) => fbtSelection.includes(p.id))
        .map((p) => ({ product: p, variant: p.variants[0], quantity: 1 })),
    ];

    itemsToAdd.forEach((item) => onAddToCart(item.product, item.variant, item.quantity));
    addToast(`${itemsToAdd.length} items added to cart!`, 'success');
  };

  const fbtSubtotal = useMemo(() => {
    const mainPrice = selectedVariant.salePrice ?? selectedVariant.price;
    const extrasPrice = frequentlyBoughtTogetherProducts
      .filter((p) => fbtSelection.includes(p.id))
      .reduce((sum, p) => sum + (p.variants[0].salePrice ?? p.variants[0].price), 0);
    return mainPrice + extrasPrice;
  }, [selectedVariant, fbtSelection, frequentlyBoughtTogetherProducts]);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => onSelectCategoryAndClose('All') },
    { label: 'Products', onClick: () => onSelectCategoryAndClose('All') },
    { label: product.category, onClick: () => onSelectCategoryAndClose(product.category) },
    { label: product.name },
  ];

  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const recommendations = useMemo(() => {
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 5);
  }, [allProducts, product]);

  // SEO Configuration
  const seoConfig = useMemo(() => pageSEO.product(product.name, product.description), [product]);

  // Structured Data with correct type aggregation
  const structuredData = useMemo(() => {
    const schemas: Record<string, unknown>[] = [];

    // 1. Product Schema
    schemas.push(generateProductSchema(product));

    // 2. Breadcrumb Schema
    schemas.push(
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://tattva-co.com' },
        { name: 'Products', url: 'https://tattva-co.com/products' },
        { name: product.category, url: `https://tattva-co.com/products/${product.category}` },
        { name: product.name, url: `https://tattva-co.com/products/${product.id}` }, // Fallback URL
      ])
    );

    // 3. Recipe Schema (if related recipes exist)
    if (relatedRecipes.length > 0) {
      relatedRecipes.forEach((recipe) => {
        schemas.push(generateRecipeSchema(recipe));
      });
    }

    return schemas;
  }, [product, relatedRecipes]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <SEO {...seoConfig} structuredData={structuredData} />
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        key={product.id}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pb-32 md:pb-0">
          <div className="px-6 pt-4 hidden sm:block">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column: Media Gallery */}
            <div>
              <ImageGallery media={media} productName={product.name} isOutOfStock={isOutOfStock} />
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
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 border ${
                          selectedVariant.id === variant.id
                            ? 'bg-brand-primary text-brand-dark border-brand-primary shadow-md'
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
                      <span className="text-4xl font-bold text-red-500 font-sans">
                        ₹{selectedVariant.salePrice!.toFixed(2)}
                      </span>
                      <span className="text-2xl font-sans text-gray-500 line-through">
                        ₹{selectedVariant.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-brand-dark font-sans">
                      ₹{selectedVariant.price.toFixed(2)}
                    </span>
                  )}
                  {/* Price per 100g calculation */}
                  <p className="text-sm text-gray-500 mt-1">
                    (
                    {(() => {
                      const price = selectedVariant.salePrice ?? selectedVariant.price;
                      // Extract weight from variant name (e.g., "250g", "1kg")
                      const match = selectedVariant.name.match(/(\d+)(g|kg)/i);
                      if (match) {
                        let weightInGrams = parseInt(match[1]);
                        if (match[2].toLowerCase() === 'kg') {
                          weightInGrams *= 1000;
                        }
                        const pricePer100g = (price / weightInGrams) * 100;
                        return `₹${pricePer100g.toFixed(2)} / 100g`;
                      }
                      return '';
                    })()}
                    )
                  </p>
                  {/* Stock Bar */}
                  {selectedVariant.stock < 20 && selectedVariant.stock > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-orange-600">
                          Hurry! Only {selectedVariant.stock} left
                        </span>
                        <span className="text-gray-500">
                          {Math.min(100, Math.round((selectedVariant.stock / 50) * 100))}% Sold
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                          style={{
                            width: `${Math.max(5, 100 - (selectedVariant.stock / 20) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Micro-Badges Promotion */}
                  {product.tags &&
                    product.tags.some((tag) =>
                      ['Organic', 'Vegan', 'Gluten-Free', 'Non-GMO'].includes(tag)
                    ) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {product.tags
                          .filter((tag) =>
                            ['Organic', 'Vegan', 'Gluten-Free', 'Non-GMO'].includes(tag)
                          )
                          .map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-100"
                            >
                              <CheckBadgeIcon className="h-3 w-3" /> {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  <p className="text-sm text-gray-600 mt-2">
                    Estimated delivery by{' '}
                    <span className="font-bold text-green-700">{estimatedDelivery}</span>
                  </p>
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:static md:bg-transparent md:border-t-0 md:shadow-none md:p-0">
                  <div className="flex gap-3 md:block max-w-7xl mx-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 w-auto md:mb-4">
                      <label className="font-bold text-sm text-gray-600 hidden md:block">
                        Quantity:
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-3 md:py-1 text-gray-600 hover:bg-gray-100 transition-colors" // Larger tap area on mobile
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          readOnly
                          className="w-8 md:w-12 text-center border-x border-gray-300 py-1 text-gray-900 font-medium focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-3 md:py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    {isOutOfStock ? (
                      <button
                        ref={mainButtonRef}
                        onClick={() => onNotifyMe(`${product.name} (${selectedVariant.name})`)}
                        className="flex-1 w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
                      >
                        Notify Me
                      </button>
                    ) : (
                      <button
                        ref={mainButtonRef}
                        disabled={isOutOfStock}
                        onClick={() => {
                          const finalPrice = isSubscription
                            ? Math.floor(
                                (onSale ? selectedVariant.salePrice! : selectedVariant.price) * 0.9
                              )
                            : onSale
                              ? selectedVariant.salePrice!
                              : selectedVariant.price;

                          const variantToAdd = isSubscription
                            ? {
                                ...selectedVariant,
                                price: finalPrice,
                                salePrice: undefined,
                                name: selectedVariant.name + ' (Subscribed)',
                              }
                            : selectedVariant;

                          onAddToCart(product, variantToAdd, quantity);
                          if (isSubscription) {
                            addToast('Subscribed! Deliver every 30 days.', 'success');
                          }
                        }}
                        className={`flex-1 w-full bg-brand-primary text-brand-dark font-bold py-3 md:py-4 px-4 md:px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 ${
                          isOutOfStock ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                        }`}
                      >
                        <span className="whitespace-nowrap">Add to Cart - </span>
                        <span>
                          ₹
                          {(
                            (onSale ? selectedVariant.salePrice! : selectedVariant.price) * quantity
                          ).toFixed(2)}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <PincodeChecker />
                  </div>
                </div>

                <div className="mt-6 border border-gray-100 bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Product Specifications
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Form', value: product.grind },
                      { label: 'Origin', value: product.origin },
                      { label: 'Grade', value: product.grade },
                      { label: 'Purity', value: product.purityTest },
                      { label: 'Harvest Date', value: product.harvestDate },
                    ].map((item) =>
                      item.value ? (
                        <div
                          key={item.label}
                          className="flex justify-between border-b border-gray-200 last:border-0 pb-2 last:pb-0 border-dashed"
                        >
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium text-gray-900 text-right capitalize">
                            {item.value}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">
                    Why You&apos;ll Love This
                  </h4>
                  <ul className="space-y-1">
                    {[
                      'Ethically Sourced from Indian Farms',
                      'Lab Tested for Purity & Potency',
                      'No Additives or Preservatives',
                      'Premium Grade Quality',
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <CertificationsBanner variant="compact" />
                </div>

                <div className="mt-8">
                  {/* Frequently Bought Together Bundle */}
                  <FrequentlyBoughtTogether
                    mainProduct={product}
                    recommendations={getBundleSuggestions(product, allProducts)}
                    onAddBundle={(products) => {
                      products.forEach((p) => {
                        onAddToCart(p, p.variants[0], 1);
                      });
                      addToast(`Added ${products.length} items to cart!`, 'success');
                    }}
                  />
                </div>

                <div className="mt-6">
                  <TrustBadges
                    badges={[
                      { icon: '💳', text: 'Secure' },
                      { icon: '🛡️', text: 'Privacy' },
                      { icon: '↩️', text: 'Returns' },
                    ]}
                    variant="horizontal"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Share this product:</p>
                  <div className="flex justify-center items-center gap-4">
                    <a
                      href="#"
                      aria-label="Share on Facebook"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      href="#"
                      aria-label="Share on Twitter"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <TwitterIcon />
                    </a>
                    <a
                      href="#"
                      aria-label="Share on Pinterest"
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <PinterestIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Accordions (Visible on mobile only) */}
          <div className="md:hidden p-4 space-y-3">
            {/* Description Accordion */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === 'description' ? '' : 'description')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 font-bold text-gray-900"
              >
                <span>Description</span>
                <ChevronRightIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${activeTab === 'description' ? 'rotate-90' : ''}`}
                />
              </button>
              {activeTab === 'description' && (
                <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                  <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-brand-secondary text-brand-dark text-xs font-bold px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nutrition Accordion */}
            {product.nutrition && product.nutrition.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab(activeTab === 'nutrition' ? '' : 'nutrition')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 font-bold text-gray-900"
                >
                  <span>Nutrition Facts</span>
                  <ChevronRightIcon
                    className={`h-5 w-5 text-gray-500 transition-transform ${activeTab === 'nutrition' ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeTab === 'nutrition' && (
                  <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                    <div className="space-y-2">
                      {product.nutrition.map((n, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between border-b border-gray-100 last:border-0 py-2"
                        >
                          <span className="font-medium text-gray-700">{n.key}</span>
                          <span className="text-gray-600">{n.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Origin Accordion */}
            {product.origin && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab(activeTab === 'sourcing' ? '' : 'sourcing')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 font-bold text-gray-900"
                >
                  <span>Origin Story</span>
                  <ChevronRightIcon
                    className={`h-5 w-5 text-gray-500 transition-transform ${activeTab === 'sourcing' ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeTab === 'sourcing' && (
                  <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                    <div className="flex items-start gap-4 mb-4">
                      <GlobeIcon className="h-6 w-6 text-brand-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900">Sourced from</h4>
                        <p className="text-gray-600">{product.origin}</p>
                      </div>
                    </div>
                    {product.harvestDate && (
                      <div className="flex items-start gap-4">
                        <LeafIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900">Harvest Date</h4>
                          <p className="text-gray-600">{product.harvestDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Accordion */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? '' : 'reviews')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 font-bold text-gray-900"
              >
                <span>Reviews ({product.reviews.length})</span>
                <ChevronRightIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${activeTab === 'reviews' ? 'rotate-90' : ''}`}
                />
              </button>
              {activeTab === 'reviews' && (
                <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                  {product.reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">No reviews yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {product.reviews.slice(0, 3).map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 last:border-0 pb-2"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                              ))}
                            </div>
                            <span className="font-bold text-sm">{review.author}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                      {product.reviews.length > 3 && (
                        <button className="text-brand-primary text-sm font-bold w-full text-center pt-2">
                          View all {product.reviews.length} reviews
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Apps Tabs Section (Hidden on Mobile) */}
          <div className="hidden md:block p-6 border-t">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'description' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Description
                </button>
                {product.nutrition && product.nutrition.length > 0 && (
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'nutrition' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Nutrition Facts
                  </button>
                )}
                {product.origin && (
                  <button
                    onClick={() => setActiveTab('sourcing')}
                    className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'sourcing' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Origin Story
                  </button>
                )}
                {relatedRecipes.length > 0 && (
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'recipes' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Recipes ({relatedRecipes.length})
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'reviews' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Reviews ({product.reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('qna')}
                  className={`whitespace-nowrap pb-4 px-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'qna' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Q&A ({product.qna?.length || 0})
                </button>
              </nav>
            </div>

            <div className="animate-fade-in">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <div className="space-y-4 my-6">
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex items-start gap-3">
                        <TagIcon className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-600">Tags:</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-brand-secondary text-brand-dark text-xs font-bold px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {product.origin && (
                      <div className="flex items-center gap-3">
                        <GlobeIcon className="h-6 w-6 text-brand-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-600">Origin:</h4>
                          <p className="text-brand-dark">{product.origin}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compliance & Details Block */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-lg text-brand-dark mb-4">
                      Product Details & Compliance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      {product.fssaiLicense && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">FSSAI License</span>
                          <span className="font-medium">{product.fssaiLicense}</span>
                        </div>
                      )}
                      {product.batchNo && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Batch No.</span>
                          <span className="font-medium">{product.batchNo}</span>
                        </div>
                      )}
                      {product.mfgDate && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Mfg Date</span>
                          <span className="font-medium">
                            {new Date(product.mfgDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {product.bestBeforeMonths && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Shelf Life</span>
                          <span className="font-medium">{product.bestBeforeMonths} Months</span>
                        </div>
                      )}
                      {product.originRegion && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Region of Origin</span>
                          <span className="font-medium">{product.originRegion}</span>
                        </div>
                      )}
                      {product.processingMethod && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Processing</span>
                          <span className="font-medium">{product.processingMethod}</span>
                        </div>
                      )}
                    </div>

                    {product.ingredients && (
                      <div className="mt-4">
                        <span className="block text-gray-500 text-xs mb-1">Ingredients</span>
                        <p className="font-medium">{product.ingredients}</p>
                      </div>
                    )}

                    {product.allergens && (
                      <div className="mt-4 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                        <span className="block text-yellow-800 text-xs font-bold mb-1 uppercase">
                          Allergen Information
                        </span>
                        <p className="text-yellow-900 font-medium">{product.allergens}</p>
                      </div>
                    )}

                    {product.storageInstructions && (
                      <div className="mt-4">
                        <span className="block text-gray-500 text-xs mb-1">Storage</span>
                        <p className="font-medium text-gray-700">
                          <span className="inline-block mr-2">❄️</span>
                          {product.storageInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-black rounded-lg p-6">
                    <h3 className="text-2xl font-bold border-b-8 border-black pb-2 mb-4">
                      Nutrition Facts
                    </h3>
                    <div className="space-y-3">
                      {product.nutrition && product.nutrition.length > 0 ? (
                        <>
                          {product.nutrition.map((n, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-2 border-b border-gray-300"
                            >
                              <span className="font-semibold text-gray-800">{n.key}</span>
                              <span className="text-gray-600">{n.value}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <SparklesIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Nutrition information coming soon</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sourcing' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <GlobeIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold text-brand-dark mb-2">Origin</h3>
                          <p className="text-brand-dark text-lg font-semibold">
                            {product.origin || 'Sourced from premium locations'}
                          </p>
                        </div>
                      </div>
                      {product.harvestDate && (
                        <div className="flex items-start gap-4">
                          <LeafIcon className="h-8 w-8 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Harvest</h3>
                            <p className="text-brand-dark text-lg font-semibold">
                              {product.harvestDate}
                            </p>
                          </div>
                        </div>
                      )}
                      {product.grade && (
                        <div className="flex items-start gap-4">
                          <SparklesIcon className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Grade</h3>
                            <p className="text-brand-dark text-lg font-semibold">{product.grade}</p>
                          </div>
                        </div>
                      )}
                      {product.purityTest && (
                        <div className="flex items-start gap-4">
                          <ShieldCheckIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Purity</h3>
                            <p className="text-brand-dark text-lg font-semibold">
                              {product.purityTest}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                      <LeafIcon className="h-5 w-5 text-green-600" />
                      Our Sourcing Story
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      We partner directly with farmers and artisans who share our commitment to
                      quality and sustainability. Each {product.name.toLowerCase()} is carefully
                      selected and processed using traditional methods that preserve its natural
                      flavors and beneficial properties.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <ShieldCheckIcon className="h-8 w-8 text-green-600 mb-2" />
                        <h5 className="font-bold text-sm text-gray-800 mb-1">Quality Assured</h5>
                        <p className="text-xs text-gray-600">Rigorous testing & quality control</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
                        <h5 className="font-bold text-sm text-gray-800 mb-1">Fair Trade</h5>
                        <p className="text-xs text-gray-600">Supporting farming communities</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <LeafIcon className="h-8 w-8 text-green-600 mb-2" />
                        <h5 className="font-bold text-sm text-gray-800 mb-1">Sustainable</h5>
                        <p className="text-xs text-gray-600">Eco-friendly practices</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={imageErrorHandlers.recipe}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif font-bold text-lg text-brand-dark mb-2">
                          {recipe.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {recipe.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                          <span>{recipe.prepTime} Prep</span>
                          <span>{recipe.cookTime} Cook</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <ReviewSummary reviews={product.reviews} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-brand-dark mb-4">Leave a Review</h4>
                      <ReviewForm
                        onSubmit={(review) => onAddReview(product.id, review)}
                        addToast={addToast}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark mb-4">What others are saying</h4>
                      <div className="max-h-[600px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                        <ReviewList
                          reviews={product.reviews}
                          productId={product.id}
                          onDelete={onDeleteReview}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'qna' && (
                <QnA qna={product.qna || []} onAskQuestion={(q) => onAskQuestion(product.id, q)} />
              )}
            </div>
          </div>

          {/* Frequently Bought Together */}
          {frequentlyBoughtTogetherProducts.length > 0 && (
            <div className="p-6 border-t bg-brand-accent/50">
              <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">
                Frequently Bought Together
              </h3>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center flex-wrap gap-4">
                  <div className="text-center w-24">
                    <OptimizedImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      type="thumbnail"
                      priority="auto"
                      width={96}
                      height={96}
                      onError={handleThumbImageError}
                    />
                    <p className="text-xs mt-1 font-bold truncate">{product.name}</p>
                  </div>
                  {frequentlyBoughtTogetherProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className="text-2xl font-light text-gray-400">+</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`fbt-${p.id}`}
                          checked={fbtSelection.includes(p.id)}
                          onChange={() => handleToggleFbt(p.id)}
                          className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                        />
                        <label htmlFor={`fbt-${p.id}`} className="text-center w-24 cursor-pointer">
                          <OptimizedImage
                            src={p.images[0]}
                            alt={p.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                            type="thumbnail"
                            priority="auto"
                            width={96}
                            height={96}
                            onError={handleThumbImageError}
                          />
                          <p className="text-xs mt-1 font-bold truncate">{p.name}</p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-inner text-center">
                  <p className="text-gray-600">
                    Total Price:{' '}
                    <span className="font-bold text-xl text-brand-dark">
                      ₹{fbtSubtotal.toFixed(2)}
                    </span>
                  </p>
                  <button
                    onClick={handleAddFbtToCart}
                    className="mt-2 bg-brand-primary text-brand-dark font-bold py-2 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
                  >
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

          {/* Subscription Toggle */}
          <div className="mt-8 mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-brand-primary">↻</span> Subscribe & Save
            </h4>
            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${!isSubscription ? 'border-brand-primary bg-white ring-1 ring-brand-primary' : 'border-gray-200 hover:border-brand-primary/50'}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="subscription"
                    checked={!isSubscription}
                    onChange={() => setIsSubscription(false)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <p className="font-bold text-gray-900">One-time purchase</p>
                    <p className="text-sm text-gray-500">Standard price</p>
                  </div>
                </div>
                <span className="font-bold">
                  ₹{onSale ? selectedVariant.salePrice : selectedVariant.price}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${isSubscription ? 'border-brand-primary bg-white ring-1 ring-brand-primary' : 'border-gray-200 hover:border-brand-primary/50'}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="subscription"
                    checked={isSubscription}
                    onChange={() => setIsSubscription(true)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Subscribe & Save 10%</p>
                    <p className="text-sm text-gray-500">Deliver every 30 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-700">
                    ₹
                    {Math.floor(
                      (onSale ? selectedVariant.salePrice! : selectedVariant.price) * 0.9
                    )}
                  </span>
                  <p className="text-xs text-green-600 line-through">
                    ₹{onSale ? selectedVariant.salePrice : selectedVariant.price}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-full h-12 bg-gray-50 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 active:bg-gray-200 rounded-l-full"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-600 active:bg-gray-200 rounded-r-full"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, selectedVariant, quantity)}
              className="flex-1 bg-brand-primary text-brand-dark font-bold py-3 px-4 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Add to Cart</span>
              <span className="bg-brand-dark text-white text-xs px-2 py-0.5 rounded-full">
                ₹
                {((onSale ? selectedVariant.salePrice! : selectedVariant.price) * quantity).toFixed(
                  0
                )}
              </span>
            </button>
          </div>
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
    </div>
  );
};

export default ProductDetailModal;
