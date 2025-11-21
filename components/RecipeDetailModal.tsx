import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe, Product } from '../types';
import { XIcon } from './icons/XIcon';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';
import ProductCard from './ProductCard';
import OptimizedImage from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';

interface RecipeDetailModalProps {
  recipe: Recipe;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onNotifyMe: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onToggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  allProducts,
  onClose,
  onAddToCart,
  onSelectProduct,
  onNotifyMe,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
}) => {
  // Filter products that are related to this recipe
  const relatedProducts = allProducts.filter((product) =>
    recipe.relatedProductIds.includes(product.id)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Image */}
          <div className="relative h-64 sm:h-80 shrink-0">
            <OptimizedImage
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
              priority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-2">
                {recipe.name}
              </h2>
              <p className="text-gray-200 text-lg max-w-2xl line-clamp-2">
                {recipe.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 sm:p-8 space-y-8">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-brand-primary" />
                  <span className="font-medium">{recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-brand-primary" />
                  <span className="font-medium">{recipe.servings} Servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-primary rounded-full" />
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 mt-2 bg-brand-primary/40 rounded-full shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-primary rounded-full" />
                    Instructions
                  </h3>
                  <ol className="space-y-6">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-primary/10 text-brand-primary font-bold rounded-full text-sm">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Shop Ingredients */}
              {relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Shop the Ingredients
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={isWishlisted(product.id)}
                        onSelectProduct={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        onToggleCompare={onToggleCompare}
                        isCompared={isCompared(product.id)}
                        onNotifyMe={onNotifyMe}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeDetailModal;
