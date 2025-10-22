import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  ToastMessage,
  Review,
  Variant,
  User,
  Order,
  OrderStatus,
  QnA as QnAType,
  BlogPost,
} from './types';
import { Recipe } from './components/RecipesPage';

// Performance Utils
import { usePerformanceMonitoring } from './utils/performance';

// SEO Utils
import SEO from './components/SEO';
import { pageSEO, generateOrganizationSchema, generateProductSchema } from './utils/seo';

// Custom Hooks
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useProductFilter } from './hooks/useProductFilter';
import { useProducts } from './hooks/useProducts';

// Mock Data
import { MOCK_USER, MOCK_ORDERS, MOCK_TESTIMONIALS, MOCK_ANALYTICS, MOCK_POSTS } from './data';

// Core Components (Eagerly Loaded - Always Visible)
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import PromotionalBanner from './components/PromotionalBanner';
import SortDropdown from './components/SortDropdown';

// Lazy-Loaded Components (Load on Demand)
const Hero = React.lazy(() => import('./components/Hero'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const ProductDetailModal = React.lazy(() => import('./components/ProductDetailModal'));
const SideModal = React.lazy(() => import('./components/SideModal'));
const Cart = React.lazy(() => import('./components/Cart'));
const Wishlist = React.lazy(() => import('./components/Wishlist'));
const SocialProofNotifications = React.lazy(() => import('./components/SocialProofNotifications'));
const MobileMenu = React.lazy(() => import('./components/MobileMenu'));
const AdvancedFilters = React.lazy(() => import('./components/AdvancedFilters'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const ComparisonBar = React.lazy(() => import('./components/ComparisonBar'));
const ComparisonModal = React.lazy(() => import('./components/ComparisonModal'));
const ExitIntentModal = React.lazy(() => import('./components/ExitIntentModal'));
const RecipeDetailModal = React.lazy(() => import('./components/RecipeDetailModal'));
const QuizModule = React.lazy(() => import('./components/QuizModule'));

// Lazy-Loaded Pages (Route-Based Code Splitting)
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const PrivacyPolicyPage = React.lazy(() => import('./components/PrivacyPolicyPage'));
const RefundPolicyPage = React.lazy(() => import('./components/RefundPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./components/TermsOfServicePage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const FAQsPage = React.lazy(() => import('./components/FAQsPage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const RecipesPage = React.lazy(() => import('./components/RecipesPage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const BlogPostPage = React.lazy(() => import('./components/BlogPostPage'));

const App: React.FC = () => {
  // Enable performance monitoring
  usePerformanceMonitoring();

  // Register Service Worker (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Import workbox-window dynamically
      import('workbox-window')
        .then(({ Workbox }) => {
          const wb = new Workbox('/sw.js');

          wb.addEventListener('installed', (event) => {
            if (event.isUpdate) {
              // New content available, show update notification
              if (window.confirm('New version available! Click OK to update.')) {
                window.location.reload();
              }
            }
          });

          wb.register().catch((error) => {
            console.warn('Service Worker registration failed:', error);
          });
        })
        .catch((error) => {
          console.warn('Workbox import failed:', error);
        });
    }
  }, []);

  // Custom hooks for cart, wishlist, filtering, and products
  const { cartItems, subtotal, addToCart, updateQuantity, clearCart } = useCart();

  const { wishlistItems, wishlistItemCount, toggleWishlist, isInWishlist } = useWishlist();

  // Use the products hook with mock data fallback (set useMockData: true for now)
  const {
    products,
    // isLoading: _productsLoading, // Unused but available for future
    // error: _productsError, // Unused but available for future
    addProduct: addProductAPI,
    updateProduct: updateProductAPI,
    deleteProduct: deleteProductAPI,
    addReview,
    addQuestion,
    // refreshProducts, // Available if needed for manual refresh
  } = useProducts({ useMockData: true, autoFetch: true });

  // State management
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  // Advanced filters state
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...products.flatMap((p) => p.variants.map((v) => v.price)), 0)),
    [products]
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  // Comparison state
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Exit-intent modal state
  const [isExitIntentModalOpen, setIsExitIntentModalOpen] = useState(false);

  // Recipe page state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      setCurrentView(hash || 'home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Exit-intent listener
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isExitIntentModalOpen && cartItems.length > 0) {
        setIsExitIntentModalOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isExitIntentModalOpen, cartItems.length]);

  // Memoized values
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );
  const availableTags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags || []))),
    [products]
  );
  const wishlistedIds = useMemo(() => new Set(wishlistItems.map((p) => p.id)), [wishlistItems]);
  const comparisonIds = useMemo(() => new Set(comparisonItems.map((p) => p.id)), [comparisonItems]);

  const shippingCost = useMemo(() => (subtotal > 50 || subtotal === 0 ? 0 : 10), [subtotal]);

  // Handlers
  const addToast = useCallback(
    (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => {
      const newToast = { id: Date.now(), message, type, icon };
      setToasts((currentToasts) => [...currentToasts, newToast]);
    },
    []
  );

  const handleAddToCart = useCallback(
    (product: Product, variant: Variant, quantity: number = 1) => {
      addToCart(product, variant, quantity);
      addToast(`${product.name} added to cart!`, 'success');
    },
    [addToCart, addToast]
  );

  const handleUpdateQuantity = useCallback(
    (productId: number, variantId: number, quantity: number) => {
      updateQuantity(productId, variantId, quantity);
    },
    [updateQuantity]
  );

  const handleToggleWishlist = useCallback(
    (product: Product) => {
      const wasInWishlist = isInWishlist(product.id);
      toggleWishlist(product);
      if (wasInWishlist) {
        addToast(`${product.name} removed from wishlist.`, 'info');
      } else {
        addToast(`${product.name} added to wishlist!`, 'success');
      }
    },
    [toggleWishlist, isInWishlist, addToast]
  );

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentUser(MOCK_USER);
    setAuthModalOpen(false);
    addToast(`Welcome back, ${MOCK_USER.name}!`, 'success');
  }, [addToast]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    addToast('You have been logged out.', 'info');
  }, [addToast]);

  const handleSelectCategoryAndClose = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    window.location.hash = '#/';
  }, []);

  const handleAddReview = useCallback(
    async (productId: number, review: Omit<Review, 'id'>) => {
      try {
        const newReview = { ...review, id: Date.now(), verifiedPurchase: isLoggedIn };
        await addReview(productId, newReview);
        addToast('Thank you for your review!', 'success');
      } catch {
        addToast('Failed to add review. Please try again.', 'error');
      }
    },
    [isLoggedIn, addToast, addReview]
  );

  const handleDeleteReview = useCallback(
    (_productId: number, _reviewId: number) => {
      // Since useProducts doesn't have deleteReview yet, we'll skip this for now
      // or implement it as a no-op in mock mode
      addToast('Review deletion not yet implemented', 'info');
    },
    [addToast]
  );

  const handleAskQuestion = useCallback(
    async (productId: number, question: { author: string; question: string }) => {
      try {
        const newQnA: QnAType = { ...question, id: Date.now() };
        await addQuestion(productId, newQnA);
        addToast('Your question has been submitted.', 'success');
      } catch {
        addToast('Failed to submit question. Please try again.', 'error');
      }
    },
    [addToast, addQuestion]
  );

  const handleNotifyMe = useCallback(
    (productName: string) => {
      addToast(`We'll notify you when ${productName} is back in stock!`, 'success');
      setSelectedProduct(null);
    },
    [addToast]
  );

  const handleApplyPromoCode = useCallback(
    (code: string) => {
      if (code.toUpperCase() === 'TATTVA10') {
        setDiscount(subtotal * 0.1);
        setPromoCode(code);
        addToast('Promo code applied!', 'success');
      } else if (code.toUpperCase() === 'COMEBACK15' || code.toUpperCase() === 'QUIZMASTER15') {
        setDiscount(subtotal * 0.15);
        setPromoCode(code);
        addToast('Promo code applied!', 'success');
      } else if (code.toUpperCase() === 'SPICEFAN10') {
        setDiscount(subtotal * 0.1);
        setPromoCode(code);
        addToast('Promo code applied!', 'success');
      } else {
        addToast('Invalid promo code.', 'error');
      }
    },
    [subtotal, addToast]
  );

  const handleRemovePromoCode = useCallback(() => {
    setDiscount(0);
    setPromoCode('');
  }, []);

  const handlePlaceOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
      const newOrder: Order = {
        ...orderData,
        id: `TC${1003 + orders.length}-${new Date().getFullYear()}`,
        date: new Date().toISOString(),
        status: 'Processing',
      };
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setDiscount(0);
      setPromoCode('');
      setCurrentView('home'); // Prevent staying on checkout page
      window.location.hash = `#/order-confirmation/${newOrder.id}`;
      return newOrder;
    },
    [orders.length, clearCart]
  );

  // Admin handlers
  const handleSaveProduct = useCallback(
    async (product: Product) => {
      try {
        if (product.id === 0) {
          // New product
          await addProductAPI(product);
        } else {
          // Existing product
          await updateProductAPI(product.id, product);
        }
        addToast(`Product "${product.name}" saved successfully!`, 'success');
      } catch {
        addToast('Failed to save product. Please try again.', 'error');
      }
    },
    [addToast, addProductAPI, updateProductAPI]
  );

  const handleDeleteProduct = useCallback(
    async (productId: number) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        const success = await deleteProductAPI(productId);
        if (success) {
          addToast('Product deleted.', 'info');
        } else {
          addToast('Failed to delete product.', 'error');
        }
      }
    },
    [addToast, deleteProductAPI]
  );

  const handleUpdateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  // Comparison handlers
  const handleToggleCompare = useCallback(
    (product: Product) => {
      setComparisonItems((prev) => {
        const isCompared = prev.some((item) => item.id === product.id);
        if (isCompared) {
          return prev.filter((item) => item.id !== product.id);
        } else if (prev.length < 4) {
          return [...prev, product];
        } else {
          addToast('You can only compare up to 4 products.', 'info');
          return prev;
        }
      });
    },
    [addToast]
  );

  // Filtering and sorting logic (delegated to useProductFilter hook)
  const sortMap: Record<
    string,
    'rating' | 'price-asc' | 'price-desc' | 'name' | 'newest' | undefined
  > = {
    'price-asc': 'price-asc',
    'price-desc': 'price-desc',
    'rating-desc': 'rating',
    featured: undefined,
  };

  const { filteredProducts } = useProductFilter(products, {
    category: selectedCategory,
    searchQuery,
    priceRange: [priceRange.min, priceRange.max],
    inStockOnly: showInStock,
    sortBy: sortMap[sortOrder],
  });

  // Additional filters not yet in useProductFilter hook
  const filteredAndSortedProducts = useMemo(() => {
    let result = filteredProducts;

    if (showOnSale) {
      result = result.filter((p) => p.variants.some((v) => v.salePrice && v.salePrice < v.price));
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) => selectedTags.every((tag) => p.tags?.includes(tag)));
    }

    return result;
  }, [filteredProducts, showOnSale, selectedTags]);

  const renderView = () => {
    // Loading fallback for lazy-loaded pages
    const PageLoader = () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

    if (currentView.startsWith('order-confirmation')) {
      const orderId = currentView.split('/')[1];
      const order = orders.find((o) => o.id === orderId);
      // This is a trick to show the confirmation page by re-using the CheckoutPage component structure
      return order ? (
        <React.Suspense fallback={<PageLoader />}>
          <CheckoutPage
            cartItems={[]}
            user={currentUser}
            onPlaceOrder={handlePlaceOrder}
            addToast={addToast}
            discount={0}
            promoCode=""
            onApplyPromoCode={() => {}}
            onRemovePromoCode={() => {}}
            subtotal={0}
            shippingCost={0}
          />
        </React.Suspense>
      ) : (
        <div className="text-center py-20">
          <h2>Order not found</h2>
        </div>
      );
    }

    if (currentView.startsWith('blog/')) {
      const slug = currentView.split('/')[1];
      const post = posts.find((p) => p.slug === slug);
      return post ? (
        <React.Suspense fallback={<PageLoader />}>
          <BlogPostPage post={post} />
        </React.Suspense>
      ) : (
        <div className="text-center py-20">
          <h2>Post not found</h2>
        </div>
      );
    }

    switch (currentView) {
      case 'checkout':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <CheckoutPage
              cartItems={cartItems}
              user={currentUser}
              onPlaceOrder={handlePlaceOrder}
              addToast={addToast}
              discount={discount}
              promoCode={promoCode}
              onApplyPromoCode={handleApplyPromoCode}
              onRemovePromoCode={handleRemovePromoCode}
              subtotal={subtotal}
              shippingCost={shippingCost}
            />
          </React.Suspense>
        );
      case 'profile':
        return currentUser ? (
          <React.Suspense fallback={<PageLoader />}>
            <UserProfile user={currentUser} orders={orders} />
          </React.Suspense>
        ) : (
          <div className="text-center py-20">
            <h2>Please log in to view your profile.</h2>
          </div>
        );
      case 'admin':
        return currentUser?.isAdmin ? (
          <React.Suspense fallback={<PageLoader />}>
            <AdminDashboard
              products={products}
              orders={orders}
              analytics={MOCK_ANALYTICS}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </React.Suspense>
        ) : (
          <div className="text-center py-20">
            <h2>Access Denied.</h2>
          </div>
        );
      case 'privacy-policy':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <PrivacyPolicyPage />
          </React.Suspense>
        );
      case 'refund-policy':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <RefundPolicyPage />
          </React.Suspense>
        );
      case 'terms-of-service':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <TermsOfServicePage />
          </React.Suspense>
        );
      case 'about':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <AboutPage />
          </React.Suspense>
        );
      case 'faqs':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <FAQsPage />
          </React.Suspense>
        );
      case 'contact':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <ContactPage />
          </React.Suspense>
        );
      case 'recipes':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <RecipesPage onSelectRecipe={setSelectedRecipe} />
          </React.Suspense>
        );
      case 'blog':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <BlogPage
              posts={posts}
              onSelectPost={(slug) => (window.location.hash = `#/blog/${slug}`)}
            />
          </React.Suspense>
        );
      case 'home':
      default:
        return (
          <>
            <Hero />
            <main
              id="products-section"
              className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 animate-fade-in"
            >
              <div className="mb-8 animate-fade-in-up">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              <React.Suspense fallback={null}>
                <div className="flex flex-col gap-6 mb-8 animate-fade-in-up stagger-1">
                  <AdvancedFilters
                    showOnSale={showOnSale}
                    onToggleOnSale={() => setShowOnSale((v) => !v)}
                    showInStock={showInStock}
                    onToggleInStock={() => setShowInStock((v) => !v)}
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onToggleTag={(tag) =>
                      setSelectedTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    priceRange={priceRange}
                    maxPrice={maxPrice}
                    onPriceChange={(val) => setPriceRange((prev) => ({ ...prev, max: val }))}
                  />
                </div>
              </React.Suspense>
              <SortDropdown currentSort={sortOrder} onSortChange={setSortOrder} />
              <ProductGrid
                products={filteredAndSortedProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistedIds={wishlistedIds}
                onSelectProduct={setSelectedProduct}
                onToggleCompare={handleToggleCompare}
                comparisonIds={comparisonIds}
                isLoading={isLoading}
                onNotifyMe={handleNotifyMe}
              />
            </main>
            <React.Suspense fallback={null}>
              <Testimonials testimonials={MOCK_TESTIMONIALS} />
            </React.Suspense>
            <section className="bg-brand-secondary/30 py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <React.Suspense fallback={null}>
                  <QuizModule addToast={addToast} />
                </React.Suspense>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* SEO Meta Tags and Structured Data */}
      <SEO
        {...(currentView === 'home'
          ? pageSEO.home()
          : currentView === 'recipes'
            ? pageSEO.recipes()
            : currentView === 'blog'
              ? pageSEO.blog()
              : currentView === 'about'
                ? pageSEO.about()
                : currentView === 'contact'
                  ? pageSEO.contact()
                  : currentView === 'faqs'
                    ? pageSEO.home()
                    : selectedCategory !== 'All'
                      ? pageSEO.products(selectedCategory)
                      : pageSEO.home())}
        structuredData={generateOrganizationSchema()}
        structuredDataId="organization-schema"
      />

      {showPromoBanner && <PromotionalBanner onClose={() => setShowPromoBanner(false)} />}
      <Header
        cartItems={cartItems}
        wishlistItemCount={wishlistItemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        isLoggedIn={isLoggedIn}
        isAdmin={!!currentUser?.isAdmin}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        allProducts={products}
        onSelectProduct={setSelectedProduct}
        subtotal={subtotal}
        categories={categories}
        onSelectCategory={setSelectedCategory}
      />
      <div className={`pt-20 flex-grow ${comparisonItems.length > 0 ? 'pb-24' : ''}`}>
        {renderView()}
      </div>
      <Footer onSelectCategory={setSelectedCategory} />

      {/* Modals & Overlays - Wrapped in Suspense for lazy loading */}
      <React.Suspense fallback={null}>
        {selectedProduct && (
          <>
            {/* Product-specific SEO */}
            <SEO
              {...pageSEO.product(selectedProduct.name, selectedProduct.description)}
              structuredData={generateProductSchema(selectedProduct)}
              structuredDataId="product-schema"
            />
            <ProductDetailModal
              product={selectedProduct}
              allProducts={products}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              onAddReview={handleAddReview}
              onDeleteReview={handleDeleteReview}
              onSelectCategoryAndClose={handleSelectCategoryAndClose}
              addToast={addToast}
              onAskQuestion={handleAskQuestion}
              onSelectProduct={setSelectedProduct}
              onNotifyMe={handleNotifyMe}
            />
          </>
        )}

        {selectedRecipe && (
          <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}

        <SideModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          title="Your Shopping Cart"
        >
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onClose={() => setIsCartOpen(false)}
            isLoggedIn={isLoggedIn}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromoCode={handleApplyPromoCode}
            discount={discount}
            subtotal={subtotal}
            shippingCost={shippingCost}
          />
        </SideModal>

        <SideModal
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          title="Your Wishlist"
        >
          <Wishlist
            items={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onClose={() => setIsWishlistOpen(false)}
          />
        </SideModal>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ToastContainer
          toasts={toasts}
          onClose={(id) => setToasts((current) => current.filter((t) => t.id !== id))}
        />

        <SocialProofNotifications />

        {isAuthModalOpen && (
          <AuthModal onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />
        )}

        <ComparisonBar
          items={comparisonItems}
          onRemove={(p) => setComparisonItems((prev) => prev.filter((item) => item.id !== p.id))}
          onClear={() => setComparisonItems([])}
          onCompare={() => setIsComparisonModalOpen(true)}
        />

        {isComparisonModalOpen && (
          <ComparisonModal
            items={comparisonItems}
            onClose={() => setIsComparisonModalOpen(false)}
          />
        )}

        {isExitIntentModalOpen && (
          <ExitIntentModal
            onClose={() => setIsExitIntentModalOpen(false)}
            onApplyPromo={handleApplyPromoCode}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default App;
