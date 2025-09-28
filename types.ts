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
}

export interface CartItem extends Product {
  quantity: number;
}