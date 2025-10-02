import { useState } from 'react';
import { motion } from 'framer-motion';
import { Recipe, PantryItem } from '../types';
import { mockRecipes } from '../data/mockData';

interface RecipeToCartProps {
  onAddToCart: (productId: number, quantity: number) => void;
}

export function RecipeToCart({ onAddToCart }: RecipeToCartProps) {
  const [recipes] = useState<Recipe[]>(mockRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(4);
  const [pantryItems] = useState<PantryItem[]>([]);
  const [filterCuisine, setFilterCuisine] = useState<string>('all');
  const [filterDietary, setFilterDietary] = useState<string>('all');

  const cuisines = ['all', ...Array.from(new Set(recipes.map(r => r.cuisine)))];
  const dietaryOptions = ['all', 'vegetarian', 'vegan', 'high-protein'];

  const filteredRecipes = recipes.filter(recipe => {
    const cuisineMatch = filterCuisine === 'all' || recipe.cuisine === filterCuisine;
    const dietaryMatch = filterDietary === 'all' || recipe.dietaryTags.includes(filterDietary);
    return cuisineMatch && dietaryMatch;
  });

  const handleAddAllIngredients = (recipe: Recipe) => {
    const servingMultiplier = servings / recipe.servings;

    recipe.ingredients.forEach(ingredient => {
      const hasPantryItem = pantryItems.some(item => item.productId === ingredient.productId);

      if (!hasPantryItem) {
        const adjustedQuantity = Math.ceil(ingredient.quantity * servingMultiplier);
        onAddToCart(ingredient.productId, adjustedQuantity);
      }
    });

    alert(`Added all ingredients for ${recipe.name} to cart!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Recipe-to-Cart</h1>
      <p className="text-gray-600 mb-8">Browse recipes and add all ingredients to your cart with one click</p>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Cuisine</label>
          <select
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine === 'all' ? 'All Cuisines' : cuisine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Dietary Preference</label>
          <select
            value={filterDietary}
            onChange={(e) => setFilterDietary(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {dietaryOptions.map(option => (
              <option key={option} value={option}>
                {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <motion.div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{recipe.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                <span>👥 {recipe.servings} servings</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.dietaryTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddAllIngredients(recipe);
                }}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Add Ingredients to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <motion.div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedRecipe.name}</h2>
                  <p className="text-gray-600">{selectedRecipe.cuisine}</p>
                </div>
                <span className={`px-3 py-1 rounded ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {selectedRecipe.difficulty}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{selectedRecipe.description}</p>

              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <span>⏱ Prep: {selectedRecipe.prepTimeMinutes} min</span>
                <span>🍳 Cook: {selectedRecipe.cookTimeMinutes} min</span>
                <span>👥 {selectedRecipe.servings} servings</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRecipe.dietaryTags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold">Adjust Servings:</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-medium w-8 text-center">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map(ingredient => {
                    const hasPantryItem = pantryItems.some(item => item.productId === ingredient.productId);
                    const adjustedQuantity = (ingredient.quantity * servings / selectedRecipe.servings).toFixed(1);

                    return (
                      <div key={ingredient.id} className="flex justify-between items-center p-2 rounded bg-gray-50">
                        <div className="flex-1">
                          <span className={hasPantryItem ? 'line-through text-gray-400' : ''}>
                            Product #{ingredient.productId}
                          </span>
                          {ingredient.notes && (
                            <span className="text-sm text-gray-500"> ({ingredient.notes})</span>
                          )}
                          {ingredient.isOptional && (
                            <span className="ml-2 text-xs text-gray-500 italic">optional</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {adjustedQuantity} {ingredient.unit}
                          </span>
                          {hasPantryItem && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              In Pantry
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded">
                  {selectedRecipe.instructions}
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddAllIngredients(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
              >
                Add All Ingredients to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
