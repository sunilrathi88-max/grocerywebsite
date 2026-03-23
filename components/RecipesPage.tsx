import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { Recipe } from '../types';
import { ArrowLeft } from 'lucide-react';

interface RecipesPageProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ recipes, onSelectRecipe }) => {
  return (
    <div className="bg-[#FAF6F2] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-[#B38B59]/10 border border-[#B38B59]/20 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest mb-6">
            Culinary Inspiration
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[#42210B] mb-6 leading-tight">
            Kitchen secrets from <span className="text-[#B38B59] italic">India's Heartland</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Elevate your daily cooking with authentic recipes designed for our premium cold-ground spices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-[2.5rem] overflow-hidden group border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={imageErrorHandlers.recipe}
                />
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#B38B59] shadow-sm transform group-hover:rotate-12 transition-transform">
                    <ChefHatIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="font-display text-2xl font-bold text-[#42210B] mb-4 group-hover:text-[#B38B59] transition-colors leading-tight">
                  {recipe.title}
                </h3>
                <p className="text-stone-500 text-sm mb-8 line-clamp-3 leading-relaxed font-normal">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between py-6 border-y border-stone-50 mb-8">
                  <div className="text-center">
                    <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Prep</div>
                    <div className="text-sm font-bold text-[#42210B]">{recipe.prepTime}</div>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div className="text-center">
                    <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Cook</div>
                    <div className="text-sm font-bold text-[#42210B]">{recipe.cookTime}</div>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div className="text-center">
                    <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Serves</div>
                    <div className="text-sm font-bold text-[#42210B]">{recipe.serves}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-[#42210B] uppercase tracking-widest group-hover:gap-5 transition-all">
                  View Full Recipe
                  <div className="w-8 h-8 rounded-full bg-[#FAF6F2] flex items-center justify-center group-hover:bg-[#42210B] group-hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
