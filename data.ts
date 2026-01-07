import { Product, User, Order, Testimonial, BlogPost, Recipe } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Himalayan Saffron',
    description:
      'Transform your biryanis from ordinary to unforgettable with just a pinch. Experience the deep, golden aroma that only fresh, unadulterated Kashmiri Mongra can deliver.',
    images: [
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    ],
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'],
    category: 'Spices',
    variants: [
      { id: 101, name: '1g', price: 599, salePrice: 499, stock: 15 },
      { id: 102, name: '5g', price: 2899, stock: 8 },
    ],
    reviews: [
      {
        id: 1,
        author: 'Priya K.',
        rating: 5,
        comment: 'Absolutely divine! The aroma filled my kitchen. Best saffron I have ever used.',
        verifiedPurchase: true,
        date: '2023-10-15',
        images: [
          'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=300&q=80',
        ],
        helpful: 12,
      },
      {
        id: 2,
        author: 'Raj S.',
        rating: 5,
        comment: 'Top quality product. Worth every penny.',
        verifiedPurchase: true,
      },
    ],
    qna: [
      {
        id: 1,
        author: 'Amit',
        question: 'Is this Grade A saffron?',
        answer: 'Yes, this is Grade A Mongra saffron, which is the highest quality available.',
      },
    ],
    nutrition: [{ key: 'Rich in', value: 'Antioxidants' }],
    origin: 'Kashmir, India',
    harvestDate: 'October 2024',
    grade: 'Mongra (Grade A)',
    purityTest: 'Lab Tested for Safranal & Crocin',
    storage: 'Store in a cool, dry place away from sunlight',
    shelfLife: '24 Months',
    grind: 'Whole',
    tags: ['Premium', 'Aromatic', 'Organic', 'Indian', 'Middle Eastern'],
  },
  {
    id: 2,
    name: 'Malabar Black Pepper',
    description:
      "Give your dishes a bold, aromatic kick that pre-ground pepper simply can't match. Taste the difference of sun-dried Tellicherry peppercorns in every bite.",
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 201, name: '250g', price: 399, stock: 30 }],
    reviews: [
      {
        id: 3,
        author: 'Chef Maria',
        rating: 5,
        comment: 'As a chef, I can tell the difference. This is the real deal.',
        verifiedPurchase: false,
      },
    ],
    origin: 'Kerala, India',
    harvestDate: 'January 2025',
    grade: 'Tellicherry Garbled Special Extra Bold (TGSEB)',
    purityTest: 'Pesticide Free',
    storage: 'Airtight container',
    shelfLife: '18 Months',
    grind: 'Whole',
    tags: ['Single-Origin', 'Spicy', 'Indian', 'International'],
  },
  {
    id: 3,
    name: 'Kashmiri Almonds',
    description:
      'Experience the rich, creamy sweetness of Mamra almonds—far superior to standard varieties. Packed with natural oils, they make healthy snacking feel indulgent.',
    images: [
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [
      { id: 301, name: '500g', price: 899, stock: 20 },
      { id: 302, name: '1kg', price: 1699, stock: 10 },
    ],
    reviews: [
      {
        id: 4,
        author: 'Anjali P.',
        rating: 5,
        comment: 'So delicious and crunchy. You can taste the quality.',
        verifiedPurchase: true,
      },
    ],
    nutrition: [{ key: 'High in', value: 'Vitamin E & Protein' }],
    origin: 'Kashmir, India',
    harvestDate: 'September 2024',
    grade: 'Mamra Premium',
    purityTest: 'Natural & Unpolished',
    storage: 'Refrigerate for long-term freshness',
    shelfLife: '12 Months',
    grind: 'Whole',
    tags: ['Premium', 'Gluten-Free', 'Keto'],
  },
  {
    id: 4,
    name: 'Organic Turmeric Powder',
    description:
      "Feel confident about what you're cooking with—purity you can see in the vibrant color. This high-curcumin turmeric adds earthy richness without the fear of additives.",
    images: ['/images/products/turmeric-1.svg', '/images/products/turmeric-2.svg'],
    category: 'Spices',
    variants: [{ id: 401, name: '200g', price: 249, stock: 5 }],
    reviews: [
      {
        id: 5,
        author: 'John D.',
        rating: 5,
        comment: 'The color and smell are so much richer than store-bought turmeric. Excellent!',
        verifiedPurchase: true,
      },
      {
        id: 6,
        author: 'Emily R.',
        rating: 4,
        comment: 'Great product, makes a wonderful turmeric latte.',
        verifiedPurchase: true,
      },
    ],
    nutrition: [{ key: 'High in', value: 'Curcumin' }],
    origin: 'Andhra Pradesh, India',
    harvestDate: 'February 2025',
    grade: 'High Curcumin (5%+)',
    purityTest: 'Certified Organic',
    storage: 'Cool, dark place',
    shelfLife: '12 Months',
    tags: ['Organic', 'Gluten-Free', 'Healthy'],
  },
  {
    id: 5,
    name: 'Darjeeling First Flush Tea',
    description:
      'Elevate your morning ritual with the "Champagne of Teas"—so delicate effectively it needs no sugar. Enjoy the floral aroma and leave the bitterness behind.',
    images: [
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Beverages',
    variants: [{ id: 501, name: '100g', price: 1299, salePrice: 1099, stock: 25 }],
    reviews: [
      {
        id: 7,
        author: 'Sophie L.',
        rating: 5,
        comment: 'An exquisite tea. Delicate and so refreshing.',
        verifiedPurchase: true,
      },
    ],
    origin: 'Darjeeling, India',
    harvestDate: 'March 2025',
    grade: 'FTGFOP1',
    purityTest: 'Single Estate',
    storage: 'Airtight tin',
    shelfLife: '24 Months',
    tags: ['Premium', 'Single-Origin', 'Tea'],
  },
  {
    id: 6,
    name: 'Gourmet Garam Masala',
    description:
      'Stop guessing with store-bought mixes—achieve restaurant-quality flavor effortlessly. This artisanal blend brings perfect balance to your curries every single time.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 601, name: '100g', price: 349, stock: 40 }],
    reviews: [
      {
        id: 8,
        author: 'David C.',
        rating: 5,
        comment: 'This has elevated my home cooking. I put it in everything!',
        verifiedPurchase: true,
      },
    ],
    qna: [
      {
        id: 2,
        author: 'Lisa',
        question: 'Is this very spicy/hot?',
        answer:
          'Our Garam Masala is aromatic and flavorful, not primarily hot. The heat level is mild.',
      },
    ],
    origin: 'India (House Blend)',
    harvestDate: 'Freshly Ground Monthly',
    grade: 'Artisanal Blend',
    purityTest: 'No Fillers',
    storage: 'Airtight container',
    shelfLife: '9 Months',
    tags: ['Aromatic', 'House Blend', 'Spices'],
  },
  {
    id: 7,
    name: 'Organic Dried Apricots',
    description:
      "Satisfy your sweet tooth guilt-free with nature's candy. These unsulphured apricots are naturally sweet and chewy, perfect for a healthy energy boost.",
    images: [
      'https://images.unsplash.com/photo-1606913084603-3e7702b01627?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595413667362-722923769976?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 701, name: '400g', price: 649, stock: 18 }],
    reviews: [],
    origin: 'Ladakh, India',
    harvestDate: 'August 2024',
    grade: 'Jumbo',
    purityTest: 'Unsulphured',
    storage: 'Refrigerate',
    shelfLife: '12 Months',
    tags: ['Organic', 'Gluten-Free', 'Snack'],
  },
  {
    id: 8,
    name: 'Goan Cashew Nuts',
    description:
      'Immerse yourself in the creamy crunch of premium W240 cashews. Perfectly roasted to bring out a natural sweetness that makes ordinary cashews feel bland.',
    images: [
      'https://images.unsplash.com/photo-1536591375315-1988d6960545?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595413667362-722923769976?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [
      { id: 801, name: '250g', price: 499, stock: 0 },
      { id: 802, name: '500g', price: 949, stock: 0 },
    ],
    reviews: [
      {
        id: 9,
        author: 'Michael B.',
        rating: 5,
        comment: 'Best cashews I have ever had. So fresh and crunchy.',
        verifiedPurchase: true,
      },
    ],
    origin: 'Goa, India',
    harvestDate: 'April 2025',
    grade: 'W240',
    purityTest: 'Premium Roast',
    storage: 'Airtight container',
    shelfLife: '6 Months',
    tags: ['Premium', 'Snack', 'Indian'],
  },
  {
    id: 9,
    name: 'Lakadong Turmeric',
    description:
      'Stop settling for dull, yellow powder. Our high-curcumin turmeric adds vibrant color and potent anti-inflammatory benefits to every spoon.',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 901, name: '250g', price: 249, stock: 50 }],
    reviews: [],
    tags: ['High Curcumin', 'Organic', 'Essential'],
  },
  {
    id: 10,
    name: 'Coorg Green Cardamom',
    description:
      'Breathe life into your chai and desserts with pearls of intense fragrance. Harvested at peak ripeness for an aroma that fills the room.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1001, name: '50g', price: 349, stock: 30 }],
    reviews: [],
    tags: ['Aromatic', 'Baking', 'Chai'],
  },
  {
    id: 11,
    name: 'Ceylon Cinnamon',
    description:
      'Forget the harsh burn of cassia. Enjoy the delicate, sweet warmth of true cinnamon that elevates your baking without overpowering it.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1101, name: '100g', price: 399, stock: 25 }],
    reviews: [],
    tags: ['Sweet', 'Baking', 'True Cinnamon'],
  },
  {
    id: 12,
    name: 'Guntur Chilli Powder',
    description:
      'Ignite your palate with authentic fiery heat. Authentic Guntur chillies deliver the punch you crave without the artificial dyes.',
    images: ['/images/products/red-chilli-powder-back.jpg'],
    category: 'Spices',
    variants: [{ id: 1201, name: '250g', price: 199, stock: 60 }],
    reviews: [],
    tags: ['Spicy', 'Essential', 'Indian'],
  },
  {
    id: 13,
    name: 'Coriander Seeds',
    description:
      'Crush these seeds to release a citrusy, floral burst that transforms curries. Sourced fresh to ensure no flavor is lost to time.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1301, name: '200g', price: 149, stock: 45 }],
    reviews: [],
    tags: ['Citrusy', 'Essential', 'Whole'],
  },
  {
    id: 14,
    name: 'Cumin Seeds',
    description:
      'The backbone of flavor, revived. Our sun-dried cumin seeds bring a nutty, earthy depth that generic store brands simply lack.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1401, name: '200g', price: 199, stock: 50 }],
    reviews: [],
    tags: ['Earthy', 'Essential', 'Whole'],
  },
  {
    id: 15,
    name: 'Fennel Seeds',
    description:
      'Refresh your senses with the sweet, licorice-like crunch of Lucknowi fennel. A perfect digestive that tastes as good as it feels.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1501, name: '100g', price: 129, stock: 40 }],
    reviews: [],
    tags: ['Sweet', 'Digestive', 'Mukhwas'],
  },
  {
    id: 16,
    name: 'Star Anise',
    description:
      'Add a mystical, sweet-spiciness to your broths. Whole stars that guarantee your signature dishes have that secret restaurant-quality depth.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1601, name: '50g', price: 249, stock: 30 }],
    reviews: [],
    tags: ['Exotic', 'Aromatic', 'Whole'],
  },
  {
    id: 17,
    name: 'Cloves',
    description:
      'Unlock intense, warming aroma with just a few buds. Hand-selected for oil content, ensuring your heavy spices pack a powerful punch.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1701, name: '50g', price: 299, stock: 35 }],
    reviews: [],
    tags: ['Pungent', 'Aromatic', 'Whole'],
  },
  {
    id: 18,
    name: 'Mustard Seeds',
    description:
      'Hear the pop of freshness. These seeds crackle with pungent flavor, essential for a tempering that wakes up any lentil dish.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1801, name: '200g', price: 99, stock: 60 }],
    reviews: [],
    tags: ['Pungent', 'Tempering', 'Essential'],
  },
  {
    id: 19,
    name: 'Fenugreek Seeds',
    description:
      'Master the art of subtle bitterness. Essential for pickles and sambar, adding a complex savory note that balances rich flavors.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1901, name: '200g', price: 119, stock: 40 }],
    reviews: [],
    tags: ['Bitter', 'Pickling', 'Essential'],
  },
  {
    id: 20,
    name: 'Bay Leaf',
    description:
      'Infuse your slow-cooked meals with a subtle, herbal elegance. Whole, unbroken leaves that release flavor slowly and steadily.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 2001, name: '50g', price: 89, stock: 50 }],
    reviews: [],
    tags: ['Aromatic', 'Whole', 'Essential'],
  },
  {
    id: 21,
    name: 'Cashew Nuts',
    description:
      'Creamy, crunchy, and naturally sweet. Whole W320 grade cashews that turn snacking into a moment of pure, guilt-free luxury.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [{ id: 2101, name: '500g', price: 799, stock: 30 }],
    reviews: [],
    tags: ['Snack', 'Creamy', 'Premium'],
  },
  {
    id: 22,
    name: 'Pistachios',
    description:
      'Crack open vibrant green delight. Lightly salted and roasted to perfection, making every kernel a savory treasure.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [{ id: 2201, name: '250g', price: 499, stock: 30 }],
    reviews: [],
    tags: ['Snack', 'Roasted', 'Salted'],
  },
  {
    id: 23,
    name: 'Walnuts',
    description:
      'Brain food that actually tastes good. Golden, buttery kernels with zero bitterness, perfect for baking or snacking straight from the shell.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [{ id: 2301, name: '500g', price: 899, stock: 20 }],
    reviews: [],
    tags: ['Healthy', 'Baking', 'Snack'],
  },
  {
    id: 24,
    name: 'Raisins',
    description:
      "Nature's candy, redefined. Plump, juicy, and bursting with natural sweetness—no added sugar needed.",
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 2401, name: '500g', price: 299, stock: 50 }],
    reviews: [],
    tags: ['Sweet', 'Snack', 'Natural'],
  },
  {
    id: 25,
    name: 'Dried Figs',
    description:
      'Chewy, honey-like sweetness in every bite. A calcium-rich superfood that satisfies your dessert cravings naturally.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 2501, name: '250g', price: 399, stock: 30 }],
    reviews: [],
    tags: ['Sweet', 'Healthy', 'Snack'],
  },
  {
    id: 26,
    name: 'Apricots',
    description:
      'Tangy-sweet, sun-kissed goodness. Soft, vibrant apricots that bring a burst of Himalayan sunshine to your pantry.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 2601, name: '250g', price: 449, stock: 25 }],
    reviews: [],
    tags: ['Tangy', 'Healthy', 'Snack'],
  },
  {
    id: 27,
    name: 'Masala Chai Blend',
    description:
      'Ditch the teabag dust. Brew a cup of comfort with whole spices and premium tea leaves for a ritual that recharges your soul.',
    images: ['/images/products/chai-masala-front.jpg', '/images/products/chai-masala-back.jpg'],
    category: 'Beverages',
    variants: [{ id: 2701, name: '250g', price: 349, stock: 40 }],
    reviews: [],
    tags: ['Tea', 'Spiced', 'Ritual'],
  },
  {
    id: 28,
    name: 'Garam Masala',
    description:
      'The finishing touch your grandmother would approve of. A secret blend of 12 roasted spices that brings harmony to any Indian curry.',
    images: ['/images/products/garam-masala-front.jpg', '/images/products/garam-masala-back.jpg'],
    category: 'Spices',
    variants: [{ id: 2801, name: '100g', price: 299, stock: 35 }],
    reviews: [],
    tags: ['Blend', 'Essential', 'Aromatic'],
  },
  {
    id: 29,
    name: 'Coriander Powder',
    description:
      'Freshly ground from premium coriander seeds. This aromatic powder adds a mild, citrusy flavor and thickens your curries perfectly.',
    images: [
      '/images/products/coriander-powder-front.jpg',
      '/images/products/coriander-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [{ id: 2901, name: '200g', price: 149, stock: 45 }],
    reviews: [],
    tags: ['Earthy', 'Citrusy', 'Essential'],
  },
];

export const MOCK_USER: User = {
  id: 1,
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  isAdmin: true,
  addresses: [
    {
      id: '1',
      type: 'Shipping',
      street: '42, Lotus Boulevard',
      city: 'Mumbai',
      state: 'MH',
      zip: '400001',
      country: 'India',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Billing',
      street: '15, Park Avenue',
      city: 'Delhi',
      state: 'DL',
      zip: '110001',
      country: 'India',
    },
  ],
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'TC1001-2024',
    date: '2024-05-15T10:00:00Z',
    items: [
      { product: MOCK_PRODUCTS[0], selectedVariant: MOCK_PRODUCTS[0].variants[0], quantity: 1 },
      { product: MOCK_PRODUCTS[1], selectedVariant: MOCK_PRODUCTS[1].variants[0], quantity: 2 },
    ],
    total: 40.97,
    status: 'Delivered',
    shippingAddress: MOCK_USER.addresses[0],
    billingAddress: MOCK_USER.addresses[0],
    deliveryMethod: 'Standard',
    paymentMethod: 'Credit Card',
    shippingCost: 5.0,
  },
  {
    id: 'TC1002-2024',
    date: '2024-06-01T14:30:00Z',
    items: [
      { product: MOCK_PRODUCTS[4], selectedVariant: MOCK_PRODUCTS[4].variants[0], quantity: 1 },
    ],
    total: 22.5,
    status: 'Shipped',
    shippingAddress: MOCK_USER.addresses[0],
    billingAddress: MOCK_USER.addresses[0],
    deliveryMethod: 'Standard',
    paymentMethod: 'PayPal',
    shippingCost: 5.0,
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Aarav Chen',
    quote:
      'Tattva Co. has completely transformed my cooking. The freshness and quality of the spices are unparalleled.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Isabelle Rodriguez',
    quote:
      'I ordered the Himalayan Saffron and it was magical. The packaging is beautiful and the product is even better. Highly recommend!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ben Carter',
    quote:
      "Fast shipping and incredible customer service. The Malabar Pepper has a kick I haven't found anywhere else.",
    rating: 4,
  },
];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'the-secret-to-perfect-biryani',
    title: "The Secret to Perfect Biryani: It's All in the Saffron",
    author: 'Anika Sharma',
    date: 'July 15, 2024',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Unlock the secrets to a truly aromatic and flavorful biryani. We dive deep into why high-quality saffron, like our Himalayan variety, is the game-changer you need in your kitchen.',
    content: `
      <p>Biryani is more than just a dish; it's a celebration. And at the heart of every great biryani is the quality of its ingredients. While the blend of spices is crucial, the one element that elevates it from good to unforgettable is saffron.</p>
      <p>Our <strong>Tattva Co. Himalayan Saffron</strong> is sourced from the pristine valleys of Kashmir, where it is hand-picked and carefully dried to preserve its potent aroma, vibrant color, and distinct flavor. A few strands are enough to infuse your entire dish with a golden hue and a fragrance that is simply intoxicating.</p>
      <h3 class="text-xl font-serif font-bold my-4">Why Quality Matters</h3>
      <p>Not all saffron is created equal. Lower-grade saffron can be dull in color and weak in flavor, requiring you to use much more for a fraction of the effect. High-quality saffron releases its color and flavor slowly, ensuring a perfectly balanced and aromatic dish every time.</p>
      <h3 class="text-xl font-serif font-bold my-4">Tips for Using Saffron</h3>
      <ul>
        <li>Steep the saffron strands in a few tablespoons of warm milk or water for at least 15 minutes before adding to your rice. This helps to fully release its color and flavor.</li>
        <li>Be gentle. Saffron is delicate. Add it towards the end of the cooking process to preserve its aroma.</li>
        <li>A little goes a long way. For a family-sized biryani, a generous pinch (about 15-20 strands) is usually sufficient.</li>
      </ul>
    `,
    tags: ['Saffron', 'Biryani', 'Cooking Tips'],
  },
  {
    id: 2,
    slug: 'beyond-the-grind-the-power-of-malabar-pepper',
    title: 'Beyond the Grind: The Power of Malabar Pepper',
    author: 'Rohan Gupta',
    date: 'June 28, 2024',
    image:
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Think all pepper is the same? Think again. We explore the bold, complex flavors of Tellicherry peppercorns from the Malabar Coast and why they deserve a prime spot in your spice rack.',
    content: `
      <p>Pepper is one of the most common spices in the world, but it's often overlooked. We're here to change that. The <strong>Tattva Co. Malabar Black Pepper</strong> features Tellicherry peppercorns, the largest and most aromatic of all peppercorns.</p>
      <p>Grown on the lush Malabar Coast in Kerala, these peppercorns are left on the vine longer to develop a deep, rich, and complex flavor profile with notes of citrus and pine. When you grind it fresh, the difference is undeniable.</p>
      <h3 class="text-xl font-serif font-bold my-4">How to Use It</h3>
      <p>Use it to finish dishes, not just during cooking. A fresh grind over a finished steak, a simple salad, or even a bowl of strawberries can be a revelation. Its robust flavor stands up well to strong meats and adds a surprising kick to desserts.</p>
    `,
    tags: ['Pepper', 'Spices', 'History'],
  },
];

export const MOCK_ANALYTICS = {
  totalRevenue: 12543.5,
  totalOrders: 320,
  uniqueCustomers: 180,
  salesData: [
    { name: 'Jan', sales: 1200 },
    { name: 'Feb', sales: 1800 },
    { name: 'Mar', sales: 1500 },
    { name: 'Apr', sales: 2500 },
    { name: 'May', sales: 2100 },
    { name: 'Jun', sales: 3443.5 },
  ],
};

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Classic Chicken Biryani',
    image:
      'https://images.unsplash.com/photo-1631515243349-e0cb75fb8da7?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '20 mins',
    cookTime: '40 mins',
    serves: 4,
    description:
      'Aromatic and flavorful one-pot meal made with saffron-infused rice, tender chicken, and a blend of Tattva Co. spices.',
    ingredients: [
      '500g Chicken',
      '2 cups Basmati Rice',
      '1 pinch Tattva Co. Himalayan Saffron',
      '2 tbsp Tattva Co. Garam Masala',
      '1 cup Yogurt',
      '2 Onions, sliced',
      'Ginger-garlic paste',
    ],
    instructions: [
      'Marinate chicken with yogurt and spices.',
      'Par-boil the rice with saffron.',
      'Layer the chicken and rice in a heavy-bottomed pot.',
      'Cook on low heat (dum) for 30-40 minutes.',
    ],
    relatedProductIds: [1], // Saffron
  },
  {
    id: 2,
    title: 'Spicy Malabar Pepper Prawns',
    image:
      'https://images.unsplash.com/photo-1598494822832-7cb319d9b8e2?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '15 mins',
    cookTime: '10 mins',
    serves: 2,
    description:
      'A quick and fiery appetizer featuring fresh prawns coated in freshly ground Malabar black pepper and other spices.',
    ingredients: [
      '250g Prawns, deveined',
      '2 tbsp Tattva Co. Malabar Black Pepper, coarsely ground',
      '1 tsp Tattva Co. Turmeric Powder',
      'Curry leaves',
      'Coconut oil',
    ],
    instructions: [
      'Marinate prawns with turmeric and salt.',
      'Heat coconut oil, add curry leaves and sauté.',
      'Add prawns and cook until pink.',
      'Sprinkle generously with black pepper and toss well.',
    ],
    relatedProductIds: [2], // Pepper
  },
  {
    id: 3,
    title: 'Creamy Turmeric Latte',
    image:
      'https://images.unsplash.com/photo-1566435942040-566b613e1a67?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '5 mins',
    cookTime: '5 mins',
    serves: 1,
    description:
      'A comforting and healthy beverage made with our organic turmeric powder, milk, and a hint of sweetness.',
    ingredients: [
      '1 cup Milk (of choice)',
      '1 tsp Tattva Co. Organic Turmeric Powder',
      '1/4 tsp Cinnamon powder',
      'Pinch of black pepper',
      '1 tsp Honey or Maple Syrup',
    ],
    instructions: [
      'Gently heat the milk in a small saucepan.',
      'Whisk in turmeric, cinnamon, and pepper.',
      'Heat until warm but not boiling.',
      'Remove from heat, stir in sweetener, and enjoy.',
    ],
    relatedProductIds: [], // Turmeric not in mock products yet
  },
  {
    id: 4,
    title: 'Garam Masala Spiced Nuts',
    image:
      'https://images.unsplash.com/photo-1583624320433-40e9d6519548?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '5 mins',
    cookTime: '15 mins',
    serves: 6,
    description:
      'An addictive snack of mixed nuts roasted with Tattva Co. Garam Masala, a little salt, and a touch of maple syrup.',
    ingredients: [
      '2 cups Mixed Nuts (Tattva Co. Almonds, Cashews)',
      '1 tbsp Coconut oil, melted',
      '1.5 tsp Tattva Co. Garam Masala',
      '1/2 tsp Salt',
      '1 tbsp Maple syrup',
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Toss nuts with all other ingredients until well-coated.',
      'Spread on a baking sheet in a single layer.',
      'Roast for 10-15 minutes, stirring halfway, until fragrant.',
    ],
    relatedProductIds: [3], // Almonds
  },
  {
    id: 5,
    title: 'Kerala-Style Fish Curry',
    image:
      'https://images.unsplash.com/photo-1626200419199-391ae4be7f29?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '15 mins',
    cookTime: '25 mins',
    serves: 4,
    description:
      'Authentic Malabar fish curry with coconut milk, tamarind, and our signature black pepper blend. Restaurant-quality in your home kitchen.',
    ingredients: [
      '500g Fish (pomfret or kingfish), cut into steaks',
      '1 cup Coconut milk',
      '1 tsp Tattva Co. Malabar Black Pepper',
      '1 tsp Tattva Co. Turmeric Powder',
      '2 tbsp Coconut oil',
      '2 tbsp Tamarind paste',
      'Curry leaves, green chillies',
      '1 Onion, sliced thin',
    ],
    instructions: [
      'Marinate fish with turmeric and salt for 15 minutes.',
      'Sauté onions in coconut oil until golden, add curry leaves and green chillies.',
      'Add tamarind paste and coconut milk, bring to a simmer.',
      'Add fish and cook gently for 10 minutes until done.',
      'Finish with freshly cracked black pepper.',
    ],
    relatedProductIds: [2, 4], // Pepper, Turmeric
  },
  {
    id: 6,
    title: 'Authentic Masala Chai',
    image:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600&h=400&auto=format&fit=crop',
    prepTime: '5 mins',
    cookTime: '10 mins',
    serves: 2,
    description:
      'The real thing. Not a chai latte, not a concentrate—proper Indian masala chai brewed from scratch with whole spices.',
    ingredients: [
      '2 cups Water',
      '1 cup Milk',
      '2 tbsp Loose leaf black tea',
      '4 Green cardamom pods, crushed',
      '1 inch Fresh ginger, sliced',
      '2 Cloves',
      '1 Small cinnamon stick',
      '2 tbsp Sugar or jaggery',
    ],
    instructions: [
      'Add water, ginger, and all spices to a pot. Bring to boil.',
      'Reduce heat, add tea leaves and simmer for 3 minutes.',
      'Add milk and sugar, bring to boil again.',
      'Strain into cups and serve hot.',
    ],
    relatedProductIds: [10, 11], // Cardamom, Cinnamon
  },
];
