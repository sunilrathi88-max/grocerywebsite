import React from 'react';
import { Product, Review } from '../types';
import { XIcon } from './icons/XIcon';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: number, review: Omit<Review, 'id'>) => void;
  onDeleteReview: (productId: number, reviewId: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onAddReview, onDeleteReview }) => {
  const isOutOfStock = product.stock === 0;
  const onSale = product.salePrice && product.salePrice < product.price;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column: Image */}
            <div className="relative">
              <img src={product.imageUrl.replace('/400/400', '/800/800')} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <span className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full text-lg">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col">
              <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
              <div className="mb-6">
                {onSale ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-red-500 font-sans">${product.salePrice!.toFixed(2)}</span>
                    <span className="text-2xl font-sans text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-brand-dark font-sans">${product.price.toFixed(2)}</span>
                )}
              </div>
              <button 
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                Add to Cart
              </button>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="p-6 border-t bg-brand-accent/50">
            <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-brand-dark mb-4">Leave a Review</h4>
                <ReviewForm onSubmit={(review) => onAddReview(product.id, review)} />
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