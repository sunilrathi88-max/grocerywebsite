import { Recipe, Order, Subscription, ProductSubstitution } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Butter Chicken',
    description: 'Creamy and rich North Indian curry with tender chicken pieces',
    cuisine: 'North Indian',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: '1. Marinate chicken with yogurt and spices\n2. Grill or pan-fry chicken\n3. Prepare tomato-based gravy with butter and cream\n4. Add chicken and simmer\n5. Garnish with cream and kasuri methi',
    dietaryTags: ['high-protein'],
    ingredients: [
      { id: 'ri-1', recipeId: 'recipe-1', productId: 1, quantity: 500, unit: 'g', notes: 'boneless, cubed', isOptional: false },
      { id: 'ri-2', recipeId: 'recipe-1', productId: 5, quantity: 200, unit: 'g', notes: 'pureed', isOptional: false },
      { id: 'ri-3', recipeId: 'recipe-1', productId: 10, quantity: 100, unit: 'ml', notes: '', isOptional: false },
    ]
  },
  {
    id: 'recipe-2',
    name: 'Masala Dosa',
    description: 'Crispy South Indian crepe filled with spiced potato masala',
    cuisine: 'South Indian',
    prepTimeMinutes: 30,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: '1. Prepare dosa batter (fermented rice and lentils)\n2. Make potato masala filling\n3. Spread batter on hot griddle\n4. Add filling and fold\n5. Serve with chutney and sambar',
    dietaryTags: ['vegetarian', 'vegan'],
    ingredients: [
      { id: 'ri-4', recipeId: 'recipe-2', productId: 7, quantity: 4, unit: 'medium', notes: 'boiled and mashed', isOptional: false },
      { id: 'ri-5', recipeId: 'recipe-2', productId: 2, quantity: 200, unit: 'g', notes: '', isOptional: false },
      { id: 'ri-6', recipeId: 'recipe-2', productId: 6, quantity: 1, unit: 'cup', notes: '', isOptional: false },
    ]
  },
  {
    id: 'recipe-3',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices and yogurt',
    cuisine: 'North Indian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.pexels.com/photos/6607343/pexels-photo-6607343.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: '1. Cut paneer into cubes\n2. Mix yogurt with spices for marinade\n3. Marinate paneer and vegetables\n4. Skewer and grill\n5. Serve hot with mint chutney',
    dietaryTags: ['vegetarian', 'high-protein'],
    ingredients: [
      { id: 'ri-7', recipeId: 'recipe-3', productId: 11, quantity: 400, unit: 'g', notes: 'cubed', isOptional: false },
      { id: 'ri-8', recipeId: 'recipe-3', productId: 8, quantity: 2, unit: 'medium', notes: 'cubed', isOptional: false },
      { id: 'ri-9', recipeId: 'recipe-3', productId: 9, quantity: 1, unit: 'medium', notes: 'cubed', isOptional: false },
    ]
  },
  {
    id: 'recipe-4',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with aromatic spices',
    cuisine: 'North Indian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.pexels.com/photos/4871119/pexels-photo-4871119.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: '1. Pressure cook lentils with turmeric\n2. Prepare tadka with ghee, cumin, garlic\n3. Pour tadka over cooked dal\n4. Simmer for 5 minutes\n5. Garnish with coriander',
    dietaryTags: ['vegetarian', 'vegan', 'high-protein'],
    ingredients: [
      { id: 'ri-10', recipeId: 'recipe-4', productId: 2, quantity: 200, unit: 'g', notes: '', isOptional: false },
      { id: 'ri-11', recipeId: 'recipe-4', productId: 5, quantity: 2, unit: 'medium', notes: 'chopped', isOptional: false },
      { id: 'ri-12', recipeId: 'recipe-4', productId: 3, quantity: 1, unit: 'tbsp', notes: '', isOptional: true },
    ]
  },
  {
    id: 'recipe-5',
    name: 'Biryani',
    description: 'Fragrant layered rice dish with meat and aromatic spices',
    cuisine: 'Mughlai',
    prepTimeMinutes: 40,
    cookTimeMinutes: 50,
    servings: 6,
    difficulty: 'hard',
    imageUrl: 'https://images.pexels.com/photos/12737657/pexels-photo-12737657.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: '1. Marinate meat with yogurt and spices\n2. Parboil rice with whole spices\n3. Layer marinated meat and rice\n4. Add saffron milk and fried onions\n5. Dum cook for 30 minutes',
    dietaryTags: ['high-protein'],
    ingredients: [
      { id: 'ri-13', recipeId: 'recipe-5', productId: 1, quantity: 800, unit: 'g', notes: '', isOptional: false },
      { id: 'ri-14', recipeId: 'recipe-5', productId: 6, quantity: 500, unit: 'g', notes: 'basmati', isOptional: false },
      { id: 'ri-15', recipeId: 'recipe-5', productId: 4, quantity: 3, unit: 'large', notes: 'sliced', isOptional: false },
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    status: 'delivered',
    totalAmount: 850,
    deliveryAddress: '123 MG Road, Bangalore',
    deliveryDate: new Date('2025-09-28'),
    items: [
      { id: 'oi-1', orderId: 'order-1', productId: 1, quantity: 500, unitPrice: 450, subtotal: 450, isSubstitution: false },
      { id: 'oi-2', orderId: 'order-1', productId: 2, quantity: 1, unitPrice: 150, subtotal: 150, isSubstitution: false },
      { id: 'oi-3', orderId: 'order-1', productId: 3, quantity: 1, unitPrice: 250, subtotal: 250, isSubstitution: false },
    ],
    createdAt: new Date('2025-09-25')
  },
  {
    id: 'order-2',
    userId: 'user-1',
    status: 'delivered',
    totalAmount: 1200,
    deliveryAddress: '123 MG Road, Bangalore',
    deliveryDate: new Date('2025-09-20'),
    items: [
      { id: 'oi-4', orderId: 'order-2', productId: 5, quantity: 2, unitPrice: 200, subtotal: 400, isSubstitution: false },
      { id: 'oi-5', orderId: 'order-2', productId: 6, quantity: 2, unitPrice: 400, subtotal: 800, isSubstitution: false },
    ],
    createdAt: new Date('2025-09-18')
  }
];

export const mockSubscription: Subscription = {
  id: 'sub-1',
  userId: 'user-1',
  frequency: 'weekly',
  nextDeliveryDate: new Date('2025-10-09'),
  status: 'active',
  deliveryAddress: '123 MG Road, Bangalore',
  items: [
    { id: 'si-1', subscriptionId: 'sub-1', productId: 1, quantity: 500 },
    { id: 'si-2', subscriptionId: 'sub-1', productId: 2, quantity: 1 },
    { id: 'si-3', subscriptionId: 'sub-1', productId: 6, quantity: 1 },
  ],
  createdAt: new Date('2025-09-01')
};

export const mockProductSubstitutions: ProductSubstitution[] = [
  { id: 'ps-1', productId: 1, substituteProductId: 1, priority: 1, reason: 'Same quality, organic variant' },
  { id: 'ps-2', productId: 5, substituteProductId: 5, priority: 1, reason: 'Fresh local tomatoes' },
  { id: 'ps-3', productId: 3, substituteProductId: 3, priority: 1, reason: 'Premium ghee alternative' },
];
