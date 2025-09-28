import React, { useState, useMemo } from 'react';
import { Product, CartItem, Review } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Wishlist from './components/Wishlist';
import Testimonials from './components/Testimonials';
import ProductDetailModal from './components/ProductDetailModal';
import CategoryFilter from './components/CategoryFilter';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Himalayan Saffron', description: 'Premium quality saffron from the valleys of Kashmir.', price: 15.99, imageUrl: 'https://picsum.photos/seed/saffron/400/400', category: 'Spices', stock: 10, reviews: [
    { id: 1, author: 'Aisha R.', rating: 5, comment: "Absolutely the best saffron I've ever used. The aroma is intoxicating!" },
    { id: 2, author: 'Vikram B.', rating: 4, comment: "Great quality and color. A bit pricey, but worth it for special occasions." },
  ] },
  { id: 2, name: 'Malabar Black Pepper', description: 'Aromatic and pungent peppercorns from Kerala.', price: 8.50, salePrice: 6.99, imageUrl: 'https://picsum.photos/seed/pepper/400/400', category: 'Spices', stock: 0, reviews: [
    { id: 3, author: 'Meera N.', rating: 5, comment: "Incredibly pungent and flavorful. You can really taste the difference." },
  ] },
  { id: 3, name: 'Assam Gold Tea', description: 'Full-bodied black tea with malty flavor.', price: 12.00, imageUrl: 'https://picsum.photos/seed/tea/400/400', category: 'Beverages', stock: 25, reviews: [] },
  { id: 4, name: 'Organic Turmeric Powder', description: 'Vibrant and earthy turmeric with high curcumin content.', price: 6.75, imageUrl: 'https://picsum.photos/seed/turmeric/400/400', category: 'Spices', stock: 50, reviews: [] },
  { id: 5, name: 'California Almonds', description: 'Crunchy and nutritious premium almonds.', price: 18.25, salePrice: 15.00, imageUrl: 'https://picsum.photos/seed/almonds/400/400', category: 'Nuts', stock: 3, reviews: [
    { id: 4, author: 'Sanjay P.', rating: 5, comment: "Very fresh and crunchy. Perfect for snacking." },
  ] },
  { id: 6, name: 'Gourmet Garam Masala', description: 'Aromatic blend of hand-ground spices for authentic flavor.', price: 9.99, imageUrl: 'https://picsum.photos/seed/masala/400/400', category: 'Spices', stock: 30, reviews: [] },
  { id: 7, name: 'Sun-dried Figs', description: 'Sweet and chewy figs, naturally dried.', price: 14.50, imageUrl: 'https://picsum.photos/seed/figs/400/400', category: 'Dry Fruits', stock: 12, reviews: [] },
  { id: 8, name: 'Cashew Nuts (W240)', description: 'Large, whole cashew nuts, creamy and delicious.', price: 22.00, imageUrl: 'https://picsum.photos/seed/cashews/400/400', category: 'Nuts', stock: 40, reviews: [] },
];

const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Priya S.', quote: 'The spices are incredibly fresh and aromatic. My curries have never tasted better! Tattva Co. is my new go-to for all my Indian cooking needs.', rating: 5 },
  { id: 2, name: 'Rahul K.', quote: 'Absolutely love the quality of the almonds and cashews. They are crunchy, fresh, and taste premium. The packaging is also top-notch.', rating: 5 },
  { id: 3, name: 'Anjali M.', quote: 'I was looking for authentic garam masala and found it here. The blend is perfect and adds such a wonderful flavor to my dishes. Highly recommended!', rating: 4 },
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [testimonials] = useState(MOCK_TESTIMONIALS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const allCategories = MOCK_PRODUCTS.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) return;
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id);
      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
        const isInWishlist = prevWishlist.some(item => item.id === product.id);
        if (isInWishlist) {
            return prevWishlist.filter(item => item.id !== product.id);
        } else {
            return [...prevWishlist, product];
        }
    });
  };

  const handleAddReview = (productId: number, review: Omit<Review, 'id'>) => {
    const updatedProducts = products.map(p => {
        if (p.id === productId) {
            const newReview = { ...review, id: Date.now() + Math.random() };
            const updatedProduct = { ...p, reviews: [newReview, ...p.reviews] };
            setSelectedProduct(updatedProduct);
            return updatedProduct;
        }
        return p;
    });
    setProducts(updatedProducts);
  };

  const handleDeleteReview = (productId: number, reviewId: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updatedReviews = p.reviews.filter(review => review.id !== reviewId);
        const updatedProduct = { ...p, reviews: updatedReviews };
        setSelectedProduct(updatedProduct);
        return updatedProduct;
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const wishlistedIds = useMemo(() => new Set(wishlist.map(p => p.id)), [wishlist]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        cartItemCount={cartItemCount} 
        wishlistItemCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery} 
      />
      <main className="flex-grow pt-20">
        <Hero />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-4">Our Products</h2>
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="flex flex-col lg:flex-row lg:gap-12 mt-8">
              <div className="lg:w-2/3">
                <ProductGrid 
                  products={filteredProducts} 
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistedIds={wishlistedIds}
                  onSelectProduct={setSelectedProduct}
                />
              </div>
              <div className="lg:w-1/3 mt-12 lg:mt-0">
                  <div className="lg:sticky top-28">
                    <Cart items={cartItems} onUpdateQuantity={handleUpdateQuantity} />
                  </div>
              </div>
            </div>
        </div>
        {wishlist.length > 0 && (
          <div className="bg-brand-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-10">Your Wishlist</h2>
              <Wishlist 
                items={wishlist} 
                onToggleWishlist={handleToggleWishlist} 
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            </div>
          </div>
        )}
        <Testimonials testimonials={testimonials} />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => {
            handleAddToCart(p, 1);
            setSelectedProduct(null);
          }}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
        />
      )}
    </div>
  );
};

export default App;