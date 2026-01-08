import { Product, User, Order, Testimonial, BlogPost, Recipe } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Himalayan Saffron (Kesar)',
    description:
      'Known as "Red Gold," our Himalayan Saffron is hand-harvested from the pristine valleys of Kashmir. These deep crimson strands (Mongra grade) possess a potent aroma and flavor.',
    images: [
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    ],
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'],
    category: 'Spices',
    variants: [
      { id: 101, name: '1g', price: 300, stock: 15 },
      { id: 102, name: '5g', price: 1500, stock: 8 },
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
    name: 'Malabar Black Pepper (Kali Mirch)',
    description:
      'Sourced directly from the Malabar coast, these bold black peppercorns are sun-dried to preserve their sharp, biting heat and complex citrusy aroma. Rich in piperine for a robust kick.',
    images: ['/images/products/tattv-malabar-black-pepper-front.png'],
    category: 'Spices',
    variants: [{ id: 201, name: '250g', price: 300, stock: 30 }],
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
    name: 'California Almonds (Badam)',
    description:
      'Sourced from the best orchards in California, Tattv Almonds are sweet, crunchy, and packed with healthy fats, protein, and Vitamin E. Perfect for snacking or making rich Badam milk.',
    images: [
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [
      { id: 301, name: '500g', price: 500, stock: 20 },
      { id: 302, name: '1kg', price: 1000, stock: 10 },
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
    name: 'Salem Turmeric Powder (Haldi)',
    description:
      'The Golden Standard of Purity. Sourced from the Salem region of Tamil Nadu, known for its rich essential oils and high curcumin content. This deep golden-orange powder is pure, healing, and free from artificial colors.',
    images: [
      '/images/products/turmeric-powder-front.jpg',
      '/images/products/turmeric-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { id: 401, name: '200g', price: 100, stock: 5 },
      { id: 402, name: '500g', price: 220, stock: 5 },
    ],
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
    origin: 'Salem, Tamil Nadu',
    harvestDate: 'February 2025',
    grade: 'High Curcumin (5%+)',
    purityTest: 'Certified Organic',
    storage: 'Cool, dark place',
    shelfLife: '12 Months',
    tags: ['Organic', 'Gluten-Free', 'Healthy'],
  },
  {
    id: 5,
    name: 'Royal Assam Kadak Chai',
    description:
      'For those who love their tea strong and bold. A blend of premium CTC granules that brews a dark, malty cup with a rich amber color. Delivers the authentic "Kadak" taste of India.',
    images: [
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Beverages',
    variants: [{ id: 501, name: '500g', price: 300, stock: 25 }],
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
    id: 7,
    name: 'Organic Dried Apricots (Khubani)',
    description:
      'Sun-dried without sulphur treatment to retain their natural amber color. Chewy, sweet, and tangy, they are a perfect guilt-free snack loaded with Vitamin A and antioxidants.',
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
    name: 'Goan Cashew Nuts (Kaju)',
    description:
      'Experience the superior taste of Indian cashews. Renowned for their large size, ivory color, and naturally sweet, buttery taste. Expertly processed to ensure they remain whole and crunchy.',
    images: [
      'https://images.unsplash.com/photo-1536591375315-1988d6960545?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595413667362-722923769976?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [
      { id: 801, name: '250g', price: 350, stock: 0 },
      { id: 802, name: '500g', price: 700, stock: 0 },
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
    id: 10,
    name: 'Coorg Green Cardamom (Elaichi)',
    description:
      'Grown in the misty hills of Coorg, handpicked at peak ripeness. Bursting with sweet, floral notes and refreshing menthol undertones. Essential for Masala Chai and rich desserts.',
    images: ['/images/products/tattv-coorg-green-cardamom-front.jpg'],
    category: 'Spices',
    variants: [{ id: 1001, name: '50g', price: 250, stock: 30 }],
    reviews: [],
    origin: 'Coorg, Karnataka',
    harvestDate: 'October 2024',
    processingMethod: 'Sun-Dried, Whole Pods',
    grade: 'Extra Bold (8mm+)',
    purityTest: 'Unadulterated',
    storage: 'Airtight container',
    shelfLife: '24 Months',
    tags: ['Aromatic', 'Baking', 'Chai'],
  },
  {
    id: 11,
    name: 'Cinnamon Bark (Dalchini)',
    description:
      'Provides a warm, sweet-spicy flavor profile. Perfect for steeping in tea, adding to rice pilafs, or grinding into baking spice mixes. Adds natural sweetness without sugar.',
    images: ['/images/products/tattv-cinnamon-bark-front.png'],
    category: 'Spices',
    variants: [{ id: 1101, name: '100g', price: 120, stock: 25 }],
    reviews: [],
    origin: 'Sri Lanka',
    harvestDate: 'November 2024',
    processingMethod: 'Hand-Rolled Quills',
    grade: 'Alba Grade',
    purityTest: 'True Cinnamon (Cinnamomum Verum)',
    storage: 'Cool, dark place',
    shelfLife: '36 Months',
    tags: ['Sweet', 'Baking', 'True Cinnamon'],
  },
  {
    id: 12,
    name: 'Jodhpuri Mathania Red Chilli Powder',
    description:
      'Discover the Legend of Mathania. Sourced directly from the arid soils of Jodhpur, this "Red Gold" delivers a unique pungent heat and vibrant color perfect for authentic Rajasthani marinades and curries.',
    images: [
      '/images/products/red-chilli-powder-front.jpg',
      '/images/products/red-chilli-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { id: 1201, name: '200g', price: 120, stock: 60 },
      { id: 1202, name: '500g', price: 250, stock: 60 },
    ],
    reviews: [],
    origin: 'Jodhpur, Rajasthan',
    harvestDate: 'March 2025',
    processingMethod: 'Sun-Dried, Stone-Ground',
    grade: 'Mathaniya Laal',
    purityTest: 'No Artificial Colors',
    storage: 'Airtight container',
    shelfLife: '12 Months',
    tags: ['Spicy', 'Essential', 'Indian'],
  },
  {
    id: 13,
    name: 'Whole Coriander Seeds (Sabut Dhaniya)',
    description:
      'Light, crisp, and full of citrusy, woody notes. Perfect for dry roasting and grinding fresh at home, or for crushing coarsely into Samosa fillings and pickles.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Spices',
    variants: [{ id: 1301, name: '200g', price: 80, stock: 45 }],
    reviews: [],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    processingMethod: 'Sun-Dried, Whole',
    grade: 'Split (Dal)',
    purityTest: 'Clean & Unpolished',
    storage: 'Cool, dry place',
    shelfLife: '18 Months',
    tags: ['Citrusy', 'Essential', 'Whole'],
  },
  {
    id: 14,
    name: 'Premium Cumin Seeds (Jeera)',
    description:
      'Cleaned and sorted to ensure zero dust or stones. They release an intense, nutty, and earthy aroma when tempered in hot oil/ghee. A digestive aid and flavor powerhouse.',
    images: ['/images/products/tattv-cumin-seeds-front.jpg'],
    category: 'Spices',
    variants: [{ id: 1401, name: '200g', price: 120, stock: 50 }],
    reviews: [],
    origin: 'Gujarat, India',
    harvestDate: 'March 2025',
    processingMethod: 'Sun-Dried, Whole',
    grade: 'Singapore Quality',
    purityTest: 'No Adulteration',
    storage: 'Airtight container',
    shelfLife: '24 Months',
    tags: ['Earthy', 'Essential', 'Whole'],
  },
  {
    id: 15,
    name: 'Fennel Seeds (Saunf)',
    description:
      'Vibrant green and naturally sweet. Traditionally used as a post-meal digestive and mouth freshener (Mukhwas), they add a subtle anise-like sweetness to curries and pickles.',
    images: ['/images/products/tattv-fennel-seeds-front.jpg'],
    category: 'Spices',
    variants: [{ id: 1501, name: '200g', price: 130, stock: 40 }],
    reviews: [],
    origin: 'Lucknow, Uttar Pradesh',
    harvestDate: 'April 2025',
    processingMethod: 'Sun-Dried, Whole',
    grade: 'Lucknowi',
    purityTest: 'Natural & Clean',
    storage: 'Cool, dry place',
    shelfLife: '18 Months',
    tags: ['Sweet', 'Digestive', 'Mukhwas'],
  },

  {
    id: 18,
    name: 'Small Mustard Seeds (Rai)',
    description:
      'Small in size but big on flavor. These seeds pop with a nutty, pungent kick when tempered. Essential for South Indian curries, pickles, and Bengali fish dishes.',
    images: ['/images/products/tattv-mustard-seeds-rai-front.jpg'],
    category: 'Spices',
    variants: [{ id: 1801, name: '200g', price: 60, stock: 60 }],
    reviews: [],
    origin: 'Rajasthan, India',
    harvestDate: 'March 2025',
    processingMethod: 'Sun-Dried, Whole',
    grade: 'Yellow Mustard',
    purityTest: 'Clean & Unpolished',
    storage: 'Airtight container',
    shelfLife: '18 Months',
    tags: ['Pungent', 'Tempering', 'Essential'],
  },
  {
    id: 19,
    name: 'Fenugreek Seeds (Methi Dana)',
    description:
      'Known for their maple-like aroma and subtle bitterness. A staple for pickles and Sambars. Rich in fiber and known to support blood sugar health.',
    images: ['/images/products/tattv-fenugreek-seeds-front.png'],
    category: 'Spices',
    variants: [{ id: 1901, name: '200g', price: 60, stock: 40 }],
    reviews: [],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    processingMethod: 'Sun-Dried, Whole',
    grade: 'Bold',
    purityTest: 'Natural & Clean',
    storage: 'Cool, dry place',
    shelfLife: '24 Months',
    tags: ['Bitter', 'Pickling', 'Essential'],
  },

  {
    id: 21,
    name: 'Pure Assam Black Tea',
    description:
      'Experience the sophistication of whole leaf tea. Offers a refined, smooth brew with distinct malty notes and a fragrant aroma. Best enjoyed black or with a splash of lemon.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Beverages',
    variants: [{ id: 2101, name: '500g', price: 750, stock: 30 }],
    reviews: [],
    origin: 'Assam, India',
    harvestDate: 'April 2024 (First Flush)',
    processingMethod: 'Orthodox, Hand-Rolled',
    grade: 'FTGFOP1 (Finest Tippy Golden Flowery Orange Pekoe)',
    purityTest: 'Single Estate',
    storage: 'Airtight canister',
    shelfLife: '24 Months',
    tags: ['Tea', 'Morning', 'Premium'],
  },
  {
    id: 22,
    name: 'Premium Pistachios (Pista)',
    description:
      'Roasted to perfection to bring out their nutty flavor. Bursting with vibrant green kernels inside naturally open shells. A fiber-rich snack that is as delicious as it is healthy.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [{ id: 2201, name: '200g', price: 350, stock: 30 }],
    reviews: [],
    origin: 'Iran',
    harvestDate: 'September 2024',
    processingMethod: 'Roasted & Salted',
    grade: 'Akbari',
    purityTest: 'Naturally Opened',
    storage: 'Airtight container',
    shelfLife: '9 Months',
    tags: ['Snack', 'Roasted', 'Salted'],
  },
  {
    id: 23,
    name: 'Premium Walnut Kernels (Akhrot)',
    description:
      'Fresh, earthy, and mildly bitter-sweet. Shelled carefully to keep the butterfly halves intact. Rich in Omega-3 fatty acids, the ultimate brain food.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Nuts',
    variants: [{ id: 2301, name: '500g', price: 500, stock: 20 }],
    reviews: [],
    origin: 'Kashmir, India',
    harvestDate: 'October 2024',
    processingMethod: 'Shelled Halves',
    grade: 'Light Halves',
    purityTest: 'No Shell Fragments',
    storage: 'Refrigerate',
    shelfLife: '12 Months',
    tags: ['Healthy', 'Baking', 'Snack'],
  },
  {
    id: 24,
    name: 'Premium Raisins (Kishmish)',
    description:
      'Dried to a golden-brown perfection. Plump, juicy, and naturally sweet. Perfect for adding to Kheer, Pulao, or eating by the handful for an instant energy boost.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 2401, name: '500g', price: 350, stock: 50 }],
    reviews: [],
    tags: ['Sweet', 'Snack', 'Natural'],
  },
  {
    id: 25,
    name: 'Dried Figs (Anjeer)',
    description:
      'Rope dried to concentrate their sweetness and form a chewy, seed-filled texture. Known for high fiber and calcium content, a delicious natural treat.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ id: 2501, name: '250g', price: 399, stock: 30 }],
    reviews: [],
    tags: ['Sweet', 'Healthy', 'Snack'],
  },

  {
    id: 27,
    name: 'Premium Chai Masala',
    description:
      'The Soul of Your Morning Cup. A natural blend dominated by premium Green Cardamom and dry Ginger, balanced with Clove and Cinnamon. No sugar, no fillers—just 100% pure aromatic spices.',
    images: ['/images/products/chai-masala-front.jpg', '/images/products/chai-masala-back.jpg'],
    category: 'Beverages',
    variants: [{ id: 2701, name: '100g', price: 200, stock: 40 }],
    reviews: [],
    tags: ['Tea', 'Spiced', 'Ritual'],
    origin: 'Kerala, India',
    storage: 'Airtight container',
  },
  {
    id: 28,
    name: 'Royal Garam Masala',
    description:
      'A Symphony of Spices. A premium blend of 15+ dry-roasted whole spices, including Cardamom and Mace. Just a pinch at the end of cooking transforms a simple dish into a gourmet feast.',
    images: ['/images/products/garam-masala-front.jpg', '/images/products/garam-masala-back.jpg'],
    category: 'Spices',
    variants: [{ id: 2801, name: '100g', price: 220, stock: 35 }],
    reviews: [],
    tags: ['Blend', 'Essential', 'Aromatic'],
    origin: 'India (House Blend)',
  },
  {
    id: 29,
    name: 'Organic Coriander Powder (Dhaniya)',
    description:
      'Freshness You Can Smell. Stone-ground from organic coriander seeds to preserve the volatile oils responsible for that citrusy aroma. The perfect thickener and flavor enhancer for gravies.',
    images: [
      '/images/products/coriander-powder-front.jpg',
      '/images/products/coriander-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { id: 2901, name: '200g', price: 130, stock: 45 },
      { id: 2902, name: '500g', price: 250, stock: 45 },
    ],
    reviews: [],
    tags: ['Earthy', 'Citrusy', 'Essential'],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    storage: 'Cool, dry place',
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
