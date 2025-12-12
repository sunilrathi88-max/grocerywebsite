import React from 'react';

interface CategorySEOProps {
  category: string;
}

export const CategorySEO: React.FC<CategorySEOProps> = ({ category }) => {
  if (category === 'All' || category === 'Gift Boxes') return null;

  return (
    <article className="mt-16 pt-12 border-t border-neutral-100 prose prose-neutral max-w-4xl mx-auto text-neutral-600">
      {category === 'Spices' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Buy Premium Authentic Indian Spices Online
          </h2>
          <p className="mb-4">
            Elevate your culinary creations with Tattva Co.&apos;s exclusive collection of
            <strong>authentic Indian spices</strong>. Sourced directly from heritage farms in Kerala
            and Kashmir, our spices are hand-picked, sun-dried, and stone-ground to preserve their
            natural essential oils and potent aroma.
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Why Choose Single-Origin Spices?
          </h3>
          <p className="mb-4">
            Unlike commercial blends that use fillers, our single-origin spices like
            <a href="#product-1" className="text-brand-primary hover:underline mx-1">
              Kashmiri Saffron
            </a>
            and{' '}
            <a href="#product-2" className="text-brand-primary hover:underline mx-1">
              Malabar Black Pepper
            </a>
            offer unmatched purity. Each batch is lab-tested for pesticides and heavy metals,
            ensuring you get only the healthiest ingredients for your family.
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Essential Spices for Your Indian Kitchen
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Turmeric (Haldi):</strong> High curcumin content for immunity.
            </li>
            <li>
              <strong>Cardamom (Elaichi):</strong> Bold, fragrant pods for chai and desserts.
            </li>
            <li>
              <strong>Cinnamon (Dalchini):</strong> Sweet, woody notes from the inner bark.
            </li>
          </ul>
        </div>
      )}

      {category === 'Nuts' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Premium Dry Fruits & Nuts Online
          </h2>
          <p className="mb-4">
            Discover the crunch of health with our premium range of
            <strong>Kashmiri Mamra Almonds</strong>, <strong>Jumbo Cashews</strong>, and
            <strong>Afghan Apricots</strong>. Perfect for healthy snacking, festive gifting, or
            adding richness to your curries and kheer.
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Health Benefits of Daily Nut Consumption
          </h3>
          <p className="mb-4">
            Packed with healthy fats, protein, and antioxidants, our nuts are an essential
            superfood. Our{' '}
            <a href="#product-3" className="text-brand-primary hover:underline mx-1">
              Kashmiri Almonds
            </a>
            are rich in Vitamin E and Magnesium, supporting heart health and brain function.
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">Freshness Guaranteed</h3>
          <p>
            We adhere to strict quality controls, vacuum packing our dry fruits immediately after
            sorting to lock in freshness. Say goodbye to stale, soft nuts and enjoy the farm-fresh
            crunch with every bite.
          </p>
        </div>
      )}
    </article>
  );
};
