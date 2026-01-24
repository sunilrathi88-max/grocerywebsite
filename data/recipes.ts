import { Recipe } from '../types';

export const MOCK_RECIPES: Recipe[] = [
    {
        id: 1,
        title: 'Classic Chicken Biryani',
        image:
            'https://images.unsplash.com/photo-1631515243349-e0cb75fb8da7?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '20 mins',
        cookTime: '40 mins',
        serves: 4,
        description:
            'Aromatic and flavorful one-pot meal made with saffron-infused rice, tender chicken, and a blend of Tattva Co. spices.',
        ingredients: [
            '500g Chicken',
            '2 cups Basmati Rice',
            '1 pinch Tattva Co. Himalayan Saffron',
            '2 tbsp Tattva Co. Garam Masala',
            '1 cup Yogurt',
            '2 Onions, sliced',
            'Ginger-garlic paste',
        ],
        instructions: [
            'Marinate chicken with yogurt and spices.',
            'Par-boil the rice with saffron.',
            'Layer the chicken and rice in a heavy-bottomed pot.',
            'Cook on low heat (dum) for 30-40 minutes.',
        ],
        relatedProductIds: [1], // Saffron
    },
    {
        id: 2,
        title: 'Spicy Malabar Pepper Prawns',
        image:
            'https://images.unsplash.com/photo-1598494822832-7cb319d9b8e2?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '15 mins',
        cookTime: '10 mins',
        serves: 2,
        description:
            'A quick and fiery appetizer featuring fresh prawns coated in freshly ground Malabar black pepper and other spices.',
        ingredients: [
            '250g Prawns, deveined',
            '2 tbsp Tattva Co. Malabar Black Pepper, coarsely ground',
            '1 tsp Tattva Co. Turmeric Powder',
            'Curry leaves',
            'Coconut oil',
        ],
        instructions: [
            'Marinate prawns with turmeric and salt.',
            'Heat coconut oil, add curry leaves and sauté.',
            'Add prawns and cook until pink.',
            'Sprinkle generously with black pepper and toss well.',
        ],
        relatedProductIds: [2], // Pepper
    },
    {
        id: 3,
        title: 'Creamy Turmeric Latte',
        image:
            'https://images.unsplash.com/photo-1566435942040-566b613e1a67?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '5 mins',
        cookTime: '5 mins',
        serves: 1,
        description:
            'A comforting and healthy beverage made with our organic turmeric powder, milk, and a hint of sweetness.',
        ingredients: [
            '1 cup Milk (of choice)',
            '1 tsp Tattva Co. Organic Turmeric Powder',
            '1/4 tsp Cinnamon powder',
            'Pinch of black pepper',
            '1 tsp Honey or Maple Syrup',
        ],
        instructions: [
            'Gently heat the milk in a small saucepan.',
            'Whisk in turmeric, cinnamon, and pepper.',
            'Heat until warm but not boiling.',
            'Remove from heat, stir in sweetener, and enjoy.',
        ],
        relatedProductIds: [], // Turmeric not in mock products yet
    },
    {
        id: 4,
        title: 'Garam Masala Spiced Nuts',
        image:
            'https://images.unsplash.com/photo-1583624320433-40e9d6519548?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '5 mins',
        cookTime: '15 mins',
        serves: 6,
        description:
            'An addictive snack of mixed nuts roasted with Tattva Co. Garam Masala, a little salt, and a touch of maple syrup.',
        ingredients: [
            '2 cups Mixed Nuts (Tattva Co. Almonds, Cashews)',
            '1 tbsp Coconut oil, melted',
            '1.5 tsp Tattva Co. Garam Masala',
            '1/2 tsp Salt',
            '1 tbsp Maple syrup',
        ],
        instructions: [
            'Preheat oven to 350°F (175°C).',
            'Toss nuts with all other ingredients until well-coated.',
            'Spread on a baking sheet in a single layer.',
            'Roast for 10-15 minutes, stirring halfway, until fragrant.',
        ],
        relatedProductIds: [3], // Almonds
    },
    {
        id: 5,
        title: 'Kerala-Style Fish Curry',
        image:
            'https://images.unsplash.com/photo-1626200419199-391ae4be7f29?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '15 mins',
        cookTime: '25 mins',
        serves: 4,
        description:
            'Authentic Malabar fish curry with coconut milk, tamarind, and our signature black pepper blend. Restaurant-quality in your home kitchen.',
        ingredients: [
            '500g Fish (pomfret or kingfish), cut into steaks',
            '1 cup Coconut milk',
            '1 tsp Tattva Co. Malabar Black Pepper',
            '1 tsp Tattva Co. Turmeric Powder',
            '2 tbsp Coconut oil',
            '2 tbsp Tamarind paste',
            'Curry leaves, green chillies',
            '1 Onion, sliced thin',
        ],
        instructions: [
            'Marinate fish with turmeric and salt for 15 minutes.',
            'Sauté onions in coconut oil until golden, add curry leaves and green chillies.',
            'Add tamarind paste and coconut milk, bring to a simmer.',
            'Add fish and cook gently for 10 minutes until done.',
            'Finish with freshly cracked black pepper.',
        ],
        relatedProductIds: [2, 4], // Pepper, Turmeric
    },
    {
        id: 6,
        title: 'Authentic Masala Chai',
        image:
            'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600&h=400&auto=format&fit=crop',
        prepTime: '5 mins',
        cookTime: '10 mins',
        serves: 2,
        description:
            'The real thing. Not a chai latte, not a concentrate—proper Indian masala chai brewed from scratch with whole spices.',
        ingredients: [
            '2 cups Water',
            '1 cup Milk',
            '2 tbsp Loose leaf black tea',
            '4 Green cardamom pods, crushed',
            '1 inch Fresh ginger, sliced',
            '2 Cloves',
            '1 Small cinnamon stick',
            '2 tbsp Sugar or jaggery',
        ],
        instructions: [
            'Add water, ginger, and all spices to a pot. Bring to boil.',
            'Reduce heat, add tea leaves and simmer for 3 minutes.',
            'Add milk and sugar, bring to boil again.',
            'Strain and serve hot.',
        ],
        relatedProductIds: [10, 11, 27], // Cardamom, Cinnamon, Chai Masala
    },
];
