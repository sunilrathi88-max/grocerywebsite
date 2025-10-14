import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, ToastMessage, Review, Variant, User, Order, OrderStatus, QnA as QnAType, BlogPost } from './types';
import { Recipe } from './components/RecipesPage';

// Mock Data
import { MOCK_PRODUCTS, MOCK_USER, MOCK_ORDERS, MOCK_TESTIMONIALS, MOCK_ANALYTICS, MOCK_POSTS } from './data';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import ProductDetailModal from './components/ProductDetailModal';
import SideModal from './components/SideModal';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ToastContainer from './components/ToastContainer';
import MobileMenu from './components/MobileMenu';
import PromotionalBanner from './components/PromotionalBanner';
import SortDropdown from './components/SortDropdown';
import AdvancedFilters from './components/AdvancedFilters';
import AuthModal from './components/AuthModal';
import CheckoutPage from './components/CheckoutPage';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import AboutPage from './components/AboutPage';
import FAQsPage from './components/FAQsPage';
import ContactPage from './components/ContactPage';
import ComparisonBar from './components/ComparisonBar';
import ComparisonModal from './components/ComparisonModal';
import ExitIntentModal from './components/ExitIntentModal';
import RecipesPage from './components/RecipesPage';
import RecipeDetailModal from './components/RecipeDetailModal';
import QuizModule from './components/QuizModule';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';

const App: React.FC = () => {
    // State management
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
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
    const maxPrice = useMemo(() => Math.ceil(Math.max(...MOCK_PRODUCTS.flatMap(p => p.variants.map(v => v.price)))), []);
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
    const categories = useMemo(() => ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))], []);
    const availableTags = useMemo(() => Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.tags || []))), []);
    const wishlistedIds = useMemo(() => new Set(wishlistItems.map(p => p.id)), [wishlistItems]);
    const comparisonIds = useMemo(() => new Set(comparisonItems.map(p => p.id)), [comparisonItems]);
    
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.selectedVariant.salePrice ?? item.selectedVariant.price) * item.quantity, 0), [cartItems]);
    const shippingCost = useMemo(() => (subtotal > 50 || subtotal === 0) ? 0 : 10, [subtotal]);

    // Handlers
    const addToast = useCallback((message: string, type: ToastMessage['type'], icon?: React.ReactNode) => {
        const newToast = { id: Date.now(), message, type, icon };
        setToasts(currentToasts => [...currentToasts, newToast]);
    }, []);

    const handleAddToCart = useCallback((product: Product, variant: Variant, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id && item.selectedVariant.id === variant.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id && item.selectedVariant.id === variant.id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
                        : item
                );
            }
            return [...prevItems, { product, selectedVariant: variant, quantity }];
        });
        addToast(`${product.name} added to cart!`, 'success');
    }, [addToast]);

    const handleUpdateQuantity = useCallback((productId: number, variantId: number, quantity: number) => {
        if (quantity <= 0) {
            setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedVariant.id === variantId)));
        } else {
            setCartItems(prev => prev.map(item =>
                item.product.id === productId && item.selectedVariant.id === variantId
                    ? { ...item, quantity: Math.min(quantity, item.selectedVariant.stock) }
                    : item
            ));
        }
    }, []);

    const handleToggleWishlist = useCallback((product: Product) => {
        setWishlistItems(prev => {
            const isWishlisted = prev.some(item => item.id === product.id);
            if (isWishlisted) {
                addToast(`${product.name} removed from wishlist.`, 'info');
                return prev.filter(item => item.id !== product.id);
            } else {
                addToast(`${product.name} added to wishlist!`, 'success');
                return [...prev, product];
            }
        });
    }, [addToast]);
    
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

    const handleAddReview = useCallback((productId: number, review: Omit<Review, 'id'>) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newReview = { ...review, id: Date.now(), verifiedPurchase: isLoggedIn };
                return { ...p, reviews: [newReview, ...p.reviews] };
            }
            return p;
        }));
        addToast('Thank you for your review!', 'success');
    }, [isLoggedIn, addToast]);
    
    const handleDeleteReview = useCallback((productId: number, reviewId: number) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return { ...p, reviews: p.reviews.filter(r => r.id !== reviewId) };
            }
            return p;
        }));
    }, []);

    const handleAskQuestion = useCallback((productId: number, question: { author: string; question: string }) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newQnA: QnAType = { ...question, id: Date.now() };
                return { ...p, qna: [...(p.qna || []), newQnA] };
            }
            return p;
        }));
        addToast('Your question has been submitted.', 'success');
    }, [addToast]);

    const handleNotifyMe = useCallback((productName: string) => {
      addToast(`We'll notify you when ${productName} is back in stock!`, 'success');
      setSelectedProduct(null);
    }, [addToast]);

    const handleApplyPromoCode = useCallback((code: string) => {
        if (code.toUpperCase() === 'TATTVA10') {
            setDiscount(subtotal * 0.10);
            setPromoCode(code);
            addToast('Promo code applied!', 'success');
        } else if (code.toUpperCase() === 'COMEBACK15' || code.toUpperCase() === 'QUIZMASTER15') {
            setDiscount(subtotal * 0.15);
            setPromoCode(code);
            addToast('Promo code applied!', 'success');
        } else if (code.toUpperCase() === 'SPICEFAN10') {
            setDiscount(subtotal * 0.10);
            setPromoCode(code);
            addToast('Promo code applied!', 'success');
        } else {
            addToast('Invalid promo code.', 'error');
        }
    }, [subtotal, addToast]);

    const handleRemovePromoCode = useCallback(() => {
        setDiscount(0);
        setPromoCode('');
    }, []);

    const handlePlaceOrder = useCallback((orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
        const newOrder: Order = {
            ...orderData,
            id: `TC${1003 + orders.length}-${new Date().getFullYear()}`,
            date: new Date().toISOString(),
            status: 'Processing',
        };
        setOrders(prev => [newOrder, ...prev]);
        setCartItems([]);
        setDiscount(0);
        setPromoCode('');
        setCurrentView('home'); // Prevent staying on checkout page
        window.location.hash = `#/order-confirmation/${newOrder.id}`;
        return newOrder;
    }, [orders.length]);
    
    // Admin handlers
    const handleSaveProduct = useCallback((product: Product) => {
        setProducts(prev => {
            if (product.id === 0) { // New product
                const newProduct = { ...product, id: Date.now() };
                return [newProduct, ...prev];
            } else { // Existing product
                return prev.map(p => p.id === product.id ? product : p);
            }
        });
        addToast(`Product "${product.name}" saved successfully!`, 'success');
    }, [addToast]);

    const handleDeleteProduct = useCallback((productId: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(prev => prev.filter(p => p.id !== productId));
            addToast('Product deleted.', 'info');
        }
    }, [addToast]);

    const handleUpdateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }, []);

    // Comparison handlers
    const handleToggleCompare = useCallback((product: Product) => {
        setComparisonItems(prev => {
            const isCompared = prev.some(item => item.id === product.id);
            if (isCompared) {
                return prev.filter(item => item.id !== product.id);
            } else if (prev.length < 4) {
                return [...prev, product];
            } else {
                addToast('You can only compare up to 4 products.', 'info');
                return prev;
            }
        });
    }, [addToast]);


    // Filtering and sorting logic
    const filteredAndSortedProducts = useMemo(() => {
        let result = MOCK_PRODUCTS;

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (showOnSale) {
            result = result.filter(p => p.variants.some(v => v.salePrice && v.salePrice < v.price));
        }

        if (showInStock) {
            result = result.filter(p => p.variants.some(v => v.stock > 0));
        }
        
        if (selectedTags.length > 0) {
            result = result.filter(p => selectedTags.every(tag => p.tags?.includes(tag)));
        }
        
        result = result.filter(p => (p.variants[0].salePrice ?? p.variants[0].price) <= priceRange.max);

        switch (sortOrder) {
            case 'price-asc':
                result.sort((a, b) => (a.variants[0].salePrice ?? a.variants[0].price) - (b.variants[0].salePrice ?? b.variants[0].price));
                break;
            case 'price-desc':
                result.sort((a, b) => (b.variants[0].salePrice ?? b.variants[0].price) - (a.variants[0].salePrice ?? a.variants[0].price));
                break;
            case 'rating-desc':
                result.sort((a, b) => {
                    const ratingA = a.reviews.length ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
                    const ratingB = b.reviews.length ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
                    return ratingB - ratingA;
                });
                break;
            default: // featured
                break;
        }

        return result;
    }, [searchQuery, selectedCategory, sortOrder, showOnSale, showInStock, selectedTags, priceRange]);


    const renderView = () => {
        if (currentView.startsWith('order-confirmation')) {
          const orderId = currentView.split('/')[1];
          const order = orders.find(o => o.id === orderId);
          // This is a trick to show the confirmation page by re-using the CheckoutPage component structure
          return order ? <CheckoutPage cartItems={[]} user={currentUser} onPlaceOrder={handlePlaceOrder} addToast={addToast} discount={0} promoCode="" onApplyPromoCode={()=>{}} onRemovePromoCode={()=>{}} subtotal={0} shippingCost={0} /> : <div className="text-center py-20"><h2>Order not found</h2></div>;
        }

        if (currentView.startsWith('blog/')) {
            const slug = currentView.split('/')[1];
            const post = posts.find(p => p.slug === slug);
            return post ? <BlogPostPage post={post} /> : <div className="text-center py-20"><h2>Post not found</h2></div>;
        }
        
        switch(currentView) {
            case 'checkout': return <CheckoutPage cartItems={cartItems} user={currentUser} onPlaceOrder={handlePlaceOrder} addToast={addToast} discount={discount} promoCode={promoCode} onApplyPromoCode={handleApplyPromoCode} onRemovePromoCode={handleRemovePromoCode} subtotal={subtotal} shippingCost={shippingCost} />;
            case 'profile': return currentUser ? <UserProfile user={currentUser} orders={orders} /> : <div className="text-center py-20"><h2>Please log in to view your profile.</h2></div>;
            case 'admin': return currentUser?.isAdmin ? <AdminDashboard products={products} orders={orders} analytics={MOCK_ANALYTICS} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrderStatus={handleUpdateOrderStatus} /> : <div className="text-center py-20"><h2>Access Denied.</h2></div>;
            case 'privacy-policy': return <PrivacyPolicyPage />;
            case 'refund-policy': return <RefundPolicyPage />;
            case 'terms-of-service': return <TermsOfServicePage />;
            case 'about': return <AboutPage />;
            case 'faqs': return <FAQsPage />;
            case 'contact': return <ContactPage />;
            case 'recipes': return <RecipesPage onSelectRecipe={setSelectedRecipe} />;
            case 'blog': return <BlogPage posts={posts} onSelectPost={(slug) => window.location.hash = `#/blog/${slug}`} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero />
                        <main id="products-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                               <AdvancedFilters 
                                  showOnSale={showOnSale}
                                  onToggleOnSale={() => setShowOnSale(v => !v)}
                                  showInStock={showInStock}
                                  onToggleInStock={() => setShowInStock(v => !v)}
                                  availableTags={availableTags}
                                  selectedTags={selectedTags}
                                  onToggleTag={(tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                  priceRange={priceRange}
                                  maxPrice={maxPrice}
                                  onPriceChange={(val) => setPriceRange(prev => ({ ...prev, max: val}))}
                               />
                                <SortDropdown currentSort={sortOrder} onSortChange={setSortOrder} />
                            </div>
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
                        <Testimonials testimonials={MOCK_TESTIMONIALS} />
                        <section className="bg-brand-secondary/30 py-16">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <QuizModule addToast={addToast} />
                            </div>
                        </section>
                    </>
                );
        }
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            {showPromoBanner && <PromotionalBanner onClose={() => setShowPromoBanner(false)} />}
            <Header
                cartItems={cartItems}
                wishlistItemCount={wishlistItems.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCartClick={() => setIsCartOpen(true)}
                onWishlistClick={() => setIsWishlistOpen(true)}
                onMobileMenuClick={() => setIsMobileMenuOpen(true)}
                isLoggedIn={isLoggedIn}
                isAdmin={!!currentUser?.isAdmin}
                onLoginClick={() => setAuthModalOpen(true)}
                onLogoutClick={handleLogout}
                allProducts={MOCK_PRODUCTS}
                onSelectProduct={setSelectedProduct}
                subtotal={subtotal}
                categories={categories}
                onSelectCategory={setSelectedCategory}
            />
            <div className={`pt-20 flex-grow ${comparisonItems.length > 0 ? 'pb-24' : ''}`}>
                {renderView()}
            </div>
            <Footer onSelectCategory={setSelectedCategory} />

            {/* Modals & Overlays */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    allProducts={MOCK_PRODUCTS}
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
            )}
            
            {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}

            <SideModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Shopping Cart">
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
            
            <SideModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} title="Your Wishlist">
                <Wishlist items={wishlistItems} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} onClose={() => setIsWishlistOpen(false)} />
            </SideModal>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <ToastContainer toasts={toasts} onClose={(id) => setToasts(current => current.filter(t => t.id !== id))} />

            {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />}

            <ComparisonBar 
                items={comparisonItems}
                onRemove={(p) => setComparisonItems(prev => prev.filter(item => item.id !== p.id))}
                onClear={() => setComparisonItems([])}
                onCompare={() => setIsComparisonModalOpen(true)}
            />

            {isComparisonModalOpen && <ComparisonModal items={comparisonItems} onClose={() => setIsComparisonModalOpen(false)} />}
            
            {isExitIntentModalOpen && <ExitIntentModal onClose={() => setIsExitIntentModalOpen(false)} onApplyPromo={handleApplyPromoCode} />}
        </div>
    );
};

export default App;
