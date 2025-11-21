import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { Recipe } from '../types';

interface RecipesPageProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ recipes, onSelectRecipe }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">
          Tattva Co. Recipes
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Inspiration for your next culinary adventure using our finest ingredients.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRecipe(recipe)}
          >
            <div className="relative h-56">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={imageErrorHandlers.recipe}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>
            <div className="p-6 flex flex-col">
              <h3 className="text-xl font-serif font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                {recipe.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm flex-grow h-20 overflow-hidden line-clamp-3">
                {recipe.description}
              </p>
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                <span className="font-bold">Prep: {recipe.prepTime}</span>
                <span className="font-bold">Cook: {recipe.cookTime}</span>
                <span className="font-bold">Serves: {recipe.serves}</span>
              </div>
              <button
                className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition-colors"
              >
                <ChefHatIcon className="h-5 w-5" /> View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
