import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
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

import { getBundleSuggestions } from './utils/recommendations';

// Performance Utils
import { usePerformanceMonitoring } from './utils/performance';
// Framer Motion Optimization
import { LazyMotion, domAnimation } from 'framer-motion';

// SEO Utils
import SEO from './components/SEO';
import { pageSEO, generateOrganizationSchema } from './utils/seo';

// A/B Testing Provider
import { ABTestProvider } from './src/context/ABTestContext';

// Custom Hooks
import { useCartStore } from './store/cartStore';
import { useWishlist } from './hooks/useWishlist';
import { useProductFilter } from './hooks/useProductFilter';
import { useProducts } from './hooks/useProducts';
import { useUserOrders } from './hooks/useUserOrders';
import { useIsMobile } from './hooks/useIsMobile';

// Mock Data
import { MOCK_POSTS, MOCK_RECIPES } from './data';

// Core Components (Eagerly Loaded - Always Visible)
// Core Components (Eagerly Loaded - Always Visible)
import Header from './components/Header';
import { ToastContainer } from './components/ui/ToastContainer';
import FreeShippingBanner from './components/FreeShippingBanner';

// Lazy-Loaded Components (Load on Demand)
const Footer = React.lazy(() => import('./components/Footer'));
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

const RecipeDetailModal = React.lazy(() => import('./components/RecipeDetailModal'));
const NewsletterPopup = React.lazy(() => import('./components/NewsletterPopup'));
const WhatsAppButton = React.lazy(() => import('./components/WhatsAppButton'));
const BackToTop = React.lazy(() => import('./components/BackToTop'));

const MobileBottomNav = React.lazy(() => import('./components/MobileBottomNav'));

const MessagingShowcase = React.lazy(() => import('./components/MessagingShowcase'));

// Lazy-Loaded Pages (Route-Based Code Splitting)
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));

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
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/SignUpPage'));

// Account Components
const AccountLayout = React.lazy(() => import('./components/layouts/AccountLayout'));
const AccountOverview = React.lazy(() => import('./components/account/AccountOverview'));
const OrdersList = React.lazy(() => import('./components/account/OrdersList'));
const AddressBook = React.lazy(() => import('./components/account/AddressBook'));
const AccountWishlist = React.lazy(() => import('./components/account/AccountWishlist'));
const LoyaltyPointsTracker = React.lazy(() => import('./components/LoyaltyPointsTracker'));
const ForgotPasswordPage = React.lazy(() => import('./components/ForgotPasswordPage'));
const EmailVerificationPage = React.lazy(() => import('./components/EmailVerificationPage'));

const TwoFactorSetupPage = React.lazy(() => import('./components/TwoFactorSetupPage'));
const OrderTrackingPage = React.lazy(() => import('./pages/OrderTrackingPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const ResponsiveHomePage = React.lazy(() => import('./pages/ResponsiveHomePage'));
const ResponsiveCategoryPage = React.lazy(() => import('./pages/ResponsiveCategoryPage'));
const OffersPage = React.lazy(() => import('./pages/OffersPage'));
const SubscriptionPage = React.lazy(() => import('./pages/SubscriptionPage'));
const FarmersPage = React.lazy(() => import('./pages/FarmersPage'));
const ResponsiveCartPage = React.lazy(() => import('./pages/ResponsiveCartPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const OrderConfirmationRoute = ({
  currentUser,
  handlePlaceOrder,
  addToast,
}: {
  currentUser: User | null;
  handlePlaceOrder: (order: Order) => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
}) => {
  const { orderId } = useParams();
  const { orders } = useUserOrders();
  const order = orders.find((o: Order) => o.id === orderId);
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
};

const BlogPostRoute = () => {
  const { slug } = useParams();
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
};

const App: React.FC = () => {
  // Enable performance monitoring
  usePerformanceMonitoring();

  const navigate = useNavigate();
  const location = useLocation();

  // Register Service Worker (PWA) - Only in production
  useEffect(() => {
    // Skip service worker registration in development mode
    if (import.meta.env.DEV) {
      return;
    }

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
  // Derived from location.pathname
  const currentView = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'home';
    const cleanPath = path.substring(1);
    // Handle nested routes mapping to view names if needed
    if (cleanPath.startsWith('blog/')) return 'blog';
    if (cleanPath.startsWith('order-confirmation')) return cleanPath;
    return cleanPath;
  }, [location.pathname]);

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  // const [orders, setOrders] = useState<Order[]>([]); // Removed, using useUserOrders
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Feature Specific State

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Custom hooks
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const addToCart = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const { wishlistItems, wishlistItemCount, toggleWishlist, isInWishlist } = useWishlist();

  const {
    products,
    isLoading: productsLoading,

    addReview,
    addQuestion,
  } = useProducts({ useMockData: true });

  const { orders } = useUserOrders();
  const queryClient = useQueryClient();
  // --- Order Fetching ---
  // Moved to useUserOrders hook
  /*
  useEffect(() => {
    const fetchOrders = async () => {
      // ...
    };
    fetchOrders();
  }, [currentUser]);
  */

  // --- Computed Values & Effects ---

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Automatically enable "On Sale" filter when on Offers page
  useEffect(() => {
    if (location.pathname === '/offers') {
      setShowOnSale(true);
    }
  }, [location.pathname]);

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

  // Handle 'offers' route
  useEffect(() => {
    if (location.pathname === '/offers') {
      setShowOnSale(true);
    } else if (location.pathname === '/') {
      setShowOnSale(false);
    }
  }, [location.pathname]);

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

  // Smart Cart Recommendations
  const cartRecommendations = useMemo(() => {
    if (cartItems.length === 0) {
      // If cart is empty, show general popular items (first 5 for now)
      return products.slice(0, 5);
    }

    // Get recommendations based on the last item added to cart
    const lastItem = cartItems[cartItems.length - 1];
    const productId = parseInt(lastItem.id.split('-')[0], 10);
    const lastProduct = products.find((p) => p.id === productId);

    if (!lastProduct) return products.slice(0, 5);

    return getBundleSuggestions(lastProduct, products);
  }, [cartItems, products]);

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
      addToCart({
        id: `${product.id}-${variant.name}`, // Use composite ID matching ProductDetailPage logic
        name: product.name,
        price: variant.salePrice || variant.price,
        quantity,
        weight: variant.name,
        image: product.images[0],
        stock: variant.stock, // Add stock property
      });
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
    navigate('/');
  }, [addToast, navigate]);

  const handleSelectCategoryAndClose = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);

      if (category === 'All') {
        navigate('/shop');
      } else {
        navigate(`/category/${encodeURIComponent(category)}`);
      }
    },
    [navigate]
  );

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
    (id: string, quantity: number) => {
      updateQuantity(id, quantity);
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
    (user: User) => {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setAuthModalOpen(false);

      navigate('/');
      addToast(`Welcome back, ${user.name || user.email}!`, 'success');

      // We don't have access to the raw password here to "remember" logic in a simple way
      // without persisting the token, which AuthService handles.
      // Ideally, AuthService should handle the "remember me" persistence.
    },
    [addToast, navigate]
  );

  // Supabase Auth Listener
  // Supabase Auth Listener (Lazy Loaded & Delayed)
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    // Delay auth initialization to prioritize LCP and main thread for initial render
    const timer = setTimeout(() => {
      const initializeAuth = async () => {
        const { supabase } = await import('./supabaseClient');
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

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
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
            if (location.hash.includes('access_token')) {
              // Supabase auth redirect handling if using hash
              navigate('/');
            }
          } else if (event === 'SIGNED_OUT' || !session) {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        });
        subscription = data.subscription;
      };

      initializeAuth();
    }, 2000); // 2 second delay to clear TBT

    return () => {
      clearTimeout(timer);
      if (subscription) subscription.unsubscribe();
    };
  }, [addToast, location.hash, navigate]);

  const handleSignUp = useCallback(
    async (name: string, _email: string, _password: string) => {
      navigate('/');
      addToast(`Welcome, ${name}!`, 'success');
    },
    [addToast, navigate]
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
      // Invalidate orders query to fetch new order
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearCart();
      setDiscount(0);
      setPromoCode('');

      // Loyalty Points Logic (Mock)
      const currentPoints = parseInt(localStorage.getItem('loyaltyPoints') || '0', 10);
      const pointsEarned = Math.floor(order.total); // 1 point per currency unit
      localStorage.setItem('loyaltyPoints', (currentPoints + pointsEarned).toString());
    },
    [clearCart, queryClient]
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

  // Use empty strings to avoid overriding page titles, purely for Schema injection
  const orgSchema = generateOrganizationSchema();
  const GlobalSEO = <SEO title="" description="" structuredData={orgSchema} />;

  // Check if mobile for hiding desktop layout on mobile pages
  // Use 1024px breakpoint to include tablets in mobile view
  const isMobile = useIsMobile(1024);
  const isMobileLayoutPage =
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/category');

  return (
    <HelmetProvider>
      <ABTestProvider>
        <LazyMotion features={domAnimation}>
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
              structuredDataId="organization-schema"
            />

            {/* Hide desktop header on mobile pages */}
            {!(isMobile && isMobileLayoutPage) && <FreeShippingBanner />}

            {!(isMobile && isMobileLayoutPage) && (
              <Header
                cartItems={cartItems}
                wishlistItemCount={wishlistItemCount}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCartClick={() => setIsCartOpen(true)}
                onWishlistClick={() => setIsWishlistOpen(true)}
                onMobileMenuClick={() => setIsMobileMenuOpen((prev) => !prev)}
                isLoggedIn={isLoggedIn}
                isAdmin={!!currentUser?.isAdmin}
                onLoginClick={() => setAuthModalOpen(true)}
                onLogoutClick={handleLogout}
                allProducts={products}
                onSelectProduct={setSelectedProduct}
                categories={categories}
                onSelectCategory={handleSelectCategoryAndClose}
                onRemoveItem={removeFromCart}
              />
            )}

            <Routes>
              <Route
                path="/product/:id"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProductDetailPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/category/:category"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ResponsiveCategoryPage
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      onCartClick={() => setIsCartOpen(true)}
                      onMenuClick={() => setIsMobileMenuOpen(true)}
                      addToast={addToast}
                      setSelectedProduct={setSelectedProduct}
                    />
                  </React.Suspense>
                }
              />
              <Route
                path="/subscription"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <SubscriptionPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/farmers"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <FarmersPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/shop"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ResponsiveCategoryPage
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      onCartClick={() => (isMobile ? navigate('/cart') : setIsCartOpen(true))}
                      onMenuClick={() => setIsMobileMenuOpen(true)}
                      addToast={addToast}
                      setSelectedProduct={setSelectedProduct}
                    />
                  </React.Suspense>
                }
              />
              <Route
                path="/"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    {GlobalSEO}
                    <ResponsiveHomePage
                      products={products}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={(cat) => {
                        handleSelectCategoryAndClose(cat);
                        if (cat === 'Offers') navigate('/offers');
                      }}
                      searchQuery={searchQuery}
                      selectedTags={selectedTags}
                      finalFilteredProducts={finalFilteredProducts}
                      productsLoading={productsLoading}
                      wishlistedIds={wishlistedIds}
                      comparisonIds={comparisonIds}
                      handleAddToCart={handleAddToCart}
                      handleToggleWishlist={handleToggleWishlist}
                      setSelectedProduct={setSelectedProduct}
                      handleNotifyMe={handleNotifyMe}
                      handleToggleCompare={handleToggleCompare}
                      handleClearFilters={handleClearFilters}
                      setIsFilterOpen={setIsFilterOpen}
                      setSortOrder={setSortOrder}
                      sortOrder={sortOrder}
                      showOnSale={showOnSale}
                      setShowOnSale={setShowOnSale}
                      showInStock={showInStock}
                      setShowInStock={setShowInStock}
                      availableTags={availableTags}
                      selectedTagsState={selectedTags}
                      handleToggleTag={handleToggleTag}
                      priceRange={priceRange}
                      setPriceRange={(range) => setPriceRange((prev) => ({ ...prev, ...range }))}
                      maxPrice={maxPrice}
                      selectedOrigins={selectedOrigins}
                      handleToggleOrigin={handleToggleOrigin}
                      availableOrigins={availableOrigins}
                      selectedHeatLevels={selectedHeatLevels}
                      handleToggleHeatLevel={handleToggleHeatLevel}
                      availableHeatLevels={availableHeatLevels}
                      selectedCuisines={selectedCuisines}
                      handleToggleCuisine={handleToggleCuisine}
                      availableCuisines={availableCuisines}
                      selectedSizes={selectedSizes}
                      handleToggleSize={handleToggleSize}
                      availableSizes={availableSizes}
                      selectedGrinds={selectedGrinds}
                      handleToggleGrind={handleToggleGrind}
                      availableGrinds={availableGrinds}
                      selectedGrades={selectedGrades}
                      handleToggleGrade={handleToggleGrade}
                      availableGrades={availableGrades}
                      addToast={addToast}
                      cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      onMenuClick={() => setIsMobileMenuOpen(true)}
                      onCartClick={() => (isMobile ? navigate('/cart') : setIsCartOpen(true))}
                      onSearchChange={setSearchQuery}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/messaging"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    {GlobalSEO}
                    <MessagingShowcase />
                  </React.Suspense>
                }
              />

              <Route
                path="/checkout"
                element={
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
                }
              />

              <Route
                path="/account"
                element={
                  currentUser ? (
                    <React.Suspense fallback={<PageLoader />}>
                      <AccountLayout user={currentUser} />
                    </React.Suspense>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              >
                <Route
                  index
                  element={
                    <React.Suspense fallback={<PageLoader />}>
                      <AccountOverview
                        user={currentUser!}
                        onUpdateUser={(updatedUser) =>
                          setCurrentUser((prev) => ({ ...prev!, ...updatedUser }))
                        }
                      />
                    </React.Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <React.Suspense fallback={<PageLoader />}>
                      <OrdersList />
                    </React.Suspense>
                  }
                />
                <Route
                  path="addresses"
                  element={
                    <React.Suspense fallback={<PageLoader />}>
                      <AddressBook />
                    </React.Suspense>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <React.Suspense fallback={<PageLoader />}>
                      <AccountWishlist />
                    </React.Suspense>
                  }
                />
                <Route
                  path="loyalty"
                  element={
                    <React.Suspense fallback={<PageLoader />}>
                      <LoyaltyPointsTracker />
                    </React.Suspense>
                  }
                />
              </Route>

              <Route path="/profile" element={<Navigate to="/account" replace />} />

              <Route
                path="/admin"
                element={
                  currentUser?.isAdmin ? (
                    <React.Suspense fallback={<PageLoader />}>
                      <AdminDashboard />
                    </React.Suspense>
                  ) : (
                    <div className="text-center py-20">
                      <h2>Access Denied.</h2>
                    </div>
                  )
                }
              />

              <Route
                path="/privacy-policy"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <PrivacyPolicyPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/refund-policy"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <RefundPolicyPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/terms-of-service"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <TermsOfServicePage />
                  </React.Suspense>
                }
              />
              <Route
                path="/about"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <AboutPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/faqs"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <FAQsPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ContactPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/recipes"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <RecipesPage recipes={MOCK_RECIPES} onSelectRecipe={setSelectedRecipe} />
                  </React.Suspense>
                }
              />

              <Route
                path="/blog"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <BlogPage
                      posts={MOCK_POSTS}
                      onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/login"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <LoginPage
                      onLogin={handleLogin}
                      onNavigateToSignup={() => navigate('/signup')}
                      onNavigateToForgotPassword={() => navigate('/forgot-password')}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/signup"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <SignUpPage
                      onSignUp={handleSignUp}
                      onNavigateToLogin={() => navigate('/login')}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ForgotPasswordPage onNavigateToLogin={() => navigate('/login')} />
                  </React.Suspense>
                }
              />

              <Route
                path="/verify-email"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <EmailVerificationPage
                      email={
                        new URLSearchParams(location.hash.split('?')[1] || location.search).get(
                          'email'
                        ) ||
                        currentUser?.email ||
                        ''
                      }
                      onNavigateToHome={() => navigate('/')}
                      onResendEmail={() => addToast('Verification email sent!', 'success')}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/cart"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ResponsiveCartPage />
                  </React.Suspense>
                }
              />
              <Route
                path="/track-order"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <OrderTrackingPage />
                  </React.Suspense>
                }
              />

              <Route
                path="/2fa-setup"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <TwoFactorSetupPage
                      onComplete={() => {
                        addToast('2FA enabled successfully!', 'success');
                        navigate('/profile');
                      }}
                      onCancel={() => navigate('/profile')}
                    />
                  </React.Suspense>
                }
              />

              <Route
                path="/offers"
                element={
                  <React.Suspense fallback={<PageLoader />}>
                    <OffersPage />
                  </React.Suspense>
                }
              />

              <Route
                path="/order-confirmation/:orderId"
                element={
                  <OrderConfirmationRoute
                    currentUser={currentUser}
                    handlePlaceOrder={handlePlaceOrder}
                    addToast={addToast}
                  />
                }
              />
              <Route path="/blog/:slug" element={<BlogPostRoute />} />
              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Hide Footer on mobile pages */}
            {!(isMobile && isMobileLayoutPage) && (
              <React.Suspense fallback={<div className="h-64 bg-gray-100" />}>
                <Footer onSelectCategory={handleSelectCategoryAndClose} />
              </React.Suspense>
            )}

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
                  onCheckout={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
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
                  recommendedProducts={cartRecommendations}
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

              <SideModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Filters"
              >
                <div className="p-4 pb-24 h-full overflow-y-auto">
                  <React.Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
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
                    {/* Clear Filters Button Mobile */}
                    <div className="mt-8 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleClearFilters();
                          setIsFilterOpen(false);
                        }}
                        className="w-full py-3 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        Clear All Filters
                      </button>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full py-3 mt-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-primary/90 transition-colors"
                      >
                        Show {finalFilteredProducts.length} Results
                      </button>
                    </div>
                  </React.Suspense>
                </div>
              </SideModal>

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

              {/* Newsletter Popup - Shows after scroll or delay */}
              <NewsletterPopup delayMs={8000} />
            </React.Suspense>
            {isMobile && (
              <React.Suspense fallback={null}>
                <MobileBottomNav
                  cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  wishlistItemCount={wishlistItems.length}
                  onOpenCart={() => navigate('/cart')}
                  onOpenWishlist={() => setIsWishlistOpen(true)}
                  onOpenMenu={() => setIsMobileMenuOpen((prev) => !prev)}
                  currentView={currentView}
                />
              </React.Suspense>
            )}

            {/* Global UI Elements */}
            <React.Suspense fallback={null}>
              <WhatsAppButton phoneNumber="919876543210" />
              <BackToTop />
            </React.Suspense>
          </div>
        </LazyMotion>
      </ABTestProvider>
    </HelmetProvider>
  );
};

export default App;
