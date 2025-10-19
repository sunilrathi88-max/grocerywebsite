import React from 'react';
import { Recipe } from './RecipesPage';
import { XIcon } from './icons/XIcon';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-serif font-bold text-brand-dark truncate">{recipe.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300/f0f0f0/666?text=Recipe+Image';
            }}
          />
          <div className="p-6">
            <div className="flex items-center justify-around text-center border-b pb-4 mb-6 text-sm text-gray-600">
                <div className="flex flex-col items-center gap-1">
                    <ClockIcon className="h-6 w-6 text-brand-primary" />
                    <strong>Prep Time</strong>
                    <span>{recipe.prepTime}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <ClockIcon className="h-6 w-6 text-brand-primary" />
                    <strong>Cook Time</strong>
                    <span>{recipe.cookTime}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <UsersIcon className="h-6 w-6 text-brand-primary" />
                    <strong>Serves</strong>
                    <span>{recipe.serves}</span>
                </div>
            </div>
            
            <p className="text-gray-700 italic mb-6">{recipe.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-serif font-bold mb-3">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-800">
                        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-serif font-bold mb-3">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-800">
                        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
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
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RecipeDetailModal;
