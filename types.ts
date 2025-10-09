export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  stock: number;
  reviews: Review[];
  unit?: string;
  lowStockThreshold?: number;
  isAvailable?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductSubstitution {
  id: string;
  productId: number;
  substituteProductId: number;
  priority: number;
  reason: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate?: Date;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isSubstitution: boolean;
  originalProductId?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDeliveryDate: Date;
  status: 'active' | 'paused' | 'cancelled';
  deliveryAddress: string;
  items: SubscriptionItem[];
  createdAt: Date;
}

export interface SubscriptionItem {
  id: string;
  subscriptionId: string;
  productId: number;
  quantity: number;
}

export interface SubstitutionPreference {
  id: string;
  userId: string;
  productId: number;
  preferredSubstituteId?: number;
  allowSubstitution: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  instructions: string;
  dietaryTags: string[];
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  productId: number;
  quantity: number;
  unit: string;
  notes?: string;
  isOptional: boolean;
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  status: 'draft' | 'active' | 'completed';
  recipes: MealPlanRecipe[];
}

export interface MealPlanRecipe {
  id: string;
  mealPlanId: string;
  recipeId: string;
  scheduledDate: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
}

export interface PantryItem {
  id: string;
  userId: string;
  productId: number;
  quantity: number;
  unit: string;
  expiryDate?: Date;
}

export interface RestockNotification {
  id: string;
  userId: string;
  productId: number;
  notified: boolean;
  createdAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
}