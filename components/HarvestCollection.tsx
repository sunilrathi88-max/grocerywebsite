import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface HarvestCollectionProps {
    products: Product[];
}

const HarvestCollection: React.FC<HarvestCollectionProps> = ({ products }) => {
    const navigate = useNavigate();

    // Curated product IDs: Saffron (1), Black Pepper (2), Garam Masala (28), Turmeric (4)
    const curatedIds = [1, 2, 28, 4];
    const displayProducts = curatedIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    const getProductPrice = (product: Product): number => {
        return product.variants[0]?.price || 0;
    };

    const getProductImage = (product: Product): string => {
        return product.images[0] || '/images/placeholder.jpg';
    };

    const getProductTag = (product: Product): string | null => {
        if (product.tags?.includes('Premium')) return 'Premium';
        if (product.tags?.includes('Organic')) return 'Organic';
        if (product.tags?.includes('Single-Origin')) return 'Single Origin';
        return null;
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-row justify-between items-end mb-12">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-serif text-accent-charcoal mb-2">
                            Our Harvest
                        </h3>
                        <p className="text-accent-charcoal/60 font-light text-sm">
                            Seasonally curated. Limited batches.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                    >
                        View All{' '}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {displayProducts.map((product) => {
                        const tag = getProductTag(product);
                        return (
                            <div
                                key={product.id}
                                className="group cursor-pointer"
                                onClick={() => handleProductClick(product.id)}
                            >
                                <div className="relative overflow-hidden mb-6 bg-[#F5F5F5] aspect-[4/5]">
                                    <img
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[0.85] contrast-[1.1] group-hover:saturate-100"
                                        src={getProductImage(product)}
                                        loading="lazy"
                                    />
                                    {tag && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-accent-charcoal text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                                                {tag}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-serif text-xl text-accent-charcoal group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h4>
                                    {product.origin && (
                                        <p className="text-xs text-accent-charcoal/50 uppercase tracking-widest mb-2">
                                            Origin: {product.origin}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2 border-t border-gray-100 pt-3">
                                        <span className="font-medium text-accent-charcoal">
                                            ₹{getProductPrice(product)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product/${product.id}`);
                                            }}
                                            className="text-primary uppercase text-xs font-bold tracking-widest hover:text-primary-dark"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 md:hidden text-center">
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-block border border-primary text-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                    >
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HarvestCollection;
