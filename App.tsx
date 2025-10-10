
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, Review, ToastMessage, Variant, User, Order, OrderStatus, Address } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Wishlist from './components/Wishlist';
import Testimonials from './components/Testimonials';
import ProductDetailModal from './components/ProductDetailModal';
import CategoryFilter from './components/CategoryFilter';
import ToastContainer from './components/ToastContainer';
import SideModal from './components/SideModal';
import { HeartIcon } from './components/icons/HeartIcon';
import Breadcrumbs from './components/Breadcrumbs';
import PromotionalBanner from './components/PromotionalBanner';
import SortDropdown from './components/SortDropdown';
import MobileMenu from './components/MobileMenu';
import AdvancedFilters from './components/AdvancedFilters';
import CheckoutPage from './components/CheckoutPage';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';

const MOCK_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Himalayan Saffron', 
    description: 'Hand-picked from the pristine high-altitude valleys of Kashmir, our Himalayan Saffron boasts an intoxicating aroma and a deep, vibrant crimson color. Each delicate thread promises to infuse your culinary creations with an unparalleled, luxurious flavor and a golden hue. Perfect for biryanis, desserts, and saffron-infused teas.', 
    images: [
      'https://images.unsplash.com/photo-1599511438938-2303d5448f70?q=80&w=800&h=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631140356882-756515758a18?q=80&w=800&h=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599511438914-5f532a2223a3?q=80&w=800&h=800&auto=format&fit=crop'
    ],
    videos: [
      'https://videos.pexels.com/video-files/6864539/6864539-hd.mp4'
    ],
    category: 'Spices',
    variants: [
      { id: 101, name: '1g', price: 15.99, stock: 10 },
      { id: 102, name: '2g', price: 29.99, stock: 5 },
      { id: 103, name: '5g', price: 69.99, salePrice: 64.99, stock: 3 },
    ],
    reviews: [
      { id: 1, author: 'Aisha R.', rating: 5, comment: "Absolutely the best saffron I've ever used. The aroma is intoxicating!" },
      { id: 2, author: 'Vikram B.', rating: 4, comment: "Great quality and color. A bit pricey, but worth it for special occasions." },
    ] 
  },
  { 
    id: 2, 
    name: 'Malabar Black Pepper', 
    description: 'Sourced directly from the lush, spice-laden hills of the Malabar Coast, these Tellicherry peppercorns are among the world\'s finest. They are left on the vine longer to develop a deep, rich flavor profile that is both pungent and complexly aromatic, with hints of citrus and pine. Grind fresh for a transformative kick to any dish.', 
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb4e3f?q=80&w=800&h=800&auto=format&fit=crop'], 
    videos: [
      'https://videos.pexels.com/video-files/5589467/5589467-sd.mp4'
    ],
    category: 'Spices', 
    variants: [
        { id: 201, name: '100g', price: 8.50, salePrice: 6.99, stock: 20 }
    ],
    reviews: [
      { id: 3, author: 'Meera N.', rating: 5, comment: "Incredibly pungent and flavorful. You can really taste the difference." },
    ] 
  },
  { 
    id: 3, 
    name: 'Assam Gold Tea', 
    description: 'Full-bodied black tea with malty flavor.', 
    images: ['https://images.unsplash.com/photo-1627891244343-03067ea81404?q=80&w=800&h=800&auto=format&fit=crop'], 
    category: 'Beverages',
    variants: [
        { id: 301, name: '250g', price: 12.00, stock: 25 }
    ], 
    reviews: [] 
  },
  { 
    id: 4, 
    name: 'Organic Turmeric Powder', 
    description: 'Vibrant and earthy turmeric with high curcumin content.', 
    images: ['https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=800&h=800&auto=format&fit=crop'], 
    category: 'Spices',
    variants: [
        { id: 401, name: '150g', price: 6.75, stock: 50 }
    ],
    reviews: [] 
  },
  { 
    id: 5, 
    name: 'California Almonds', 
    description: 'Crunchy and nutritious premium almonds.', 
    images: [
        'https://images.unsplash.com/photo-1569472023033-9a3d24001d4b?q=80&w=800&h=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606756790134-42848c7f5592?q=80&w=800&h=800&auto=format&fit=crop',
    ], 
    category: 'Nuts',
    variants: [
        { id: 501, name: '500g', price: 18.25, salePrice: 15.00, stock: 3 },
        { id: 502, name: '1kg', price: 34.00, salePrice: 28.50, stock: 0 }
    ],
    reviews: [
      { id: 4, author: 'Sanjay P.', rating: 5, comment: "Very fresh and crunchy. Perfect for snacking." },
    ] 
  },
  { 
    id: 6, 
    name: 'Gourmet Garam Masala', 
    description: 'Our signature Garam Masala is a tribute to tradition, artisanally crafted from a secret blend of over a dozen whole spices. Each spice is individually toasted to perfection before being ground to release its full-bodied aroma and flavor. This warm, fragrant blend is the heart of North Indian cuisine, essential for creating authentic, soul-satisfying dishes.', 
    images: ['https://images.unsplash.com/photo-1599021438284-82d2d6501d9f?q=80&w=800&h=800&auto=format&fit=crop'], 
    videos: [
      'https://videos.pexels.com/video-files/5763784/5763784-sd.mp4'
    ],
    category: 'Spices', 
    variants: [{ id: 601, name: '100g', price: 9.99, stock: 30 }],
    reviews: [] 
  },
  { 
    id: 7, 
    name: 'Sun-dried Figs', 
    description: 'Sweet and chewy figs, naturally dried.', 
    images: ['https://images.unsplash.com/photo-1601056582390-0b73c4155b1f?q=80&w=800&h=800&auto=format&fit=crop'], 
    category: 'Dry Fruits', 
    variants: [{ id: 701, name: '400g', price: 14.50, stock: 0 }],
    reviews: [] 
  },
  { 
    id: 8, 
    name: 'Cashew Nuts (W240)', 
    description: 'Large, whole cashew nuts, creamy and delicious.', 
    images: ['https://images.unsplash.com/photo-1601358902534-19c2a1381395?q=80&w=800&h=800&auto=format&fit=crop'], 
    category: 'Nuts', 
    variants: [{ id: 801, name: '500g', price: 22.00, stock: 40 }],
    reviews: [] 
  },
];

const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Priya S.', quote: 'The spices are incredibly fresh and aromatic. My curries have never tasted better! Tattva Co. is my new go-to for all my Indian cooking needs.', rating: 5 },
  { id: 2, name: 'Rahul K.', quote: 'Absolutely love the quality of the almonds and cashews. They are crunchy, fresh, and taste premium. The packaging is also top-notch.', rating: 5 },
  { id: 3, name: 'Anjali M.', quote: 'I was looking for authentic garam masala and found it here. The blend is perfect and adds such a wonderful flavor to my dishes. Highly recommended!', rating: 4 },
];

const MOCK_USER: User = {
  id: 1,
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  isAdmin: true,
  addresses: [
    { id: 1, type: 'Shipping', street: '123 Spice Lane', city: 'Mumbai', state: 'MH', zip: '400001', country: 'India', isDefault: true },
    { id: 2, type: 'Billing', street: '456 Silk Road', city: 'Delhi', state: 'DL', zip: '110001', country: 'India' },
  ]
};

const MOCK_PROMO_CODES: { [key: string]: { type: 'percent' | 'fixed'; value: number } } = {
  'TATTVA10': { type: 'percent', value: 10 },
  'SPICE5': { type: 'fixed', value: 5 },
};

const getInitialRoute = () => window.location.hash.replace(/^#/, '') || '/';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [testimonials] = useState(MOCK_TESTIMONIALS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isBannerVisible, setBannerVisible] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  
  // New state for routing and auth
  const [route, setRoute] = useState(getInitialRoute());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setRoute(getInitialRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage['type'], icon?: React.ReactNode) => {
    setToasts(toasts => [...toasts, { id: Date.now(), message, type, icon }]);
  }, []);
  
  useEffect(() => {
    const code = promoCode.toUpperCase();
    const promo = MOCK_PROMO_CODES[code];
    if (promo) {
        const subtotal = cartItems.reduce((sum, item) => {
            const price = item.selectedVariant.salePrice ?? item.selectedVariant.price;
            return sum + price * item.quantity;
        }, 0);

        if (promo.type === 'percent') {
            setDiscount((subtotal * promo.value) / 100);
        } else {
            setDiscount(promo.value);
        }
    } else {
        setDiscount(0);
    }
  }, [cartItems, promoCode]);

  const handleApplyPromoCode = useCallback((code: string) => {
    const promo = MOCK_PROMO_CODES[code.toUpperCase()];
    if (promo) {
        setPromoCode(code);
        if (promo.type === 'percent') {
            addToast(`Successfully applied ${promo.value}% discount!`, 'success');
        } else {
            addToast(`Successfully applied $${promo.value.toFixed(2)} discount!`, 'success');
        }
    } else {
        setPromoCode('');
        addToast('Invalid or expired promo code.', 'error');
    }
  }, [addToast]);

  const handleRemovePromoCode = useCallback(() => {
      setPromoCode('');
      addToast('Promo code removed.', 'info');
  }, [addToast]);

  const removeToast = useCallback((id: number) => {
    setToasts(toasts => toasts.filter(toast => toast.id !== id));
  }, []);

  const categories = useMemo(() => {
    const allCategories = MOCK_PRODUCTS.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, []);

  const getProductPrice = (product: Product): number => {
    const prices = product.variants.map(v => v.salePrice ?? v.price);
    return Math.min(...prices);
  };

  const processedProducts = useMemo(() => {
    let filtered = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOnSale = !showOnlyOnSale || product.variants.some(v => v.salePrice && v.salePrice < v.price);
        const matchesInStock = !showOnlyInStock || product.variants.some(v => v.stock > 0);
        return matchesCategory && matchesSearch && matchesOnSale && matchesInStock;
    });

    switch (sortOption) {
        case 'price-asc':
            filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
            break;
        case 'price-desc':
            filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
            break;
        case 'rating-desc':
            filtered.sort((a, b) => {
                const ratingA = a.reviews.length > 0 ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
                const ratingB = b.reviews.length > 0 ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
                return ratingB - ratingA;
            });
            break;
        case 'featured':
        default:
            // Assuming original order is 'featured'
            break;
    }
    return filtered;
  }, [products, searchQuery, selectedCategory, sortOption, showOnlyOnSale, showOnlyInStock]);

  const handleAddToCart = useCallback((product: Product, variant: Variant, quantity: number = 1) => {
    if (variant.stock < quantity) {
      addToast(`Sorry, '${product.name} (${variant.name})' is out of stock.`, 'error');
      return;
    }

    const itemInCart = cartItems.find(item => item.product.id === product.id && item.selectedVariant.id === variant.id);

    if (itemInCart && (itemInCart.quantity + quantity) > variant.stock) {
      addToast(`Only ${variant.stock} units of '${product.name} (${variant.name})' are available.`, 'error');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id && item.selectedVariant.id === variant.id);
      if (existingItem) {
        return prevItems.map(item =>
          (item.product.id === product.id && item.selectedVariant.id === variant.id) ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { product, selectedVariant: variant, quantity }];
      }
    });
    addToast(`'${product.name} (${variant.name})' added to cart`, 'success');
  }, [cartItems, addToast]);

  const handleAddProductToCart = useCallback((product: Product, variant: Variant) => {
    handleAddToCart(product, variant, 1);
  }, [handleAddToCart]);
  
  const handleUpdateQuantity = useCallback((productId: number, variantId: number, quantity: number) => {
    const itemInCart = cartItems.find(item => item.product.id === productId && item.selectedVariant.id === variantId);
    if (!itemInCart) return;

    if (quantity > itemInCart.selectedVariant.stock) {
      addToast(`Only ${itemInCart.selectedVariant.stock} units of '${itemInCart.product.name} (${itemInCart.selectedVariant.name})' are available.`, 'error');
      return;
    }

    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => !(item.product.id === productId && item.selectedVariant.id === variantId));
      }
      return prevItems.map(item =>
        (item.product.id === productId && item.selectedVariant.id === variantId) ? { ...item, quantity } : item
      );
    });
  }, [cartItems, addToast]);

  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlist(prevWishlist => {
        const isInWishlist = prevWishlist.some(item => item.id === product.id);
        if (isInWishlist) {
            return prevWishlist.filter(item => item.id !== product.id);
        } else {
            addToast(`'${product.name}' added to wishlist`, 'success', <HeartIcon className="h-6 w-6 text-red-500 fill-current" />);
            return [...prevWishlist, product];
        }
    });
  }, [addToast]);

  const handleAddReview = useCallback((productId: number, review: Omit<Review, 'id'>) => {
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(p => {
          if (p.id === productId) {
              const newReview = { ...review, id: Date.now() + Math.random() };
              const updatedProduct = { ...p, reviews: [newReview, ...p.reviews] };
              setSelectedProduct(updatedProduct);
              return updatedProduct;
          }
          return p;
      });
      return updatedProducts;
    });
  }, []);

  const handleDeleteReview = useCallback((productId: number, reviewId: number) => {
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(p => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.filter(review => review.id !== reviewId);
          const updatedProduct = { ...p, reviews: updatedReviews };
          setSelectedProduct(updatedProduct);
          return updatedProduct;
        }
        return p;
      });
      return updatedProducts;
    });
  }, []);
  
  const handleSelectCategoryAndClose = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
  }, []);

  const wishlistedIds = useMemo(() => new Set(wishlist.map(p => p.id)), [wishlist]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);

  const handleAddToCartAndCloseModal = useCallback((p: Product, v: Variant) => {
    handleAddToCart(p, v, 1);
    setSelectedProduct(null);
  }, [handleAddToCart]);

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '#/' },
    ];

    if (route.startsWith('/profile')) {
      items.push({ label: 'Profile' });
    } else if (route.startsWith('/admin')) {
        items.push({ label: 'Admin Dashboard' });
    } else if (route.startsWith('/checkout')) {
        items.push({ label: 'Checkout' });
    } else if (selectedCategory !== 'All' || selectedProduct) {
      items.push({ label: 'Products', href: '#/' });
      if(selectedCategory !== 'All') {
        items.push({ label: selectedCategory });
      }
    } else {
      items.push({ label: 'Products' });
    }
    
    return items;
  }, [selectedCategory, selectedProduct, route]);
  
  const handleLoginToggle = useCallback(() => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      addToast('You have been logged out.', 'info');
    } else {
      setIsLoggedIn(true);
      setCurrentUser(MOCK_USER);
      addToast(`Welcome back, ${MOCK_USER.name}!`, 'success');
    }
  }, [isLoggedIn, addToast]);

  const handlePlaceOrder = useCallback((orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `TCO-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCartItems([]);
    setPromoCode('');
    return newOrder;
  }, []);

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
        const exists = prev.some(p => p.id === product.id);
        if (exists) {
            return prev.map(p => p.id === product.id ? product : p);
        }
        return [...prev, { ...product, id: Date.now() }];
    });
    addToast('Product saved successfully!', 'success');
  };

  const handleDeleteProduct = (productId: number) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addToast('Product deleted!', 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      addToast(`Order ${orderId} status updated to ${status}.`, 'success');
  };


  const renderPage = () => {
    switch (route) {
        case '/checkout':
            return <CheckoutPage 
                      cartItems={cartItems} 
                      user={currentUser!} 
                      onPlaceOrder={handlePlaceOrder} 
                      addToast={addToast} 
                      discount={discount}
                      promoCode={promoCode}
                      onApplyPromoCode={handleApplyPromoCode}
                      onRemovePromoCode={handleRemovePromoCode}
                    />;
        case '/profile':
            return <UserProfile user={currentUser!} orders={orders} />;
        case '/admin':
            return currentUser?.isAdmin ? <AdminDashboard 
                                            products={products} 
                                            orders={orders} 
                                            onSaveProduct={handleSaveProduct} 
                                            onDeleteProduct={handleDeleteProduct} 
                                            onUpdateOrderStatus={handleUpdateOrderStatus}
                                          /> : <div className="text-center py-20"><h2>Access Denied</h2></div>;
        default:
            return (
                <>
                    <Hero />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Our Products</h2>
                        </div>
                        
                        <CategoryFilter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        />
                        
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <AdvancedFilters 
                            showOnSale={showOnlyOnSale}
                            onToggleOnSale={() => setShowOnlyOnSale(v => !v)}
                            showInStock={showOnlyInStock}
                            onToggleInStock={() => setShowOnlyInStock(v => !v)}
                        />
                        <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
                        </div>

                        <ProductGrid 
                        products={processedProducts} 
                        onAddToCart={handleAddProductToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistedIds={wishlistedIds}
                        onSelectProduct={setSelectedProduct}
                        />
                    </div>
                    <Testimonials testimonials={testimonials} />
                </>
            );
    }
  }


  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {isBannerVisible && <PromotionalBanner onClose={() => setBannerVisible(false)} />}
      <Header 
        cartItemCount={cartItemCount} 
        wishlistItemCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={openCart}
        onWishlistClick={openWishlist}
        onMobileMenuClick={() => setMobileMenuOpen(true)}
        isLoggedIn={isLoggedIn}
        isAdmin={currentUser?.isAdmin ?? false}
        onLoginToggle={handleLoginToggle}
      />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {renderPage()}
      </main>
      <Footer />

      <SideModal title="Shopping Cart" isOpen={isCartOpen} onClose={() => setCartOpen(false)}>
        <Cart 
          items={cartItems} 
          onUpdateQuantity={handleUpdateQuantity} 
          onClose={() => setCartOpen(false)}
          isLoggedIn={isLoggedIn}
          promoCode={promoCode}
          onPromoCodeChange={setPromoCode}
          onApplyPromoCode={handleApplyPromoCode}
          discount={discount}
        />
      </SideModal>

      <SideModal title="Your Wishlist" isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)}>
        <Wishlist 
          items={wishlist} 
          onToggleWishlist={handleToggleWishlist} 
          onAddToCart={handleAddProductToCart}
          onClose={() => setWishlistOpen(false)}
        />
      </SideModal>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCartAndCloseModal}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
          onSelectCategoryAndClose={handleSelectCategoryAndClose}
          addToast={addToast}
        />
      )}
    </div>
  );
};

export default App;