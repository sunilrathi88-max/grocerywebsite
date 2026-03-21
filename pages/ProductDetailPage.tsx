import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import ImageGallery from '../components/ImageGallery';
import { ProductTabs } from '../components/ProductTabs';
import { WeightSelector } from '../components/WeightSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { TrustBadges } from '../components/TrustBadges';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

import { useCartStore } from '../store/cartStore';
import { ReviewWidget } from '../components/Reviews/ReviewWidget';
import { GlobeIcon } from '../components/icons/GlobeIcon';
import { StickyMobileCart } from '../components/StickyMobileCart';
import { useRef, useEffect } from 'react';

import { useProducts } from '../hooks/useProducts'; // Import hook
import { getSimilarProducts } from '../utils/recommendations'; // Import recommendation logic
import ProductSlider from '../components/ProductSlider'; // Import ProductSlider comp
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether'; // Import Bundle comp
import { useWishlist } from '../hooks/useWishlist';
import { useABTest } from '../src/context/ABTestContext';
import SEO from '../components/SEO';
import { pageSEO, generateProductSchema, generateBreadcrumbSchema } from '../utils/seo';
import { MOCK_RECIPES } from '../data/recipes';

import ProductOverviewTab from '../components/product/ProductOverviewTab';
import ProductSourcingTab from '../components/product/ProductSourcingTab';
import ProductCertificationTab from '../components/product/ProductCertificationTab';

// ...

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, wishlistItems } = useWishlist();
  const wishlistedIds = new Set(wishlistItems.map((p) => p.id));
  const { products } = useProducts({ useMockData: true }); // Get products from hook
  const { variant } = useABTest();

  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [showStickyCart, setShowStickyCart] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    // Only observe if we have a product and ref
    if (!product || !mainCtaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Debounce or check safely?
        setShowStickyCart(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(mainCtaRef.current);
    return () => observer.disconnect();
  }, [product]); // Add product dependency so it re-attaches if ref changes/mounts

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // Map variants
  const productSizes = (product.variants || []).map((v) => ({
    id: v.id,
    size: v.name,
    price: v.price,
    discount: v.salePrice ? Math.round(((v.price - v.salePrice) / v.price) * 100) : 0,
    badge: v.stock === 0 ? 'OUT OF STOCK' : v.stock < 10 ? 'LOW STOCK' : '',
    stock: v.stock,
  }));

  const displaySizes =
    productSizes.length > 0
      ? productSizes
      : [{ id: 0, size: 'Standard', price: 0, discount: 0, badge: 'OUT OF STOCK', stock: 0 }];

  const trustBadges = [
    { icon: '🧪', text: 'Lab-Tested Purity' },
    { icon: '❄️', text: 'Cold Ground' },
    { icon: '🚫', text: 'No Fillers/Additives' },
    { icon: '📦', text: 'Ships in 24 Hours' },
  ];

  const handleAddToCart = () => {
    const selectedSize = displaySizes[selectedWeight];
    const isSub = purchaseType === 'subscription';
    const finalPrice = isSub ? Math.round(selectedSize.price * 0.9) : selectedSize.price;

    addToCart({
      id: `${product.id}-${selectedSize.size}${isSub ? '-sub' : ''}`,
      productId: product.id,
      variantId: selectedSize.id || 0,
      name: isSub ? `${product.name} (Sub)` : product.name,
      price: finalPrice,
      quantity,
      weight: selectedSize.size,
      image: product.images[0],
      stock: selectedSize.stock || 50,
      isSubscription: isSub,
      subscriptionInterval: isSub ? 'monthly' : undefined,
    });
    alert(`Added ${isSub ? 'subscription' : 'product'} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleAddBundle = (bundleProducts: any[]) => {
    bundleProducts.forEach((p) => {
      const variant = p.variants[0];
      const discountedPrice = Math.round(variant.price * 0.85); // 15% off
      addToCart({
        id: `${p.id}-${variant.name}-bundle`,
        productId: p.id,
        variantId: variant.id,
        name: `${p.name} (Bundle Deal)`,
        price: discountedPrice,
        quantity: 1,
        weight: variant.name,
        image: p.images[0],
        stock: variant.stock,
      });
    });
    alert('Bundle added to cart with 15% discount!');
  };

  // SEO & Schema Markup
  const productSchema = product ? generateProductSchema(product) : undefined;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.rathinaturals.com/' },
    {
      name: product?.category || 'Shop',
      url: `https://www.rathinaturals.com/category/${product?.category || 'all'}`,
    },
    {
      name: product?.name || 'Product',
      url: `https://www.rathinaturals.com/product/${product?.id}`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {product && (
        <SEO
          {...pageSEO.product(product.name, product.description)}
          ogImage={product.images?.[0]}
          structuredData={[productSchema!, breadcrumbSchema]}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: () => navigate('/') },
              { label: product.category || 'Products', onClick: () => navigate('/shop') },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <ImageGallery
              media={product.images.map((img) => ({
                type: 'image' as const,
                url: img,
                thumb: img,
              }))}
              productName={product.name}
              isOutOfStock={displaySizes[selectedWeight]?.stock === 0}
            />
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <span className="text-2xl">⭐ {product.rating || 5.0}</span>
              <span className="text-gray-600 ml-2">({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Name & Price */}
            <div>
              <h1 className="text-4xl font-bold text-[#5F5238] mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1F2121]">
                  ₹{displaySizes[selectedWeight]?.price || 'N/A'}
                </span>
                {displaySizes[selectedWeight]?.discount > 0 && (
                  <span className="line-through text-gray-500">
                    ₹
                    {Math.round(
                      displaySizes[selectedWeight].price /
                        (1 - displaySizes[selectedWeight].discount / 100)
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Low Stock Warning */}
            {/* Low Stock Warning */}
            {displaySizes[selectedWeight]?.stock === 0 ? (
              <p className="text-red-600 font-bold text-sm mb-4">❌ Out of Stock</p>
            ) : displaySizes[selectedWeight]?.stock < 10 ? (
              <p className="text-orange-600 font-bold text-sm mb-4 animate-pulse flex items-center gap-2">
                <span>🔥</span> Only {displaySizes[selectedWeight].stock} left in stock - Order
                soon!
              </p>
            ) : null}

            {/* Weight Selector */}
            <WeightSelector
              options={displaySizes.map((s) => ({ ...s, badge: s.badge || undefined }))}
              onSelect={(index) => setSelectedWeight(index)}
              defaultSelectedIndex={0}
            />

            {/* Quantity */}
            <QuantitySelector value={quantity} onChange={setQuantity} />

            {/* Subscription Toggle - Enhanced */}
            <div className="p-5 bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 rounded-2xl border border-brand-primary/20 shadow-sm">
              <div className="flex gap-4">
                <label
                  className={`flex items-start gap-3 cursor-pointer flex-1 p-3 rounded-xl transition-all duration-200 ${
                    purchaseType === 'one-time'
                      ? 'bg-white shadow-md border-2 border-brand-primary'
                      : 'bg-transparent border-2 border-transparent hover:bg-white/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="purchaseType"
                    checked={purchaseType === 'one-time'}
                    onChange={() => setPurchaseType('one-time')}
                    className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary accent-brand-primary"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block text-base">
                      One-time purchase
                    </span>
                    <span className="text-gray-600 text-sm font-medium">
                      ₹{displaySizes[selectedWeight]?.price}
                    </span>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 cursor-pointer flex-1 p-3 rounded-xl transition-all duration-200 relative ${
                    purchaseType === 'subscription'
                      ? 'bg-white shadow-md border-2 border-brand-primary'
                      : 'bg-transparent border-2 border-transparent hover:bg-white/50'
                  }`}
                >
                  {/* Best Value Badge */}
                  <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    BEST VALUE
                  </span>
                  <input
                    type="radio"
                    name="purchaseType"
                    checked={purchaseType === 'subscription'}
                    onChange={() => setPurchaseType('subscription')}
                    className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary accent-brand-primary"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block text-base">
                      Subscribe & Save
                    </span>
                    <span className="text-brand-primary font-bold text-sm">
                      ₹{Math.round(displaySizes[selectedWeight]?.price * 0.9)}
                      <span className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                        Save 10%
                      </span>
                    </span>
                    <span className="text-xs text-gray-500 block mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Delivered monthly • Cancel anytime
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3" ref={mainCtaRef}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                className={variant === 'B' ? '!bg-green-600 hover:!bg-green-700' : ''} // A/B Test Variant
              >
                {variant === 'B' ? 'Add to Cart (Save 10%)' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t space-y-4">
              {/* CertificationsBanner Removed */}
              <TrustBadges badges={trustBadges} variant="vertical" />
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        <FrequentlyBoughtTogether
          currentProduct={product}
          allProducts={products}
          onAddBundleToCart={handleAddBundle}
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg p-8 mb-12" id="reviews-section">
          <ProductTabs
            tabs={[
              {
                id: 'description',
                label: 'Overview',
                content: <ProductOverviewTab product={product} />,
              },
              {
                id: 'sourcing',
                label: 'Sourcing & Farmer',
                content: <ProductSourcingTab product={product} />,
              },
              {
                id: 'certification',
                label: 'Certifications',
                content: <ProductCertificationTab product={product} />,
              },
              {
                id: 'reviews',
                label: `Reviews (${product.reviews?.length || 0})`,
                content: (
                  <ReviewWidget reviews={product.reviews || []} overallRating={product.rating} />
                ),
              },
            ]}
          />
        </div>

        {/* Sourcing Section Removed - Moved to Tabs */}

        {/* Related Recipes Section */}
        {(MOCK_RECIPES || []).some((recipe) => recipe.relatedProductIds?.includes(product.id)) && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-secondary/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-brand-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Cook with {product.name}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(MOCK_RECIPES || [])
                .filter((recipe) => recipe.relatedProductIds?.includes(product.id))
                .slice(0, 3)
                .map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipe/${recipe.id}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <span className="text-white text-xs font-bold bg-brand-primary/90 px-2 py-1 rounded">
                          {recipe.prepTime}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-brand-primary transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* You Might Also Like Section */}
        <div className="mb-12">
          <ProductSlider
            title="You Might Also Like"
            products={getSimilarProducts(product, products)}
            onAddToCart={(p, v) =>
              addToCart({
                id: `${p.id}-${v.name}`,
                productId: p.id,
                variantId: v.id,
                name: p.name,
                price: v.price,
                quantity: 1,
                weight: v.name,
                image: p.images[0],
                stock: v.stock,
              })
            }
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
            onSelectProduct={(p) => navigate(`/product/${p.id}`)}
            onNotifyMe={() => {}}
          />
        </div>
      </div>
      <StickyMobileCart
        product={product}
        price={displaySizes[selectedWeight]?.price || 0}
        onAddToCart={handleAddToCart}
        isVisible={showStickyCart}
        image={product.images?.[0]}
      />
    </div>
  );
}
