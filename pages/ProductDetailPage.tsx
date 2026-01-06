import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductTabs } from '../components/ProductTabs';
import { WeightSelector } from '../components/WeightSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { TrustBadges } from '../components/TrustBadges';
import { useCartStore } from '../store/cartStore';
import ReviewsList from '../components/ReviewsList';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addToCart = useCartStore((state) => state.addItem);

  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Hardcoded example data as per user request to demonstrate the layout.
  // In a real app, we would fetch this using id.
  const product = {
    id: id || '1',
    name: 'Garam Masala',
    price: 45,
    originalPrice: 60,
    image: '/images/garam-masala.jpg',
    rating: 4.8,
    reviewCount: 47,
    description: 'Premium cold-ground Garam Masala...',
    sizes: [
      { size: '50g', price: 45, discount: 0, badge: 'MOST POPULAR', stock: 100 },
      { size: '100g', price: 80, discount: 20, badge: '', stock: 50 },
      { size: '250g', price: 180, discount: 30, badge: 'BEST VALUE', stock: 20 },
      { size: '500g', price: 320, discount: 40, badge: '', stock: 0 },
    ],
  };

  const trustBadges = [
    { icon: '🧪', text: 'Lab-Tested Purity' },
    { icon: '❄️', text: 'Cold Ground' },
    { icon: '🚫', text: 'No Fillers/Additives' },
    { icon: '📦', text: 'Ships in 24 Hours' },
  ];

  const handleAddToCart = () => {
    const selectedSize = product.sizes[selectedWeight];
    addToCart({
      id: `${product.id}-${selectedSize.size}`, // Composite ID
      name: product.name,
      price: selectedSize.price,
      quantity,
      weight: selectedSize.size,
      image: product.image,
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
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <span className="text-2xl">⭐ {product.rating}</span>
              <span className="text-gray-600 ml-2">({product.reviewCount} reviews)</span>
            </div>

            {/* Name & Price */}
            <div>
              <h1 className="text-4xl font-bold text-[#5F5238] mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1F2121]">
                  ₹{product.sizes[selectedWeight].price}
                </span>
                <span className="line-through text-gray-500">₹{product.originalPrice}</span>
              </div>
            </div>

            {/* Weight Selector */}
            <WeightSelector
              options={product.sizes.map((s) => ({ ...s, badge: s.badge || undefined }))}
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
            <div className="pt-6 border-t">
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
                label: `Reviews (${product.reviewCount})`,
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

        {/* Sourcing Story Section */}
        <div className="bg-stone-100 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="inline-block bg-brand-primary/20 text-brand-dark px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                Farm to Fork
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">
                Sourced with Integrity from Idukki, Kerala
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                This {product.name} comes from the lush hills of Idukki, where our partner farmer,{' '}
                <strong>Mr. Thomas</strong>, practices traditional regenerative farming.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-xl">
                    🌱
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Sustainably Grown</h4>
                    <p className="text-sm text-gray-600">
                      Grown without synthetic pesticides, ensuring purity from soil to spoon.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-xl">
                    🤝
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Fair Trade</h4>
                    <p className="text-sm text-gray-600">
                      We pay our farmers 20% above market rates to support their livelihood.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-brand-dark rounded-xl transform rotate-3 opacity-10"></div>
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
                alt="Spice Farmer in Kerala"
                className="relative rounded-xl shadow-lg w-full object-cover aspect-[4/3] transform -rotate-2 hover:rotate-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
