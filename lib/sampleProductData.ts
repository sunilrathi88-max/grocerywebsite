import { Product } from './types';

/**
 * Sample products with comprehensive e-commerce fields
 * Use this as a reference when populating your database
 */
export const SAMPLE_PRODUCTS: Partial<Product>[] = [
  {
    name: "Premium Kashmiri Saffron",
    slug: "premium-kashmiri-saffron",
    description: "Authentic Kashmiri saffron threads, grade A quality with deep red color and rich aroma.",
    price: 2499,
    compare_price: 2999,
    stock: 50,
    status: "active",
    
    // Marketing flags
    featured: true,
    bestseller: true,
    new_arrival: false,
    discount_percent: 16.67,
    
    // Inventory
    sku: "SAFF-KASH-001",
    barcode: "8901234567890",
    brand: "Tattva Co.",
    min_order_qty: 1,
    max_order_qty: 10,
    
    // Reviews
    rating: 4.8,
    review_count: 127,
    
    // SEO
    meta_title: "Premium Kashmiri Saffron - Grade A Quality | Tattva Co.",
    meta_description: "Buy authentic Kashmiri saffron threads online. Grade A quality with ISO certification. Free shipping on orders above ₹500.",
    
    // Product Details
    weight_value: 1,
    weight_unit: "gm",
    origin_country: "India",
    certifications: ["ISO 9001", "FSSAI", "Organic"],
    grade: "Grade A",
    
    // Tags
    tags: ["saffron", "kashmiri", "premium", "organic", "spices"],
    
    // Nutritional info
    nutritional_info: {
      calories: 310,
      protein: 11.4,
      carbs: 65.4,
      fat: 5.9,
      fiber: 3.9,
      serving_size: "100g"
    },
    
    // Storage & Allergens
    allergen_info: "None. Packaged in a facility that handles nuts.",
    
    // Images (comma-separated URLs)
    images: "https://images.unsplash.com/photo-1596040033229-a0b85f8e4a1f?w=800",
    
    // Variants
    // Note: In the database, this would be a separate variants table
    // For seeding, you might store as JSONB or handle separately
  },
  
  {
    name: "Organic Turmeric Powder",
    slug: "organic-turmeric-powder",
    description: "100% pure organic turmeric powder with high curcumin content. No additives or preservatives.",
    price: 299,
    compare_price: 349,
    stock: 200,
    status: "active",
    
    featured: true,
    bestseller: true,
    new_arrival: false,
    discount_percent: 14.33,
    
    sku: "TURM-ORG-250",
    barcode: "8901234567891",
    brand: "Tattva Co.",
    min_order_qty: 1,
    max_order_qty: 20,
    
    rating: 4.7,
    review_count: 243,
    
    meta_title: "Organic Turmeric Powder - High Curcumin | Tattva Co.",
    meta_description: "Premium organic turmeric powder with high curcumin content. USDA Organic certified. Perfect for cooking and health benefits.",
    
    weight_value: 250,
    weight_unit: "gm",
    origin_country: "India",
    certifications: ["USDA Organic", "FSSAI", "Non-GMO"],
    grade: "Premium",
    
    tags: ["turmeric", "organic", "curcumin", "powder", "spices", "health"],
    
    nutritional_info: {
      calories: 354,
      protein: 7.8,
      carbs: 64.9,
      fat: 9.9,
      fiber: 21.1,
      curcumin_content: 3.5,
      serving_size: "100g"
    },
    
    allergen_info: "None",
    images: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800",
  },
  
  {
    name: "Himalayan Pink Salt",
    slug: "himalayan-pink-salt",
    description: "Pure Himalayan pink salt crystals, rich in 84 trace minerals. Perfect for cooking and seasoning.",
    price: 199,
    stock: 150,
    status: "active",
    
    featured: false,
    bestseller: true,
    new_arrival: false,
    
    sku: "SALT-HIM-500",
    barcode: "8901234567892",
    brand: "Tattva Co.",
    min_order_qty: 1,
    max_order_qty: 15,
    
    rating: 4.6,
    review_count: 89,
    
    meta_title: "Himalayan Pink Salt - 84 Trace Minerals | Tattva Co.",
    meta_description: "Buy authentic Himalayan pink salt online. Rich in 84 trace minerals. Natural and unrefined.",
    
    weight_value: 500,
    weight_unit: "gm",
    origin_country: "Pakistan",
    certifications: ["FSSAI", "Natural"],
    
    tags: ["salt", "himalayan", "pink-salt", "minerals", "natural"],
    
    nutritional_info: {
      sodium: 38758,
      iron: 0.369,
      calcium: 16.6,
      magnesium: 1.06,
      serving_size: "100g"
    },
    
    allergen_info: "None",
    images: "https://images.unsplash.com/photo-1520989883308-e7aeb6c14c12?w=800",
  },
  
  {
    name: "Black Pepper Whole",
    slug: "black-pepper-whole",
    description: "Premium whole black peppercorns with bold flavor and aroma. Freshly sourced from Kerala plantations.",
    price: 449,
    compare_price: 499,
    stock: 100,
    status: "active",
    
    featured: false,
    bestseller: false,
    new_arrival: true,
    discount_percent: 10,
    
    sku: "PEPP-BLK-250",
    barcode: "8901234567893",
    brand: "Tattva Co.",
    min_order_qty: 1,
    max_order_qty: 10,
    
    rating: 4.9,
    review_count: 56,
    
    meta_title: "Black Pepper Whole - Premium Kerala Peppercorns | Tattva Co.",
    meta_description: "Freshly sourced whole black peppercorns from Kerala. Bold flavor and aroma. Perfect for cooking.",
    
    weight_value: 250,
    weight_unit: "gm",
    origin_country: "India",
    certifications: ["FSSAI", "Organic"],
    grade: "Premium",
    spicelevel: "hot",
    
    tags: ["pepper", "black-pepper", "whole", "kerala", "spices"],
    
    nutritional_info: {
      calories: 251,
      protein: 10.4,
      carbs: 64.8,
      fat: 3.3,
      fiber: 25.3,
      serving_size: "100g"
    },
    
    allergen_info: "None",
    images: "https://images.unsplash.com/photo-1599909533955-1c3d41d36dd9?w=800",
  },
  
  {
    name: "Organic Cinnamon Sticks",
    slug: "organic-cinnamon-sticks",
    description: "Premium Ceylon cinnamon sticks with sweet, delicate flavor. Perfect for tea, desserts, and curries.",
    price: 349,
    stock: 75,
    status: "active",
    
    featured: false,
    bestseller: false,
    new_arrival: true,
    
    sku: "CINN-CEY-100",
    barcode: "8901234567894",
    brand: "Tattva Co.",
    min_order_qty: 1,
    max_order_qty: 10,
    
    rating: 4.5,
    review_count: 34,
    
    meta_title: "Organic Ceylon Cinnamon Sticks | Tattva Co.",
    meta_description: "Premium Ceylon cinnamon sticks. Organic and authentic. Perfect for tea and cooking.",
    
    weight_value: 100,
    weight_unit: "gm",
    origin_country: "Sri Lanka",
    certifications: ["USDA Organic", "FSSAI"],
    grade: "Ceylon",
    
    tags: ["cinnamon", "ceylon", "organic", "sticks", "spices"],
    
    nutritional_info: {
      calories: 247,
      protein: 4,
      carbs: 81,
      fat: 1.2,
      fiber: 53.1,
      serving_size: "100g"
    },
    
    allergen_info: "None",
    images: "https://images.unsplash.com/photo-1596040033218-bdcd5e41e97f?w=800",
  }
];

/**
 * Helper function to generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Helper function to calculate discount percentage
 */
export function calculateDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100 * 100) / 100;
}
