import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { OptimizedImage } from '../components/OptimizedImage';
import { ProductTabs } from '../components/ProductTabs';
import { WeightSelector } from '../components/WeightSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { TrustBadges } from '../components/TrustBadges';
import CertificationsBanner from '../components/CertificationsBanner';
import { useCartStore } from '../store/cartStore';
import ReviewsList from '../components/ReviewsList';
import { GlobeIcon } from '../components/icons/GlobeIcon';

import { MOCK_PRODUCTS } from '../data';
import { getSimilarProducts } from '../utils/recommendations'; // Import recommendation logic
import ProductSlider from '../components/ProductSlider'; // Import ProductSlider comp
import { useWishlist } from '../hooks/useWishlist';

// Note: If useWishlist is not available in context, check other files.
// Based on previous files, onToggleWishlist might need a dummy if not implemented contextually.
// Actually, let's check imports in RecommendedProducts.tsx to be consistent.
// It uses onToggleWishlist={() => {}} // Optional here.
// But ProductDetailPage acts as a page, it should probably wire it up if possible.
// For now, let's stick to the props expected by ProductSlider.

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, wishlistItems } = useWishlist();
  const wishlistedIds = new Set(wishlistItems.map((p) => p.id));

  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product from mock data
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id)) || MOCK_PRODUCTS[0];

  // Map variants to old 'sizes' structure for compatibility with existing UI components
  // In a real app, we'd update the components to use 'Variant' type directly.
  const productSizes = product.variants.map((v) => ({
    size: v.name,
    price: v.price,
    // Calculate discount if salePrice exists, else mock based on logic or leave 0
    discount: v.salePrice ? Math.round(((v.price - v.salePrice) / v.price) * 100) : 0,
    badge: v.stock < 10 ? 'LOW STOCK' : '',
    stock: v.stock,
  }));

  // Fallback if no variants (shouldn't happen with our data)
  const displaySizes =
    productSizes.length > 0
      ? productSizes
      : [{ size: 'Standard', price: 0, discount: 0, badge: 'OUT OF STOCK', stock: 0 }];

  const trustBadges = [
    { icon: '🧪', text: 'Lab-Tested Purity' },
    { icon: '❄️', text: 'Cold Ground' },
    { icon: '🚫', text: 'No Fillers/Additives' },
    { icon: '📦', text: 'Ships in 24 Hours' },
  ];

  const handleAddToCart = () => {
    const selectedSize = displaySizes[selectedWeight];
    addToCart({
      id: `${product.id}-${selectedSize.size}`, // Composite ID
      name: product.name,
      price: selectedSize.price,
      quantity,
      weight: selectedSize.size,
      image: product.images[0],
      stock: selectedSize.stock || 50, // Fallback if no stock data
    });
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <div className="bg-white rounded-lg p-4">
            <OptimizedImage
              src={product.images[0]}
              alt={product.name}
              type="detail"
              className="w-full aspect-square object-cover rounded-lg"
              width={600}
              height={600}
              priority="high"
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

            {/* Weight Selector */}
            <WeightSelector
              options={displaySizes.map((s) => ({ ...s, badge: s.badge || undefined }))}
              onSelect={(index) => setSelectedWeight(index)}
              defaultSelectedIndex={0}
            />

            {/* Quantity */}
            <QuantitySelector value={quantity} onChange={setQuantity} />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" fullWidth>
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t space-y-4">
              <CertificationsBanner variant="compact" />
              <TrustBadges badges={trustBadges} variant="vertical" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg p-8 mb-12" id="reviews-section">
          <ProductTabs
            tabs={[
              {
                id: 'description',
                label: 'Description',
                content: (
                  <div className="prose prose-stone max-w-none">
                    <p className="text-lg leading-relaxed">{product.description}</p>
                    <h3 className="font-serif font-bold text-xl mt-6 mb-4">
                      Why our {product.name} is different
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Cold Ground:</strong> Ground at low temperatures to preserve
                        volatile oils and aroma.
                      </li>
                      <li>
                        <strong>Single Origin:</strong> Sourced directly from partner farms in
                        Kerala.
                      </li>
                      <li>
                        <strong>Lab Tested:</strong> Each batch is tested for purity, pesticides,
                        and heavy metals.
                      </li>
                    </ul>
                  </div>
                ),
              },
              {
                id: 'reviews',
                label: `Reviews (${product.reviews?.length || 0})`,
                content: (
                  <ReviewsList
                    reviews={[
                      {
                        id: 1,
                        author: 'Priya M.',
                        rating: 5,
                        comment:
                          "Absolutely authentic flavor! Reminds me of my grandmother's cooking. The aroma is distinctively better than store-bought brands.",
                        date: '2023-10-15',
                        verifiedPurchase: true,
                        helpful: 12,
                      },
                      {
                        id: 2,
                        author: 'Rahul S.',
                        rating: 5,
                        comment:
                          "Love the packaging and the freshness. You can tell it's cold ground. Will order again.",
                        date: '2023-11-02',
                        verifiedPurchase: true,
                        helpful: 8,
                      },
                      {
                        id: 3,
                        author: 'Anita D.',
                        rating: 4,
                        comment:
                          'Great spice, but shipping took a day longer than expected. Product quality is top notch though.',
                        date: '2023-09-28',
                        verifiedPurchase: true,
                        helpful: 3,
                      },
                    ]}
                    overallRating={product.rating}
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Sourcing & Transparency Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Transparency Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-primary/10 p-2 rounded-lg">
                <GlobeIcon className="w-6 h-6 text-brand-dark" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Traceability & Sourcing
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Origin
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📍</span> {product.origin || 'Kerala, India'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Harvest
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📅</span> {product.harvestDate || 'Fresh Harvest'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Process
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xl">👐</span> {product.processingMethod || 'Hand-processed'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Purity
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xl">🧪</span> {product.purityTest || 'Lab Tested'}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <p className="text-sm text-gray-600 italic">
                &quot;Our unique {product.processingMethod} technique ensures that the natural oils
                and aroma are locked in until you open the pack.&quot;
              </p>
            </div>
          </div>

          {/* Farmer Highlight (Mock usage for now, linking to farmers page) */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595245842188-4235b2e6669f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <div className="relative z-10 h-full flex flex-col justify-end">
              <span className="bg-brand-primary text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                Direct Trade
              </span>
              <h3 className="text-3xl font-serif font-bold mb-2">Grower Spotlight</h3>
              <p className="text-brand-light mb-6 opacity-90">
                Sourced directly from farmers like Rajesh in Wayanad, ensuring fair pay and
                sustainable practices.
              </p>
              <div className="flex items-center gap-2 font-bold text-brand-primary group-hover:translate-x-2 transition-transform">
                Meet Our Farmers <span>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="mb-12">
          <ProductSlider
            title="You Might Also Like"
            products={getSimilarProducts(product, MOCK_PRODUCTS)}
            onAddToCart={(p, v) =>
              addToCart({
                id: `${p.id}-${v.name}`,
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
            onSelectProduct={(p) => (window.location.href = `/product/${p.id}`)} // Simple navigation
            onNotifyMe={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
