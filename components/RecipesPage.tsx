import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';

export interface Recipe {
    id: number;
    title: string;
    image: string;
    prepTime: string;
    cookTime: string;
    serves: number;
    description: string;
    ingredients: string[];
    instructions: string[];
}

const MOCK_RECIPES: Recipe[] = [
    { 
        id: 1, 
        title: 'Classic Chicken Biryani', 
        image: 'https://via.placeholder.com/600x400/F8E3D9/333333?text=Tattva+Co.', 
        prepTime: '20 mins', cookTime: '40 mins', serves: 4, 
        description: 'Aromatic and flavorful one-pot meal made with saffron-infused rice, tender chicken, and a blend of Tattva Co. spices.',
        ingredients: ['500g Chicken', '2 cups Basmati Rice', '1 pinch Tattva Co. Himalayan Saffron', '2 tbsp Tattva Co. Garam Masala', '1 cup Yogurt', '2 Onions, sliced', 'Ginger-garlic paste'],
        instructions: ['Marinate chicken with yogurt and spices.', 'Par-boil the rice with saffron.', 'Layer the chicken and rice in a heavy-bottomed pot.', 'Cook on low heat (dum) for 30-40 minutes.']
    },
    { 
        id: 2, 
        title: 'Spicy Malabar Pepper Prawns', 
        image: 'https://via.placeholder.com/600x400/F8E3D9/333333?text=Tattva+Co.', 
        prepTime: '15 mins', cookTime: '10 mins', serves: 2, 
        description: 'A quick and fiery appetizer featuring fresh prawns coated in freshly ground Malabar black pepper and other spices.',
        ingredients: ['250g Prawns, deveined', '2 tbsp Tattva Co. Malabar Black Pepper, coarsely ground', '1 tsp Tattva Co. Turmeric Powder', 'Curry leaves', 'Coconut oil'],
        instructions: ['Marinate prawns with turmeric and salt.', 'Heat coconut oil, add curry leaves and sauté.', 'Add prawns and cook until pink.', 'Sprinkle generously with black pepper and toss well.']
    },
    { 
        id: 3, 
        title: 'Creamy Turmeric Latte', 
        image: 'https://via.placeholder.com/600x400/F8E3D9/333333?text=Tattva+Co.', 
        prepTime: '5 mins', cookTime: '5 mins', serves: 1, 
        description: 'A comforting and healthy beverage made with our organic turmeric powder, milk, and a hint of sweetness.',
        ingredients: ['1 cup Milk (of choice)', '1 tsp Tattva Co. Organic Turmeric Powder', '1/4 tsp Cinnamon powder', 'Pinch of black pepper', '1 tsp Honey or Maple Syrup'],
        instructions: ['Gently heat the milk in a small saucepan.', 'Whisk in turmeric, cinnamon, and pepper.', 'Heat until warm but not boiling.', 'Remove from heat, stir in sweetener, and enjoy.']
    },
    { 
        id: 4, 
        title: 'Garam Masala Spiced Nuts', 
        image: 'https://via.placeholder.com/600x400/F8E3D9/333333?text=Tattva+Co.', 
        prepTime: '5 mins', cookTime: '15 mins', serves: 6, 
        description: 'An addictive snack of mixed nuts roasted with Tattva Co. Garam Masala, a little salt, and a touch of maple syrup.',
        ingredients: ['2 cups Mixed Nuts (Tattva Co. Almonds, Cashews)', '1 tbsp Coconut oil, melted', '1.5 tsp Tattva Co. Garam Masala', '1/2 tsp Salt', '1 tbsp Maple syrup'],
        instructions: ['Preheat oven to 350°F (175°C).', 'Toss nuts with all other ingredients until well-coated.', 'Spread on a baking sheet in a single layer.', 'Roast for 10-15 minutes, stirring halfway, until fragrant.']
    },
];

interface RecipesPageProps {
    onSelectRecipe: (recipe: Recipe) => void;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ onSelectRecipe }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Tattva Co. Recipes</h2>
                <p className="mt-4 text-lg text-gray-600">Inspiration for your next culinary adventure using our finest ingredients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_RECIPES.map(recipe => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300">
                        <div className="relative h-56">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = 'https://via.placeholder.com/600x224/F8E3D9/333333?text=Tattva+Co.'; }} />
                        </div>
                        <div className="p-6 flex flex-col">
                            <h3 className="text-xl font-serif font-bold text-brand-dark">{recipe.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm flex-grow h-20 overflow-hidden">{recipe.description}</p>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                                <span className="font-bold">Prep: {recipe.prepTime}</span>
                                <span className="font-bold">Cook: {recipe.cookTime}</span>
                                <span className="font-bold">Serves: {recipe.serves}</span>
                            </div>
                             <button 
                                onClick={() => onSelectRecipe(recipe)}
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
