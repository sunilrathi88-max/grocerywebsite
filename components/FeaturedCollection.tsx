import React from 'react';
import { Product, Variant } from '../types';
import ProductSlider from './ProductSlider';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface FeaturedCollectionProps {
    title: string;
    products: Product[];
    onAddToCart: (product: Product, variant: Variant) => void;
    onToggleWishlist: (product: Product) => void;
    wishlistedIds: Set<number>;
    onSelectProduct: (product: Product) => void;
    onNotifyMe: (productName: string) => void;
    onViewAll?: () => void;
    bgClass?: string;
    loadingStrategy?: 'eager' | 'lazy';
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
    title,
    products,
    onViewAll,
    bgClass = "bg-white",
    ...sliderProps
}) => {
    return (
        <section className={`py-12 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900">
                        {title}
                    </h2>
                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors group"
                        >
                            View All
                            <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>

                <ProductSlider
                    title="" // Title handled by wrapper
                    products={products}
                    {...sliderProps}
                />
            </div>
        </section>
    );
};

export default FeaturedCollection;
