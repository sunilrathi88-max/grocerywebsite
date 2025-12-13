import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  Product,
  ToastMessage,
  Review,
  Variant,
  User,
  Order,
  QnA as QnAType,
  Recipe,
} from './types';

// Performance Utils
import { usePerformanceMonitoring } from './utils/performance';

// SEO Utils
import SEO from './components/SEO';
import { pageSEO, generateOrganizationSchema } from './utils/seo';

// Custom Hooks
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useProductFilter } from './hooks/useProductFilter';
import { useProducts } from './hooks/useProducts';
import { supabase } from './supabaseClient';

// Mock Data
import { MOCK_TESTIMONIALS, MOCK_POSTS, MOCK_RECIPES } from './data';

// Core Components (Eagerly Loaded - Always Visible)
// Core Components (Eagerly Loaded - Always Visible)
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import PromotionalBanner from './components/PromotionalBanner';
import SortDropdown from './components/SortDropdown';
import Hero from './components/Hero';

// Lazy-Loaded Components (Load on Demand)
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

const MobileBottomNav = React.lazy(() => import('./components/MobileBottomNav'));

const MessagingShowcase = React.lazy(() => import('./components/MessagingShowcase'));

// Lazy-Loaded Pages (Route-Based Code Splitting)
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const PrivacyPolicyPage = React.lazy(() => import('./components/PrivacyPolicyPage'));
const RefundPolicyPage = React.lazy(() => import('./components/RefundPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./components/TermsOfServicePage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const PEACECards = React.lazy(() => import('./components/PEACECards'));
const BrandStory = React.lazy(() => import('./components/BrandStory'));
const FAQsPage = React.lazy(() => import('./components/FAQsPage'));
const RecommendedProducts = React.lazy(() => import('./components/RecommendedProducts'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const RecipesPage = React.lazy(() => import('./components/RecipesPage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const BlogPostPage = React.lazy(() => import('./components/BlogPostPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('./components/ForgotPasswordPage'));
const EmailVerificationPage = React.lazy(() => import('./components/EmailVerificationPage'));
const TwoFactorSetupPage = React.lazy(() => import('./components/TwoFactorSetupPage'));

const App: React.FC = () => {
  // Enable performance monitoring
  usePerformanceMonitoring();

  // Register Service Worker (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      import('workbox-window')
        .then(({ Workbox }) => {
          const wb = new Workbox('/sw.js');

          wb.addEventListener('installed', (event) => {
            if (event.isUpdate) {
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

  // --- State Definitions ---

  // Navigation & View State
  const [currentView, setCurrentView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Cart & Wishlist UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Product & Filter State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<
    'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  >('newest');

  // Advanced Filters State
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // New Filters State
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedHeatLevels, setSelectedHeatLevels] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGrinds, setSelectedGrinds] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Feature Specific State
  const [isExitIntentModalOpen, setIsExitIntentModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Custom hooks
  const { cartItems, subtotal, addToCart, updateQuantity, clearCart } = useCart();
  const { wishlistItems, wishlistItemCount, toggleWishlist, isInWishlist } = useWishlist();

  const {
    products,
    isLoading: productsLoading,

    addReview,
    addQuestion,
  } = useProducts({ useMockData: true });

  // --- Order Fetching ---
  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        try {
          // Dynamically import to avoid circular dependencies if any, though apiService is safe
          const { orderAPI } = await import('./utils/apiService');
          const response = await orderAPI.getAll();
          if (response.success && response.data) {
            setOrders(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
          // Fallback to empty or keep mock if needed, but for real app we want real data
          // setOrders([]);
        }
      } else {
        setOrders([]); // Clear orders on logout
      }
    };

    fetchOrders();
  }, [currentUser]);

  // --- Computed Values & Effects ---

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

  // Automatically enable "On Sale" filter when on Offers page
  useEffect(() => {
    if (currentView === 'offers') {
      setShowOnSale(true);
    }
  }, [currentView]);

  // Calculate Max Price from Products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(
      Math.max(...products.map((p) => p.variants[0].salePrice ?? p.variants[0].price))
    );
  }, [products]);

  // Sync Price Range
  useEffect(() => {
    setPriceRange((prev) => {
      if (prev.max === 0 || prev.max < maxPrice) return { ...prev, max: maxPrice };
      return prev;
    });
  }, [maxPrice]);

  // Exit Intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isExitIntentModalOpen && cartItems.length > 0) {
        setIsExitIntentModalOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isExitIntentModalOpen, cartItems.length]);

  // Handle 'offers' route
  useEffect(() => {
    if (currentView === 'offers') {
      setShowOnSale(true);
    } else if (currentView === 'home') {
      setShowOnSale(false);
    }
  }, [currentView]);

  // Derived Data for Filters
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const availableTags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags || []))),
    [products]
  );

  const availableOrigins = useMemo(
    () => Array.from(new Set(products.map((p) => p.origin).filter(Boolean) as string[])),
    [products]
  );

  const availableSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.variants.map((v) => v.name)))),
    [products]
  );

  const availableGrinds = useMemo(
    () => Array.from(new Set(products.map((p) => p.grind).filter(Boolean) as string[])),
    [products]
  );

  const availableGrades = useMemo(
    () => Array.from(new Set(products.map((p) => p.grade).filter(Boolean) as string[])),
    [products]
  );

  const availableHeatLevels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy']; // Static for now, or derive from tags
  const availableCuisines: string[] = []; // Placeholder, to be populated from tags or new field

  const wishlistedIds = useMemo(() => new Set(wishlistItems.map((p) => p.id)), [wishlistItems]);
  const comparisonIds = useMemo(() => new Set(comparisonItems.map((p) => p.id)), [comparisonItems]);
  const shippingCost = useMemo(() => (subtotal > 999 || subtotal === 0 ? 0 : 50), [subtotal]);

  // --- Filter Hook Integration ---
  const { filteredProducts } = useProductFilter(products, {
    category: selectedCategory,
    searchQuery,
    priceRange: [priceRange.min, priceRange.max],
    inStockOnly: showInStock,
    sortBy: sortOrder,
    origin: selectedOrigins,
    heatLevel: selectedHeatLevels,
    cuisine: selectedCuisines,
    size: selectedSizes,
    grind: selectedGrinds,
    grade: selectedGrades,
    showOnSale,
    tags: selectedTags,
  });

  // Use filteredProducts directly as the final result
  const finalFilteredProducts = filteredProducts;

  // --- Handlers ---

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

  const handleLogout = useCallback(async () => {
    const { supabase } = await import('./supabaseClient');
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    addToast('Logged out successfully.', 'success');
    window.location.hash = '#/';
  }, [addToast]);

  const handleSelectCategoryAndClose = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const handleAddReview = useCallback(
    (productId: number, review: Omit<Review, 'id'>) => {
      // Check for verified purchase
      const hasPurchased = orders.some((order) =>
        order.items.some((item) => item.product.id === productId)
      );

      const newReview: Review = {
        ...review,
        id: Date.now(),
        verifiedPurchase: hasPurchased,
        helpful: 0,
      };

      addReview(productId, newReview);
      addToast('Review submitted successfully!', 'success');
    },
    [addReview, addToast, orders]
  );

  const handleDeleteReview = useCallback(
    (_productId: number, _reviewId: number) => {
      addToast('Review deleted.', 'info');
    },
    [addToast]
  );

  const handleAskQuestion = useCallback(
    (productId: number, question: { author: string; question: string }) => {
      const newQuestion: QnAType = {
        ...question,
        id: Date.now(),
        answer: '',
        date: new Date().toISOString(),
      };
      addQuestion(productId, newQuestion);
      addToast('Question submitted!', 'success');
    },
    [addQuestion, addToast]
  );

  const handleUpdateQuantity = useCallback(
    (productId: number, variantId: number, quantity: number) => {
      updateQuantity(productId, variantId, quantity);
    },
    [updateQuantity]
  );

  const handleNotifyMe = useCallback(
    (_productId: number | string) => {
      addToast('We will notify you when this product is back in stock!', 'success');
    },
    [addToast]
  );

  const handleLogin = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      try {
        const { userAPI } = await import('./utils/apiService');
        const response = await userAPI.login({ email, password });

        if (!response.success || !response.data) {
          addToast('Invalid email or password', 'error');
          return;
        }

        const user = response.data.user;
        setIsLoggedIn(true);
        setCurrentUser(user);
        setAuthModalOpen(false);
        window.location.hash = '#/';

        addToast(`Welcome back, ${user.name || user.email}!`, 'success');

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        addToast(message, 'error');
      }
    },
    [addToast]
  );

  // Supabase Auth Listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const user = session.user;
          setIsLoggedIn(true);
          setCurrentUser({
            id: parseInt(user.id.replace(/-/g, '').slice(0, 15), 16),
            email: user.email || '',
            name: user.user_metadata?.name || user.email || '',
            isAdmin: Boolean(user.user_metadata?.is_admin),
            profilePicture: user.user_metadata?.picture || user.user_metadata?.avatar_url,
            phone: user.user_metadata?.phone || user.phone || undefined,
            wishlist: [],
            orders: [],
            addresses: user.user_metadata?.addresses || [],
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;
          setIsLoggedIn(true);
          setCurrentUser({
            id: parseInt(user.id.replace(/-/g, '').slice(0, 15), 16),
            email: user.email || '',
            name: user.user_metadata?.name || user.email || '',
            isAdmin: Boolean(user.user_metadata?.is_admin),
            profilePicture: user.user_metadata?.picture || user.user_metadata?.avatar_url,
            phone: user.user_metadata?.phone || user.phone || undefined,
            wishlist: [],
            orders: [],
            addresses: [],
          });
          if (event === 'SIGNED_IN') {
            addToast(`Welcome back, ${user.user_metadata?.name || user.email}!`, 'success');
          }
          if (window.location.hash.includes('access_token')) {
            window.history.replaceState({}, document.title, window.location.pathname + '#/');
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      });

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, [addToast]);

  const handleSignUp = useCallback(
    async (name: string, _email: string, _password: string) => {
      window.location.hash = '#/';
      addToast(`Welcome, ${name}!`, 'success');
    },
    [addToast]
  );

  const handleApplyPromoCode = useCallback(
    (code: string) => {
      if (promoCode) {
        addToast('Promo code already applied. Please remove current code first.', 'error');
        return;
      }

      if (subtotal < 500) {
        addToast('Minimum order of ₹500 required for promo codes.', 'error');
        return;
      }

      if (['TATTVA10', 'SPICEFAN10'].includes(code.toUpperCase())) {
        setDiscount(subtotal * 0.1);
        setPromoCode(code);
        addToast('Promo code applied!', 'success');
      } else if (['COMEBACK15', 'QUIZMASTER15'].includes(code.toUpperCase())) {
        setDiscount(subtotal * 0.15);
        setPromoCode(code);
        addToast('Promo code applied!', 'success');
      } else {
        addToast('Invalid promo code.', 'error');
      }
    },
    [subtotal, addToast, promoCode]
  );

  const handleRemovePromoCode = useCallback(() => {
    setDiscount(0);
    setPromoCode('');
  }, []);

  const handlePlaceOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      clearCart();
      setDiscount(0);
      setPromoCode('');

      // Loyalty Points Logic (Mock)
      const currentPoints = parseInt(localStorage.getItem('loyaltyPoints') || '0', 10);
      const pointsEarned = Math.floor(order.total); // 1 point per currency unit
      localStorage.setItem('loyaltyPoints', (currentPoints + pointsEarned).toString());
    },
    [clearCart]
  );

  const handleToggleCompare = useCallback(
    (product: Product) => {
      setComparisonItems((prev) => {
        const isCompared = prev.some((item) => item.id === product.id);
        if (isCompared) return prev.filter((item) => item.id !== product.id);
        if (prev.length < 4) return [...prev, product];
        addToast('You can only compare up to 4 products.', 'info');
        return prev;
      });
    },
    [addToast]
  );

  // Filter Toggles
  const handleToggleOrigin = (origin: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  };
  const handleToggleHeatLevel = (level: string) => {
    setSelectedHeatLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };
  const handleToggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };
  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const handleToggleGrind = (grind: string) => {
    setSelectedGrinds((prev) =>
      prev.includes(grind) ? prev.filter((g) => g !== grind) : [...prev, grind]
    );
  };
  const handleToggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedOrigins([]);
    setSelectedHeatLevels([]);
    setSelectedCuisines([]);
    setSelectedSizes([]);
    setSelectedGrinds([]);
    setSelectedGrades([]);
    setShowOnSale(false);
    setShowInStock(false);
    setSelectedTags([]);
    setSortOrder('newest');
    addToast('Filters cleared', 'success');
  }, [maxPrice, addToast]);

  // --- Render Views ---

  const renderView = () => {
    const PageLoader = () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

    // Use empty strings to avoid overriding page titles, purely for Schema injection
    const orgSchema = generateOrganizationSchema();
    const GlobalSEO = <SEO title="" description="" structuredData={orgSchema} />;

    if (currentView.startsWith('order-confirmation')) {
      const orderId = currentView.split('/')[1];
      const order = orders.find((o) => o.id === orderId);
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
      const post = MOCK_POSTS.find((p) => p.slug === slug);
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
      case 'messaging':
        return (
          <React.Suspense fallback={<PageLoader />}>
            {GlobalSEO}
            <MessagingShowcase />
          </React.Suspense>
        );
      case 'checkout':
        return (
          <React.Suspense fallback={<PageLoader />}>
            {GlobalSEO}
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
            <UserProfile
              user={currentUser}
              orders={orders}
              onUpdateUser={(updatedUser) =>
                setCurrentUser((prev) => ({ ...prev!, ...updatedUser }))
              }
            />
          </React.Suspense>
        ) : (
          <div className="text-center py-20">
            <h2>Please log in to view your profile.</h2>
          </div>
        );
      case 'admin':
        return currentUser?.isAdmin ? (
          <React.Suspense fallback={<PageLoader />}>
            <AdminDashboard />
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
            <RecipesPage recipes={MOCK_RECIPES} onSelectRecipe={setSelectedRecipe} />
          </React.Suspense>
        );
      case 'blog':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <BlogPage
              posts={MOCK_POSTS}
              onSelectPost={(slug) => (window.location.hash = `#/blog/${slug}`)}
            />
          </React.Suspense>
        );
      case 'login':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <LoginPage
              onLogin={handleLogin}
              onNavigateToSignup={() => (window.location.hash = '#/signup')}
              onNavigateToForgotPassword={() => (window.location.hash = '#/forgot-password')}
            />
          </React.Suspense>
        );
      case 'signup':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <SignUpPage
              onSignUp={handleSignUp}
              onNavigateToLogin={() => (window.location.hash = '#/login')}
            />
          </React.Suspense>
        );
      case 'forgot-password':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage onNavigateToLogin={() => (window.location.hash = '#/login')} />
          </React.Suspense>
        );
      case 'verify-email': {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const email = params.get('email') || currentUser?.email || '';
        return (
          <React.Suspense fallback={<PageLoader />}>
            <EmailVerificationPage
              email={email}
              onNavigateToHome={() => (window.location.hash = '#/')}
              onResendEmail={() => addToast('Verification email sent!', 'success')}
            />
          </React.Suspense>
        );
      }
      case '2fa-setup':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <TwoFactorSetupPage
              onComplete={() => {
                addToast('2FA enabled successfully!', 'success');
                window.location.hash = '#/profile';
              }}
              onCancel={() => (window.location.hash = '#/profile')}
            />
          </React.Suspense>
        );
      case 'offers':
        return (
          <>
            <div className="bg-brand-secondary/20 py-12 mb-8">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
                  Special Offers
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Exclusive deals on our premium spices and ingredients. Limited time only.
                </p>
              </div>
            </div>
            <div
              id="products-section"
              className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8 container mx-auto px-4 py-8"
            >
              <aside className="sticky top-24 h-fit">
                <React.Suspense
                  fallback={
                    <div
                      className="bg-gray-100 rounded-xl animate-pulse"
                      style={{ height: '450px' }}
                    />
                  }
                >
                  <AdvancedFilters
                    showOnSale={showOnSale}
                    onToggleOnSale={() => setShowOnSale(!showOnSale)}
                    showInStock={showInStock}
                    onToggleInStock={() => setShowInStock(!showInStock)}
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    priceRange={priceRange}
                    maxPrice={maxPrice}
                    onPriceChange={(max) => setPriceRange((prev) => ({ ...prev, max }))}
                    origins={availableOrigins}
                    selectedOrigins={selectedOrigins}
                    onToggleOrigin={handleToggleOrigin}
                    heatLevels={availableHeatLevels}
                    selectedHeatLevels={selectedHeatLevels}
                    onToggleHeatLevel={handleToggleHeatLevel}
                    cuisines={availableCuisines}
                    selectedCuisines={selectedCuisines}
                    onToggleCuisine={handleToggleCuisine}
                    sizes={availableSizes}
                    selectedSizes={selectedSizes}
                    onToggleSize={handleToggleSize}
                    grinds={availableGrinds}
                    selectedGrinds={selectedGrinds}
                    onToggleGrind={handleToggleGrind}
                    grades={availableGrades}
                    selectedGrades={selectedGrades}
                    onToggleGrade={handleToggleGrade}
                  />
                </React.Suspense>
              </aside>

              <div className="min-w-0">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Showing {finalFilteredProducts.length} results</p>
                  <SortDropdown
                    currentSort={sortOrder}
                    onSortChange={(val) => setSortOrder(val as typeof sortOrder)}
                  />
                </div>

                <ProductGrid
                  products={finalFilteredProducts}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistedIds={wishlistedIds}
                  onSelectProduct={setSelectedProduct}
                  onToggleCompare={handleToggleCompare}
                  comparisonIds={comparisonIds}
                  isLoading={productsLoading}
                  onNotifyMe={handleNotifyMe}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </>
        );
      case 'home':
      default:
        // New Homepage Layout (PEACE Framework)
        return (
          <>
            <Hero
              onShopNow={() => {
                const element = document.getElementById('products-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* PEACE Soundbites Section */}
            <div id="why-us">
              <React.Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
                <PEACECards />
              </React.Suspense>
            </div>

            {/* Personalized Recommendations */}
            <React.Suspense fallback={null}>
              <RecommendedProducts
                allProducts={products}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProduct}
                onNotifyMe={handleNotifyMe}
              />
            </React.Suspense>

            {/* Product Grid Section */}
            <div id="products-section" className="bg-brand-accent py-20">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                    Curated for Impact
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Handpicked essentials that will change the way you cook forever.
                    <br className="hidden md:block" />
                    <span className="text-brand-primary font-semibold">
                      No fillers. No old stock. Just flavor.
                    </span>
                  </p>
                </div>

                {/* Advanced Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-10">
                  <aside className="hidden md:block sticky top-24 h-fit z-10">
                    <React.Suspense
                      fallback={<div className="h-[450px] bg-gray-100 rounded-xl animate-pulse" />}
                    >
                      <AdvancedFilters
                        showOnSale={showOnSale}
                        onToggleOnSale={() => setShowOnSale(!showOnSale)}
                        showInStock={showInStock}
                        onToggleInStock={() => setShowInStock(!showInStock)}
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        onToggleTag={handleToggleTag}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        onPriceChange={(max) => setPriceRange((prev) => ({ ...prev, max }))}
                        origins={availableOrigins}
                        selectedOrigins={selectedOrigins}
                        onToggleOrigin={handleToggleOrigin}
                        heatLevels={availableHeatLevels}
                        selectedHeatLevels={selectedHeatLevels}
                        onToggleHeatLevel={handleToggleHeatLevel}
                        cuisines={availableCuisines}
                        selectedCuisines={selectedCuisines}
                        onToggleCuisine={handleToggleCuisine}
                        sizes={availableSizes}
                        selectedSizes={selectedSizes}
                        onToggleSize={handleToggleSize}
                        grinds={availableGrinds}
                        selectedGrinds={selectedGrinds}
                        onToggleGrind={handleToggleGrind}
                        grades={availableGrades}
                        selectedGrades={selectedGrades}
                        onToggleGrade={handleToggleGrade}
                      />
                    </React.Suspense>
                  </aside>

                  <div>
                    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-gray-600 font-medium">
                        Showing {finalFilteredProducts.length} results
                      </p>
                      <SortDropdown
                        currentSort={sortOrder}
                        onSortChange={(val) => setSortOrder(val as typeof sortOrder)}
                      />
                    </div>
                    <ProductGrid
                      products={finalFilteredProducts}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      wishlistedIds={wishlistedIds}
                      onSelectProduct={setSelectedProduct}
                      onToggleCompare={handleToggleCompare}
                      comparisonIds={comparisonIds}
                      isLoading={productsLoading}
                      onNotifyMe={handleNotifyMe}
                      onClearFilters={handleClearFilters}
                    />
                    <div className="text-center mt-12">
                      <button
                        onClick={() => (window.location.hash = '#/offers')}
                        className="text-brand-secondary font-bold hover:text-brand-dark underline decoration-2 underline-offset-4 transition-colors"
                      >
                        View All Offers &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Story (Founder Narrative) */}
            <div id="our-story">
              <React.Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
                <BrandStory />
              </React.Suspense>
            </div>

            {/* Testimonials */}
            <React.Suspense fallback={<div className="h-64 bg-gray-50" />}>
              <Testimonials testimonials={MOCK_TESTIMONIALS} />
            </React.Suspense>

            {/* Quiz Module */}
            <section data-testid="quiz-section" className="bg-brand-secondary/5 py-20 mt-0">
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
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
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
          onSelectCategory={handleSelectCategoryAndClose}
        />

        {renderView()}

        <Footer onSelectCategory={handleSelectCategoryAndClose} />

        <ToastContainer
          toasts={toasts}
          onClose={(id) => setToasts((t) => t.filter((toast) => toast.id !== id))}
        />

        {/* Modals */}
        <React.Suspense fallback={null}>
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              allProducts={products}
              recipes={MOCK_RECIPES}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isInWishlist(selectedProduct.id)}
              isOpen={true}
              onAddReview={handleAddReview}
              onDeleteReview={handleDeleteReview}
              onSelectCategoryAndClose={handleSelectCategoryAndClose}
              addToast={addToast}
              onAskQuestion={handleAskQuestion}
              onSelectProduct={setSelectedProduct}
              onNotifyMe={handleNotifyMe}
            />
          )}

          <SideModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Cart">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={(pId, vId) => updateQuantity(pId, vId, 0)}
              onCheckout={() => {
                setIsCartOpen(false);
                window.location.hash = '#/checkout';
              }}
              subtotal={subtotal}
              onClose={() => setIsCartOpen(false)}
              isLoggedIn={isLoggedIn}
              promoCode={promoCode}
              onPromoCodeChange={setPromoCode}
              onApplyPromoCode={handleApplyPromoCode}
              discount={discount}
              shippingCost={shippingCost}
              onAddToCart={handleAddToCart}
              recommendedProducts={products.slice(0, 5)}
            />
          </SideModal>

          <SideModal
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            title="Your Wishlist"
          >
            <Wishlist
              items={wishlistItems}
              onRemove={(id) => toggleWishlist(products.find((p) => p.id === id)!)}
              onAddToCart={(p) => {
                handleAddToCart(p, p.variants[0]);
                toggleWishlist(p);
              }}
              onToggleWishlist={handleToggleWishlist}
              onClose={() => setIsWishlistOpen(false)}
            />
          </SideModal>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            categories={categories}
            onSelectCategory={handleSelectCategoryAndClose}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => {
              setIsMobileMenuOpen(false);
              setAuthModalOpen(true);
            }}
            onLogoutClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {isAuthModalOpen && (
            <AuthModal
              onClose={() => setAuthModalOpen(false)}
              onLogin={handleLogin}
              onSignUp={handleSignUp}
            />
          )}

          {comparisonItems.length > 0 && (
            <ComparisonBar
              items={comparisonItems}
              onRemove={(product) =>
                setComparisonItems((prev) => prev.filter((p) => p.id !== product.id))
              }
              onCompare={() => setIsComparisonModalOpen(true)}
              onClear={() => setComparisonItems([])}
            />
          )}

          {isComparisonModalOpen && (
            <ComparisonModal
              items={comparisonItems}
              onClose={() => setIsComparisonModalOpen(false)}
              onAddToCart={handleAddToCart}
            />
          )}

          {isExitIntentModalOpen && (
            <ExitIntentModal
              onClose={() => setIsExitIntentModalOpen(false)}
              onApplyPromo={() => {
                handleApplyPromoCode('COMEBACK15');
                setIsExitIntentModalOpen(false);
              }}
            />
          )}

          {selectedRecipe && (
            <RecipeDetailModal
              recipe={selectedRecipe}
              allProducts={products}
              onClose={() => setSelectedRecipe(null)}
              onAddToCart={(product) => handleAddToCart(product, product.variants[0], 1)}
              onSelectProduct={setSelectedProduct}
              onNotifyMe={(product) => handleNotifyMe(product.id)}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={(id) => wishlistItems.some((p) => p.id === id)}
              onToggleCompare={handleToggleCompare}
              isCompared={(id) => comparisonItems.some((p) => p.id === id)}
            />
          )}

          <SocialProofNotifications />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <MobileBottomNav
            cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            wishlistItemCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenMenu={() => setIsMobileMenuOpen(true)}
            currentView={currentView}
          />
        </React.Suspense>
      </div>
    </HelmetProvider>
  );
};

export default App;
