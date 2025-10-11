
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, Review, ToastMessage, Variant, User, Order, OrderStatus, Address, QnA } from './types';
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
import AuthModal from './components/AuthModal';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import ContactPage from './components/ContactPage';
import ProductSlider from './components/ProductSlider';
import ComparisonBar from './components/ComparisonBar';
import ExitIntentModal from './components/ExitIntentModal';
import RecipesPage, { Recipe } from './components/RecipesPage';
import ComparisonModal from './components/ComparisonModal';
import RecipeDetailModal from './components/RecipeDetailModal';
import QuizModule from './components/QuizModule';
import AboutPage from './components/AboutPage';
import FAQsPage from './components/FAQsPage';


const MOCK_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Himalayan Saffron', 
    description: 'Hand-picked from the pristine high-altitude valleys of Kashmir, our Himalayan Saffron boasts an intoxicating aroma and a deep, vibrant crimson color. Each delicate thread promises to infuse your culinary creations with an unparalleled, luxurious flavor and a golden hue. Perfect for biryanis, desserts, and saffron-infused teas.', 
    images: ['https://images.unsplash.com/photo-1599511438938-2303d5448f70?q=80&w=800&h=800&auto=format&fit=crop','https://images.unsplash.com/photo-1631140356882-756515758a18?q=80&w=800&h=800&auto=format&fit=crop','https://images.unsplash.com/photo-1599511438914-5f532a2223a3?q=80&w=800&h=800&auto=format&fit=crop'],
    videos: ['https://videos.pexels.com/video-files/6864539/6864539-hd.mp4'],
    category: 'Spices',
    variants: [ { id: 101, name: '1g', price: 15.99, stock: 10 }, { id: 102, name: '2g', price: 29.99, stock: 5 }, { id: 103, name: '5g', price: 69.99, salePrice: 64.99, stock: 3 } ],
    reviews: [
      { id: 1, author: 'Aisha R.', rating: 5, comment: "Absolutely the best saffron I've ever used. The aroma is intoxicating!", verifiedPurchase: true },
      { id: 2, author: 'Vikram B.', rating: 4, comment: "Great quality and color. A bit pricey, but worth it for special occasions." },
    ],
    qna: [ { id: 1, author: 'Rohan', question: 'Is this saffron pure Kashmiri?', answer: 'Yes, it is 100% pure Grade A Mongra saffron sourced directly from Pampore, Kashmir.' }, { id: 2, author: 'Priya', question: 'What is the best way to store it?', answer: 'Store it in a cool, dark place, away from direct sunlight. The airtight container it comes in is perfect.'}],
    origin: 'Kashmir, India', tags: ['Premium', 'Aromatic'], nutrition: [ { key: 'Calories', value: '310' }, { key: 'Manganese', value: '1.4mg' }, { key: 'Vitamin C', value: '1.2mg' } ]
  },
  { 
    id: 2, name: 'Malabar Black Pepper', description: 'Sourced directly from the lush, spice-laden hills of the Malabar Coast, these Tellicherry peppercorns are among the world\'s finest. They are left on the vine longer to develop a deep, rich flavor profile that is both pungent and complexly aromatic, with hints of citrus and pine. Grind fresh for a transformative kick to any dish.', 
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb4e3f?q=80&w=800&h=800&auto=format&fit=crop'], videos: ['https://videos.pexels.com/video-files/5589467/5589467-sd.mp4'],
    category: 'Spices', variants: [ { id: 201, name: '100g', price: 8.50, salePrice: 6.99, stock: 20 } ],
    reviews: [ { id: 3, author: 'Meera N.', rating: 5, comment: "Incredibly pungent and flavorful. You can really taste the difference.", verifiedPurchase: true }, ],
    origin: 'Kerala, India', tags: ['Tellicherry', 'Aromatic']
  },
  { id: 3, name: 'Assam Gold Tea', description: 'Full-bodied black tea with malty flavor.', images: ['https://images.unsplash.com/photo-1627891244343-03067ea81404?q=80&w=800&h=800&auto=format&fit=crop'], category: 'Beverages', variants: [ { id: 301, name: '250g', price: 12.00, stock: 4 } ], reviews: [], origin: 'Assam, India', tags: ['Organic', 'Single Origin'], nutrition: [ { key: 'Caffeine', value: 'High' }, { key: 'Antioxidants', value: 'Rich' } ] },
  { id: 4, name: 'Organic Turmeric Powder', description: 'Vibrant and earthy turmeric with high curcumin content.', images: ['https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=800&h=800&auto=format&fit=crop'], category: 'Spices', variants: [ { id: 401, name: '150g', price: 6.75, stock: 50 } ], reviews: [], origin: 'Erode, India', tags: ['Organic', 'Gluten-Free'] },
  { id: 5, name: 'Kashmiri Almonds', description: 'Crunchy and nutritious premium almonds from the valleys of Kashmir.', images: ['https://images.unsplash.com/photo-1569472023033-9a3d24001d4b?q=80&w=800&h=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1606756790134-42848c7f5592?q=80&w=800&h=800&auto=format&fit=crop'], category: 'Nuts', variants: [ { id: 501, name: '500g', price: 18.25, salePrice: 15.00, stock: 2 }, { id: 502, name: '1kg', price: 34.00, salePrice: 28.50, stock: 0 } ], reviews: [ { id: 4, author: 'Sanjay P.', rating: 5, comment: "Very fresh and crunchy. Perfect for snacking.", verifiedPurchase: true }, ], origin: 'Kashmir, India', tags: ['Gluten-Free', 'Single Origin'] },
  { id: 6, name: 'Gourmet Garam Masala', description: 'Our signature Garam Masala is a tribute to tradition, artisanally crafted from a secret blend of over a dozen whole spices. Each spice is individually toasted to perfection before being ground to release its full-bodied aroma and flavor. This warm, fragrant blend is the heart of North Indian cuisine, essential for creating authentic, soul-satisfying dishes.', images: ['https://images.unsplash.com/photo-1599021438284-82d2d6501d9f?q=80&w=800&h=800&auto=format&fit=crop'], videos: ['https://videos.pexels.com/video-files/5763784/5763784-sd.mp4'], category: 'Spices', variants: [{ id: 601, name: '100g', price: 9.99, stock: 30 }], reviews: [], tags: ['Hand-Crafted', 'Aromatic'] },
  { id: 7, name: 'Sun-dried Figs', description: 'Sweet and chewy figs, naturally dried.', images: ['https://images.unsplash.com/photo-1601056582390-0b73c4155b1f?q=80&w=800&h=800&auto=format&fit=crop'], category: 'Dry Fruits', variants: [{ id: 701, name: '400g', price: 14.50, stock: 0 }], reviews: [], tags: ['Organic'] },
  { id: 8, name: 'Cashew Nuts (W240)', description: 'Large, whole cashew nuts, creamy and delicious.', images: ['https://images.unsplash.com/photo-1601358902534-19c2a13819c2a1381395?q=80&w=800&h=800&auto=format&fit=crop'], category: 'Nuts', variants: [{ id: 801, name: '500g', price: 22.00, stock: 40 }], reviews: [] },
];
const MOCK_TESTIMONIALS = [ { id: 1, name: 'Priya S.', quote: 'The spices are incredibly fresh and aromatic. My curries have never tasted better! Tattva Co. is my new go-to for all my Indian cooking needs.', rating: 5 }, { id: 2, name: 'Rahul K.', quote: 'Absolutely love the quality of the almonds and cashews. They are crunchy, fresh, and taste premium. The packaging is also top-notch.', rating: 5 }, { id: 3, name: 'Anjali M.', quote: 'I was looking for authentic garam masala and found it here. The blend is perfect and adds such a wonderful flavor to my dishes. Highly recommended!', rating: 4 }, ];
const MOCK_USER: User = { id: 1, name: 'Anika Sharma', email: 'anika.sharma@example.com', isAdmin: true, addresses: [ { id: 1, type: 'Shipping', street: '123 Spice Lane', city: 'Mumbai', state: 'MH', zip: '400001', country: 'India', isDefault: true }, { id: 2, type: 'Billing', street: '456 Silk Road', city: 'Delhi', state: 'DL', zip: '110001', country: 'India' }, ] };
const MOCK_PROMO_CODES: { [key: string]: { type: 'percent' | 'fixed'; value: number } } = { 'TATTVA10': { type: 'percent', value: 10 }, 'SPICE5': { type: 'fixed', value: 5 }, 'COMEBACK15': { type: 'percent', value: 15 }, 'QUIZMASTER15': { type: 'percent', value: 15 }, 'SPICEFAN10': { type: 'percent', value: 10 } };
const getInitialRoute = () => window.location.hash.replace(/^#/, '') || '/';

const useExitIntent = (onExitIntent: () => void, cartItemCount: number) => {
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (cartItemCount > 0 && !e.relatedTarget && e.clientY <= 0) {
        onExitIntent();
      }
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [onExitIntent, cartItemCount]);
};

const usePersistentState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};


const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [testimonials] = useState(MOCK_TESTIMONIALS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isBannerVisible, setBannerVisible] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // New state
  const [isLoading, setIsLoading] = useState(true);
  const [isExitIntentOpen, setExitIntentOpen] = useState(false);
  const [isComparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Persistent State
  const [selectedCategory, setSelectedCategory] = usePersistentState('tattva_category', 'All');
  const [sortOption, setSortOption] = usePersistentState('tattva_sort', 'featured');
  const [showOnlyOnSale, setShowOnlyOnSale] = usePersistentState('tattva_onSale', false);
  const [showOnlyInStock, setShowOnlyInStock] = usePersistentState('tattva_inStock', false);
  const [selectedTags, setSelectedTags] = usePersistentState<string[]>('tattva_tags', []);
  const [comparisonList, setComparisonList] = usePersistentState<Product[]>('tattva_comparison', []);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const item = window.localStorage.getItem('tattva_recentlyViewed');
      if (item) {
        const ids = JSON.parse(item) as number[];
        const viewedProducts = ids.map(id => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
        return viewedProducts;
      }
      return [];
    } catch (error) {
      console.error("Error reading recently viewed items:", error);
      return [];
    }
  });


  const maxPrice = useMemo(() => Math.max(...MOCK_PRODUCTS.flatMap(p => p.variants.map(v => v.price))), []);
  const [priceRange, setPriceRange] = usePersistentState('tattva_priceRange', { min: 0, max: maxPrice });

  // Routing and auth state
  const [route, setRoute] = useState(getInitialRoute());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRoute(getInitialRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useExitIntent(() => setExitIntentOpen(true), cartItems.length);

  const addToast = useCallback((message: string, type: ToastMessage['type'], icon?: React.ReactNode) => {
    setToasts(toasts => [...toasts, { id: Date.now(), message, type, icon }]);
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => {
      const price = item.selectedVariant.salePrice ?? item.selectedVariant.price;
      return sum + price * item.quantity;
  }, 0), [cartItems]);
  
  const shippingCost = useMemo(() => subtotal > 50 ? 0 : 5.00, [subtotal]);

  const handleApplyPromoCode = useCallback((code: string) => {
    const promo = MOCK_PROMO_CODES[code.toUpperCase()];
    if (promo) {
        setPromoCode(code);
        if (promo.type === 'percent') {
            const discountValue = (subtotal * promo.value) / 100;
            setDiscount(discountValue);
            addToast(`Successfully applied ${promo.value}% discount!`, 'success');
        } else {
            setDiscount(promo.value);
            addToast(`Successfully applied $${promo.value.toFixed(2)} discount!`, 'success');
        }
    } else {
        setPromoCode('');
        setDiscount(0);
        addToast('Invalid or expired promo code.', 'error');
    }
  }, [addToast, subtotal]);

  useEffect(() => {
    if(promoCode) handleApplyPromoCode(promoCode);
    else setDiscount(0);
  }, [subtotal, promoCode, handleApplyPromoCode]);

  const handleRemovePromoCode = useCallback(() => {
      setPromoCode('');
      addToast('Promo code removed.', 'info');
  }, [addToast]);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => {
      const newRecentlyViewed = [product, ...prev.filter(p => p.id !== product.id)].slice(0, 5);
      localStorage.setItem('tattva_recentlyViewed', JSON.stringify(newRecentlyViewed.map(p => p.id)));
      return newRecentlyViewed;
    });
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))], []);
  const allTags = useMemo(() => Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.tags || []))), []);

  const handleToggleTag = useCallback((tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]), [setSelectedTags]);
  const getProductPrice = (product: Product) => Math.min(...product.variants.map(v => v.salePrice ?? v.price));

  const processedProducts = useMemo(() => {
    let filtered = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOnSale = !showOnlyOnSale || product.variants.some(v => v.salePrice);
        const matchesInStock = !showOnlyInStock || product.variants.some(v => v.stock > 0);
        const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => product.tags?.includes(tag));
        const matchesPrice = product.variants.some(v => (v.salePrice ?? v.price) <= priceRange.max);
        return matchesCategory && matchesSearch && matchesOnSale && matchesInStock && matchesTags && matchesPrice;
    });

    switch (sortOption) {
        case 'price-asc': filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b)); break;
        case 'price-desc': filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a)); break;
        case 'rating-desc': filtered.sort((a, b) => (b.reviews.reduce((acc, r) => acc + r.rating, 0) / (b.reviews.length || 1)) - (a.reviews.reduce((acc, r) => acc + r.rating, 0) / (a.reviews.length || 1))); break;
    }
    return filtered;
  }, [products, searchQuery, selectedCategory, sortOption, showOnlyOnSale, showOnlyInStock, selectedTags, priceRange]);

  const handleAddToCart = useCallback((product: Product, variant: Variant, quantity: number = 1) => {
    if (variant.stock < quantity) { addToast(`Sorry, '${product.name} (${variant.name})' is out of stock.`, 'error'); return; }
    const itemInCart = cartItems.find(item => item.product.id === product.id && item.selectedVariant.id === variant.id);
    if (itemInCart && (itemInCart.quantity + quantity) > variant.stock) { addToast(`Only ${variant.stock} units of '${product.name} (${variant.name})' are available.`, 'error'); return; }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id && item.selectedVariant.id === variant.id);
      return existingItem ? prevItems.map(item => (item.product.id === product.id && item.selectedVariant.id === variant.id) ? { ...item, quantity: item.quantity + quantity } : item) : [...prevItems, { product, selectedVariant: variant, quantity }];
    });
    addToast(`'${product.name} (${variant.name})' added to cart`, 'success');
  }, [cartItems, addToast]);
  
  const handleUpdateQuantity = useCallback((productId: number, variantId: number, quantity: number) => {
    const itemInCart = cartItems.find(item => item.product.id === productId && item.selectedVariant.id === variantId);
    if (!itemInCart) return;
    if (quantity > itemInCart.selectedVariant.stock) { addToast(`Only ${itemInCart.selectedVariant.stock} units of '${itemInCart.product.name}' are available.`, 'error'); return; }
    setCartItems(prevItems => (quantity <= 0) ? prevItems.filter(item => !(item.product.id === productId && item.selectedVariant.id === variantId)) : prevItems.map(item => (item.product.id === productId && item.selectedVariant.id === variantId) ? { ...item, quantity } : item));
  }, [cartItems, addToast]);

  const handleToggleWishlist = useCallback((product: Product) => setWishlist(prev => prev.some(item => item.id === product.id) ? prev.filter(item => item.id !== product.id) : (addToast(`'${product.name}' added to wishlist`, 'success', <HeartIcon className="h-6 w-6 text-red-500 fill-current" />), [...prev, product])), [addToast]);

  const handleAddReview = useCallback((productId: number, review: Omit<Review, 'id' | 'verifiedPurchase'>) => {
    setProducts(current => current.map(p => p.id === productId ? { ...p, reviews: [{ ...review, id: Date.now(), verifiedPurchase: false }, ...p.reviews] } : p));
    setSelectedProduct(prev => prev && prev.id === productId ? { ...prev, reviews: [{ ...review, id: Date.now(), verifiedPurchase: false }, ...prev.reviews] } : prev);
  }, []);

  const handleAskQuestion = useCallback((productId: number, question: Omit<QnA, 'id'|'answer'>) => {
    setProducts(current => current.map(p => p.id === productId ? { ...p, qna: [...(p.qna || []), { ...question, id: Date.now() }] } : p));
    setSelectedProduct(prev => prev && prev.id === productId ? { ...prev, qna: [...(prev.qna || []), { ...question, id: Date.now() }] } : prev);
    addToast('Your question has been submitted!', 'success');
  }, [addToast]);
  
  const handleToggleCompare = useCallback((product: Product) => {
    setComparisonList(prev => {
        if(prev.some(p => p.id === product.id)) {
            return prev.filter(p => p.id !== product.id);
        }
        if(prev.length >= 4) {
            addToast('You can only compare up to 4 products.', 'info');
            return prev;
        }
        return [...prev, product];
    });
  }, [addToast, setComparisonList]);

  const handleNotifyMe = useCallback((productName: string) => {
    addToast(`We'll notify you when '${productName}' is back in stock!`, 'info');
  }, [addToast]);

  const handleCategorySelectFromHeader = useCallback((category: string) => {
    setSelectedCategory(category);
    window.location.hash = '/';
  }, [setSelectedCategory]);

  const wishlistedIds = useMemo(() => new Set(wishlist.map(p => p.id)), [wishlist]);
  const comparisonIds = useMemo(() => new Set(comparisonList.map(p => p.id)), [comparisonList]);
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [{ label: 'Home', href: '#/' }];
    if (route.startsWith('/profile')) items.push({ label: 'Profile' });
    else if (route.startsWith('/admin')) items.push({ label: 'Admin Dashboard' });
    else if (route.startsWith('/checkout')) items.push({ label: 'Checkout' });
    else if (route.startsWith('/contact')) items.push({ label: 'Contact' });
    else if (route.startsWith('/privacy-policy')) items.push({ label: 'Privacy Policy' });
    else if (route.startsWith('/refund-policy')) items.push({ label: 'Refund Policy' });
    else if (route.startsWith('/terms-of-service')) items.push({ label: 'Terms of Service' });
    else if (route.startsWith('/recipes')) items.push({ label: 'Recipes' });
    else if (route.startsWith('/about')) items.push({ label: 'About Us' });
    else if (route.startsWith('/faqs')) items.push({ label: 'FAQs' });
    else if (selectedCategory !== 'All') {
      items.push({ label: 'Products', href: '#/' });
      items.push({ label: selectedCategory });
    } else {
      items.push({ label: 'Products' });
    }
    return items;
  }, [selectedCategory, route]);

  const renderPage = () => {
    switch (route) {
        case '/checkout': return <CheckoutPage cartItems={cartItems} user={currentUser} onPlaceOrder={(data) => { 
            const order: Order = {...data, id:`TCO-${Date.now()}`, date: new Date().toISOString(), status:'Processing'}; setOrders(p => [order,...p]); setCartItems([]); setPromoCode(''); return order; }} addToast={addToast} discount={discount} promoCode={promoCode} onApplyPromoCode={handleApplyPromoCode} onRemovePromoCode={handleRemovePromoCode} shippingCost={shippingCost} subtotal={subtotal} />;
        case '/profile': return <UserProfile user={currentUser!} orders={orders} />;
        case '/admin': return currentUser?.isAdmin ? <AdminDashboard products={products} orders={orders} analytics={{totalRevenue: orders.reduce((s,o)=>s+o.total,0), totalOrders: orders.length, uniqueCustomers: new Set(orders.map(o => o.shippingAddress.street)).size, salesData: Object.entries(orders.reduce((acc, o) => {const m=new Date(o.date).toLocaleString('default',{month:'short',year:'numeric'}); acc[m]=(acc[m]||0)+o.total; return acc;}, {} as {[key:string]:number})).map(([name, sales])=>({name, sales})).reverse()}} onSaveProduct={(p) => {setProducts(prev => prev.some(pr=>pr.id===p.id) ? prev.map(pr=>pr.id===p.id?p:pr) : [...prev, {...p,id:Date.now()}]); addToast('Product saved!', 'success');}} onDeleteProduct={(id) => {setProducts(prev => prev.filter(p=>p.id!==id)); addToast('Product deleted!', 'info');}} onUpdateOrderStatus={(id,s) => {setOrders(prev=>prev.map(o=>o.id===id?{...o,status:s}:o)); addToast(`Order status updated.`, 'success');}} /> : <div className="text-center py-20"><h2>Access Denied</h2></div>;
        case '/privacy-policy': return <PrivacyPolicyPage />;
        case '/refund-policy': return <RefundPolicyPage />;
        case '/terms-of-service': return <TermsOfServicePage />;
        case '/contact': return <ContactPage />;
        case '/recipes': return <RecipesPage onSelectRecipe={setSelectedRecipe} />;
        case '/about': return <AboutPage />;
        case '/faqs': return <FAQsPage />;
        default:
            return (
                <>
                    <Hero />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Our Products</h2>
                        </div>
                        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <AdvancedFilters availableTags={allTags} selectedTags={selectedTags} onToggleTag={handleToggleTag} showOnSale={showOnlyOnSale} onToggleOnSale={() => setShowOnlyOnSale(v => !v)} showInStock={showOnlyInStock} onToggleInStock={() => setShowOnlyInStock(v => !v)} priceRange={priceRange} maxPrice={maxPrice} onPriceChange={(max) => setPriceRange(p => ({...p, max}))} />
                            <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
                        </div>
                        <ProductGrid products={processedProducts} onAddToCart={(p, v) => handleAddToCart(p, v, 1)} onToggleWishlist={handleToggleWishlist} wishlistedIds={wishlistedIds} onSelectProduct={handleSelectProduct} isLoading={isLoading} onToggleCompare={handleToggleCompare} comparisonIds={comparisonIds} onNotifyMe={handleNotifyMe} />
                    </div>
                    {recentlyViewed.length > 0 && (
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <ProductSlider title="Recently Viewed" products={recentlyViewed} onAddToCart={(p, v) => handleAddToCart(p, v, 1)} onToggleWishlist={handleToggleWishlist} wishlistedIds={wishlistedIds} onSelectProduct={handleSelectProduct} onToggleCompare={handleToggleCompare} comparisonIds={comparisonIds} onNotifyMe={handleNotifyMe} />
                        </div>
                    )}
                    <Testimonials testimonials={testimonials} />
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
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(ts => ts.filter(t => t.id !== id))} />
      {isBannerVisible && <PromotionalBanner onClose={() => setBannerVisible(false)} />}
      <Header cartItems={cartItems} subtotal={subtotal} wishlistItemCount={wishlist.length} searchQuery={searchQuery} onSearchChange={setSearchQuery} onCartClick={() => setCartOpen(true)} onWishlistClick={() => setWishlistOpen(true)} onMobileMenuClick={() => setMobileMenuOpen(true)} isLoggedIn={isLoggedIn} isAdmin={currentUser?.isAdmin ?? false} onLoginClick={() => setAuthModalOpen(true)} onLogoutClick={() => {setIsLoggedIn(false); setCurrentUser(null); addToast('You have been logged out.', 'info');}} allProducts={products} onSelectProduct={handleSelectProduct} categories={categories} onSelectCategory={handleCategorySelectFromHeader} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4"><Breadcrumbs items={breadcrumbItems} /></div>
        {renderPage()}
      </main>
      <Footer onSelectCategory={handleCategorySelectFromHeader} />

      <SideModal title="Shopping Cart" isOpen={isCartOpen} onClose={() => setCartOpen(false)}><Cart items={cartItems} onUpdateQuantity={handleUpdateQuantity} onClose={() => setCartOpen(false)} isLoggedIn={isLoggedIn} promoCode={promoCode} onPromoCodeChange={setPromoCode} onApplyPromoCode={handleApplyPromoCode} discount={discount} shippingCost={shippingCost} subtotal={subtotal} /></SideModal>
      <SideModal title="Your Wishlist" isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)}><Wishlist items={wishlist} onToggleWishlist={handleToggleWishlist} onAddToCart={(p,v)=>handleAddToCart(p,v,1)} onClose={() => setWishlistOpen(false)} /></SideModal>

      {selectedProduct && <ProductDetailModal product={selectedProduct} allProducts={products} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onAddReview={handleAddReview} onDeleteReview={(pid, rid) => {setProducts(c => c.map(p => p.id === pid ? {...p, reviews: p.reviews.filter(r => r.id !== rid)} : p)); setSelectedProduct(prev => prev ? {...prev, reviews: prev.reviews.filter(r => r.id !== rid)} : null);}} onSelectCategoryAndClose={(c) => {setSelectedCategory(c); setSelectedProduct(null);}} addToast={addToast} onAskQuestion={handleAskQuestion} onSelectProduct={handleSelectProduct} onNotifyMe={handleNotifyMe} />}
      {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} onLogin={() => {setIsLoggedIn(true); setCurrentUser(MOCK_USER); setAuthModalOpen(false); addToast(`Welcome back, ${MOCK_USER.name}!`, 'success');}} />}
      <ComparisonBar items={comparisonList} onRemove={handleToggleCompare} onClear={() => setComparisonList([])} onCompare={() => setComparisonModalOpen(true)} />
      {isExitIntentOpen && cartItems.length > 0 && <ExitIntentModal onClose={() => setExitIntentOpen(false)} onApplyPromo={(code) => { handleApplyPromoCode(code); addToast('15% discount applied!', 'success'); }} />}
      {isComparisonModalOpen && <ComparisonModal items={comparisonList} onClose={() => setComparisonModalOpen(false)} />}
      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default App;
