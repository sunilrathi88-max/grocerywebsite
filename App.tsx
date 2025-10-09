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
import { ReorderSubscription } from './components/ReorderSubscription';
import { RecipeToCart } from './components/RecipeToCart';
import { InventorySubstitutions } from './components/InventorySubstitutions';
import { mockProducts, mockTestimonials } from './data/mockData';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [testimonials] = useState(mockTestimonials);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeView, setActiveView] = useState<'shop' | 'reorder' | 'recipes' | 'inventory'>('shop');

  const categories = useMemo(() => {
    const allCategories = mockProducts.map(p => p.category);
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

  const handleAddToCartById = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      handleAddToCart(product, quantity);
    }
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
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveView('shop')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeView === 'shop'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shop Products
              </button>
              <button
                onClick={() => setActiveView('recipes')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeView === 'recipes'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recipes
              </button>
              <button
                onClick={() => setActiveView('reorder')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeView === 'reorder'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reorder & Subscriptions
              </button>
              <button
                onClick={() => setActiveView('inventory')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeView === 'inventory'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inventory & Substitutions
              </button>
            </nav>
          </div>
        </div>

        {activeView === 'shop' && <Hero />}
        {activeView === 'shop' && (
          <>
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
          </>
        )}

        {activeView === 'recipes' && (
          <RecipeToCart onAddToCart={handleAddToCartById} />
        )}

        {activeView === 'reorder' && (
          <ReorderSubscription onAddToCart={handleAddToCartById} />
        )}

        {activeView === 'inventory' && (
          <InventorySubstitutions products={products} onAddToCart={handleAddToCartById} />
        )}
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