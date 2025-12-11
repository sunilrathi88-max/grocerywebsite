import React, { useMemo } from 'react';
import { Product, Variant } from '../types';
import ProductSlider from './ProductSlider';
import { useViewingHistory } from '../hooks/useViewingHistory';

interface RecommendedProductsProps {
    allProducts: Product[];
    onAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
    onSelectProduct: (product: Product) => void;
    onNotifyMe: (productName: string) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
    allProducts,
    onAddToCart,
    onSelectProduct,
    onNotifyMe,
}) => {
    const { viewedProducts } = useViewingHistory();

    const recommendations = useMemo(() => {
        if (viewedProducts.length === 0) return [];

        // 1. Get categories of viewed products
        const viewedCategories = new Set(viewedProducts.map((p) => p.category));

        // 2. Find products in those categories, excluding already viewed ones
        const viewedIds = new Set(viewedProducts.map((p) => p.id));

        // 3. Simple scoring: Same category = +1 point
        const candidates = allProducts.filter((p) => !viewedIds.has(p.id));

        const scoredCandidates = candidates.map((p) => {
            let score = 0;
            if (viewedCategories.has(p.category)) score += 2;
            // Boost highly rated products
            const avgRating = p.reviews.reduce((acc, r) => acc + r.rating, 0) / (p.reviews.length || 1);
            if (avgRating >= 4.5) score += 1;

            return { product: p, score };
        });

        // 4. Sort by score and take top 8
        return scoredCandidates
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(item => item.product);

    }, [viewedProducts, allProducts]);

    if (recommendations.length === 0 && viewedProducts.length === 0) return null;

    // Fallback: If we have history but no specific recommendations (rare), show history? 
    // Or just show nothing. For now, let's show "Recently Viewed" if we can't find similar.
    // Actually usually we want recommendations.

    const displayProducts = recommendations.length > 0 ? recommendations : viewedProducts;
    const title = recommendations.length > 0 ? "Recommended for You" : "Recently Viewed";

    return (
        <section className="py-16 bg-gradient-to-b from-white to-brand-accent/20">
            <div className="container mx-auto px-4">
                <ProductSlider
                    title={title}
                    products={displayProducts}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={() => { }} // Optional here
                    wishlistedIds={new Set()}
                    onSelectProduct={onSelectProduct}
                    onNotifyMe={onNotifyMe}
                />
            </div>
        </section>
    );
};

export default RecommendedProducts;
