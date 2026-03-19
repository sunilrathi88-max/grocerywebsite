import { Product, User, Order, Testimonial, BlogPost, Recipe } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Himalayan Saffron (Kesar)',
    description:
      'Known as "Red Gold," our Himalayan Saffron is hand-harvested from the pristine valleys of Kashmir. These deep crimson strands (Mongra grade) possess a potent aroma and flavor. Your dishes will taste alive—never bland again.',
    images: ['/images/products/saffron-kesar-front.jpg', '/images/products/saffron-kesar-back.jpg'],
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
    tags: ['Premium', 'Aromatic', 'Organic', 'Indian', 'Middle Eastern', 'Bestseller'],
  },
  {
    id: 2,
    name: 'Malabar Black Pepper (Kali Mirch)',
    description:
      'Sourced directly from the Malabar coast, these bold black peppercorns are sun-dried to preserve their sharp, biting heat and complex citrusy aroma. Rich in piperine for a robust kick. Your dishes will taste alive—never bland again.',
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
    tags: ['Single-Origin', 'Spicy', 'Indian', 'International', 'Bestseller'],
  },
  {
    id: 3,
    name: 'California Almonds (Badam)',
    description:
      'Sourced from the best orchards in California, Tattv Almonds are sweet, crunchy, and packed with healthy fats, protein, and Vitamin E. Perfect for snacking or making rich Badam milk.',
    images: ['/images/products/almonds-badam-front.jpg'],
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
      'The Golden Standard of Purity. Sourced from the Salem region of Tamil Nadu, known for its rich essential oils and high curcumin content. This deep golden-orange powder is pure, healing, and free from artificial colors. Your dishes will taste alive—never bland again.',
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
    tags: ['Organic', 'Gluten-Free', 'Healthy', 'Bestseller'],
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
    id: 8,
    name: 'Goan Cashew Nuts (Kaju)',
    description:
      'Experience the superior taste of Indian cashews. Renowned for their large size, ivory color, and naturally sweet, buttery taste. Expertly processed to ensure they remain whole and crunchy.',
    images: ['/images/products/cashew-kaju-front.png'],
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
    tags: ['Premium', 'Snack', 'Indian', 'Bestseller'],
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
    images: ['/images/products/coriander-seeds-whole.jpg'],
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
    id: 22,
    name: 'Premium Pistachios (Pista)',
    description:
      'Roasted to perfection to bring out their nutty flavor. Bursting with vibrant green kernels inside naturally open shells. A fiber-rich snack that is as delicious as it is healthy.',
    images: ['/images/products/pistachios-pista-front.jpg'],
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
    images: ['/images/products/walnuts-akhrot-front.jpg'],
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
    category: 'Spices',
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
  id: '1',
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
      {
        id: '1-100g',
        productId: 1,
        variantId: 101, // Mock variant ID
        name: 'Organic Turmeric Powder',
        price: 250,
        quantity: 1,
        weight: '100g',
        image:
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        stock: 50,
      },
      {
        id: '2-250g',
        productId: 2,
        variantId: 201, // Mock variant ID
        name: 'Kashmiri Red Chilli',
        price: 350,
        quantity: 2,
        weight: '250g',
        image:
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        stock: 40,
      },
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
      {
        id: '5-50g',
        productId: 5,
        variantId: 501,
        name: 'Kerala Cardamom',
        price: 450,
        quantity: 1,
        weight: '50g',
        image:
          'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80',
        stock: 30,
      },
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

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: 101,
    slug: 'top-5-spices-for-gut-health',
    title: 'Top 5 Spices for Gut Health (With Everyday Indian Recipes)',
    author: 'Dr. Aditi Sharma',
    date: 'March 15, 2025',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Discover which spices can aid digestion and improve your gut microbiome naturally. From turmeric to black pepper, learn how to use them in everyday cooking.',
    content: `
### Why Your Gut Loves Indian Spices

If you grew up around an Indian kitchen, you have already met some of the best “gut supplements” on the planet—they just sit quietly in your masala dabba. Modern research is now validating what our grandparents knew: everyday spices like turmeric, ginger, and cumin can support digestion, microbial balance, and overall gut comfort.

Throughout this guide, you will see gentle CTAs to our own Tattva Co. pantry heroes like Salem Turmeric and Mathania Chilli, so you can actually cook with what you learn.

---

## 1. Turmeric – The Golden Soother

Turmeric is famous for curcumin, a compound with strong anti‑inflammatory and antioxidant properties that may help calm an irritated gut lining and support digestion. Studies suggest curcumin can influence gut microbiota, bile secretion, and even metabolic health when combined with a balanced diet.

For daily use, a high‑curcumin variety like Salem turmeric is particularly valued for colour, aroma, and potential health benefits.

**How to use in real life (simple ideas)**
- Stir ½ teaspoon turmeric into your dal tadka or sabzi base.
- Make a quick “haldi doodh” with milk (or plant milk), black pepper, and a drizzle of honey before bed.
- Add a pinch to your morning warm water with lemon to support digestion and immunity.

> **Upgrade your everyday haldi to our single‑origin [Tattva Co. Salem Turmeric Powder](/product/4)—sun‑dried, low‑heat ground, and packed for maximum colour and aroma.**

---

## 2. Ginger – For Bloating, Nausea, and Slow Digestion

Ginger is the spice you reach for when your stomach feels heavy, gassy, or queasy. It stimulates saliva and digestive juices and may help food move more smoothly through the GI tract. Research also links ginger with reduced nausea and improved gastric motility.

Because ginger warms the system, it pairs beautifully with lentils, vegetables, and even warm beverages.

**Easy ways to add more ginger**
- Start your day with ginger‑infused warm water and a squeeze of lemon.
- Add grated ginger to dal tadka, sambar, or vegetable stir‑fries.
- Brew a post‑meal ginger‑fennel tea to cut heaviness after a rich lunch or dinner.

> **Pair fresh ginger with our [Tattva Co. Salem Turmeric Powder](/product/4) in your khichdi or curries for a gentle but powerful gut‑supportive combo.**

---

## 3. Cumin – The Everyday Digestive

Cumin (jeera) is one of those spices you barely notice—until you skip it and your stomach feels off. Traditional systems use cumin for gas, bloating, and “weak digestion,” and modern research supports its role in stimulating digestive enzymes. It also acts as a carminative, helping reduce gas and discomfort.

**Everyday cumin rituals**
- Boil 1 teaspoon cumin seeds in water, then sip it warm as jeera water after meals.
- Use roasted, ground cumin over chaas, raita, salads, and fruit bowls.
- Temper cumin in ghee for dals and khichdi to make them lighter on the stomach.

> **Make jeera water using our whole [Tattva Co. Cumin Seeds](/product/14), cleaned, graded, and packed to retain volatile oils and flavour.**

---

## 4. Fennel – Cooling Comfort for Acidity and Gas

Fennel seeds (saunf) are that sweet little handful you get after a restaurant meal—and they are more than just a mouth freshener. Fennel contains compounds that relax smooth muscles in the digestive tract, which can ease cramping, gas, and bloating. It also offers mild antimicrobial and carminative benefits that support a balanced gut environment.

**How to bring fennel into your day**
- Keep roasted fennel in a jar on your dining table and chew a teaspoon after meals.
- Brew fennel tea by steeping crushed seeds in hot water for 8–10 minutes.
- Add a pinch to pickles, masala chai, or certain vegetable dishes for gentle sweetness.

> **Try our [Tattva Co. Roasted Fennel (Saunf Mix)](/product/15) as a natural, gut‑friendly mukhwas alternative—no artificial colours or candy bits.**

---

## 5. Black Pepper – The Absorption Booster

Black pepper is not just about heat; piperine, its active compound, can enhance the absorption of key nutrients and phytochemicals like curcumin. It also stimulates digestive enzymes and may support gut microbial diversity when used with fibre‑rich foods.

**Small tweaks that make a big difference**
- Finish soups, eggs, and salads with freshly crushed pepper instead of pre‑ground powder.
- Always pair turmeric with black pepper in curries or golden milk for better curcumin bioavailability.
- Use pepper instead of excess chilli if your gut is sensitive to high heat.

> **For maximum aroma, switch to [Tattva Co. Whole Black Pepper](/product/2), crush fresh just before serving, and experience the difference in flavour and digestion.**

---

## What Science Says About Mixed Spices

Interesting clinical work has looked at what happens when people eat a “typical” mixed‑spice meal. A single serving of curry with spices like cinnamon, ginger, rosemary, black pepper, and cayenne has been shown to shift gut microbial markers within hours. Another study on Indian spice blends found that spiced meals increased gastric emptying and sped up gut transit time compared with non‑spiced meals.

In simple terms: the balanced masala in your curry is already a mini gut‑health formula—when built from clean, high‑quality spices.

> **Build your daily gut‑friendly masala base with [Tattva Co. Salem Turmeric](/product/4), [Whole Cumin Seeds](/product/14), and [Whole Black Pepper](/product/2), then layer in your favourite chillies.**

---

## Simple Gut‑Friendly Indian Meal Idea

A comforting, gut‑friendly plate does not need fancy ingredients. A classic example is moong dal khichdi tempered with ghee, cumin, ginger, turmeric, and a pinch of black pepper, served with a fennel‑jeera chaas. This combination gives you fibre, gentle protein, and the digestive support of five powerful spices in one meal.

> **Recreate this plate at home using [Tattva Co. Salem Turmeric](/product/4), [Cumin Seeds](/product/14), [Black Pepper](/product/2), and [Roasted Fennel](/product/15)—all curated for everyday Ayurvedic cooking.**

---

## FAQs – Spices and Gut Health

### Can these spices replace medical treatment?
No. While spices like turmeric, ginger, and cumin can support digestion, they are not a substitute for professional medical care, especially for conditions like ulcers, IBD, or severe GERD. Always consult your doctor before making major changes.

### How much spice is safe per day?
Most people tolerate 1–2 teaspoons of mixed spices per meal, but tolerance is individual. If you feel burning, pain, or loose motions, reduce the quantity or switch to milder spices like fennel.

### Are whole spices better than powders?
Whole spices retain essential oils longer and give you more control over flavour and freshness. Ground spices are convenient but should be bought in small batches from trusted brands to avoid adulteration.
    `,
    tags: ['Health', 'Ayurveda', 'Digestion'],
    isMarkdown: true,
    faqs: [
      {
        question: 'Can these spices replace medical treatment?',
        answer:
          'No. While spices like turmeric, ginger, and cumin can support digestion, they are not a substitute for professional medical care. Always consult your doctor.',
      },
      {
        question: 'How much spice is safe per day?',
        answer:
          'Most people tolerate 1–2 teaspoons of mixed spices per meal, but tolerance is individual.',
      },
      {
        question: 'Are whole spices better than powders?',
        answer:
          'Whole spices retain essential oils longer and give you more control over flavour and freshness.',
      },
    ],
  },
  {
    id: 102,
    slug: 'premium-spice-brands-comparison-2025',
    title: "Premium Gourmet Spice Brands of India: The Complete Buyer's Guide (2025)",
    author: 'Tattva Co. Team',
    date: 'Jan 25, 2025',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'This comprehensive guide breaks down the top premium and gourmet spice brands of India—comparing their sourcing practices, certifications, unique positioning, and pricing.',
    tags: ['Premium Spices', 'Guide', 'Buying Guide'],
    isMarkdown: true,
    content: `
## Why Premium Spices Are Worth It

If you love cooking Indian food, the difference between “good” and “unforgettable” often comes down to the quality of your spices. Premium brands focus on cleaner sourcing, better processing, and fresher packaging, which means more flavour, colour, and aroma per pinch—and fewer worries about adulteration.

This guide will help you decode what “premium” actually means and how Tattva Co. fits into that landscape with products like Salem Turmeric and Mathania Chilli.

---

## What Makes a Spice Brand “Premium”?

Premium is more than fancy labels. Here are the pillars you should look for when you evaluate any brand online or offline.

- **Source transparency:** Single‑origin or region‑specific claims (Salem turmeric, Mathania chilli, Lakadong turmeric) suggest traceability and terroir‑driven flavour.
- **Purity and testing:** Look for FSSAI licences, ISO systems, organic or residue‑free certifications, and mention of lab testing for contaminants.
- **Processing quality:** Low‑temperature grinding, hygienic plants, and minimal hand‑contamination help preserve volatile oils and prevent mould or off‑flavours.
- **Packaging:** Light‑proof, airtight packaging slows oxidation so your masala does not die in two months.

> **At [Tattva Co.](/), we apply these same principles—small‑batch sourcing, careful cleaning, and protective packaging—across our [Salem Turmeric](/product/4), [Mathania Chilli](/product/12), and other whole‑spice lines.**

---

## Spotlight on Salem Turmeric and Mathania Chilli

### Salem Turmeric – High‑Curcumin, High Colour
Salem in Tamil Nadu is known for turmeric with rich colour and good curcumin content, which gives you deeper flavour and stronger “golden” tones in gravies. High‑quality Salem turmeric is valued for its potential health properties and is widely used in Ayurvedic and everyday cooking.

> **Choose [Tattva Co. Salem Turmeric Powder](/product/4) for your daily curries, golden milk, and pickles when you want vibrant colour and clean, single‑origin sourcing.**

### Mathania Chilli – Rajasthan’s Culinary Jewel
Mathania chilli comes from a small region near Jodhpur and is loved for its bright red colour, flavour‑forward profile, and relatively moderate heat. It gives dishes like Laal Maas their signature deep red hue without overpowering them with harsh spiciness.

> **If you want that authentic Rajasthani look and layered heat, reach for [Tattva Co. Mathania Chilli](/product/12) (Whole & Powder) in your tadkas, marinades, and Laal Maas.**

---

## Types of Spice Brands You’ll See in India (2025)

| Segment | Typical examples | What they’re good at |
| --- | --- | --- |
| Legacy household brands | MDH, Everest, Tata Sampann, Badshah | Familiar flavours, strong distribution, budget‑friendly |
| Export/B2B manufacturers | Eastern, Ramdev, others in industry guides | Bulk supply, certifications, consistent batches |
| Regional specialists | MTR, Pravin, local masala houses | Authentic regional blends, strong local loyalty |
| Gourmet/single‑origin brands | Salem‑ and Mathania‑focused labels and similar | Story‑driven sourcing, high aroma, whole‑spice quality |

> **[Tattva Co.](/) sits in the gourmet/single‑origin space—focused on carefully sourced Indian staples like Salem Turmeric, Mathania Chilli, and premium whole spices for home cooks who care about both flavour and purity.**

---

## How to Choose the Right Brand for Your Kitchen

Instead of hunting for a single “best” brand, match the brand to your needs.

- **Cook daily for a family and want predictable taste?** A trusted national brand for some blends plus a few premium single‑origin spices is a great combo.
- **Love experimenting and hosting?** Invest in gourmet whole spices and region‑specific chillies for signature dishes.
- **Run a cafe or cloud kitchen?** Look at export‑oriented or B2B suppliers for bulk staples, and add a few hero products like Mathania chilli for speciality menu items.

> **Use [Tattva Co. Salem Turmeric](/product/4) for all‑purpose cooking, and [Tattva Co. Mathania Chilli](/product/12) when you specifically want rich colour and Rajasthani character.**

---

## How to Spot Genuine Premium Quality (Online and Offline)

When you’re scrolling through listings, this quick checklist helps you avoid flashy but low‑grade masalas.

- **Region and variety clearly mentioned:** “Salem Turmeric,” “Mathania Chilli,” etc.
- **Lab testing and certifications** noted in the description or images.
- **Whole spices look clean**, well‑dried, with strong aroma and natural colour (not neon).
- **Reasonable pricing:** real single‑origin spices cost more than generic masala, but they should not be unrealistically cheap or wildly overpriced.

> **Check our product pages for detailed sourcing notes, batch coding, and transparent ingredient lists before you add [Tattva Co. spices](/shop) to your cart.**

---

## FAQs – Buying Premium Indian Spices

### Do I need all my spices to be premium?
Not necessarily. For everyday uses like basic chilli powder in large quantities, a good mid‑range brand is fine. Reserve premium options like Salem Turmeric or Mathania Chilli for dishes where flavour and colour really matter.

### Are single‑origin spices always better?
Single‑origin does not automatically mean higher quality, but it usually signals better traceability and a clearer flavour profile. Always cross‑check reviews, aroma, and packaging.

### How should I store premium spices?
Store them in airtight containers away from heat, light, and moisture to protect essential oils and colour. Ground spices benefit from being bought in smaller packs and used within a few months.

### Why are Mathania chillies so expensive?
Mathania is a relatively small growing region, with labour‑intensive sun‑drying and grading practices, and demand from chefs and exporters keeps prices high. You are paying for rarity, colour, and a very specific flavour profile.
    `,
    faqs: [
      {
        question: 'Do I need all my spices to be premium?',
        answer:
          'Not necessarily. Reserve premium options for dishes where flavour and colour really matter.',
      },
      {
        question: 'Are single-origin spices always better?',
        answer:
          'Usually signals better traceability and a clearer flavour profile, but check reviews.',
      },
      {
        question: 'How should I store premium spices?',
        answer: 'Airtight containers away from heat, light, and moisture.',
      },
      {
        question: 'Why are Mathania chillies so expensive?',
        answer:
          'Due to labour-intensive sun-drying, grading practices, and demand for its rarity and specific flavour.',
      },
    ],
  },
  {
    id: 103,
    slug: 'restaurant-style-biryani-secret',
    title: 'The Secret to Restaurant-Style Biryani (Hint: It’s Not Just the Rice)',
    author: 'Chef Anjali D.',
    date: 'Jan 15, 2025',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
    excerpt:
      'It’s not just about the rice. The secret lies in the "Dum" technique and the layering of whole spices. Learn how to master it at home.',
    tags: ['Recipe', 'Cooking Tips', 'Biryani'],
    isMarkdown: true,
    content: `
### The Art of Dum Biryani

Most home cooks struggle to get that distinctive aroma that hits you when you open a clay pot of biryani at a fine dining restaurant. The secret isn't MSG—it's high-quality whole spices infused into the fat *before* the meat/vegetables are added, and the slow "Dum" cooking process that traps every molecule of flavor.

---

## Secret 1: The "Dum" Technique (Steam Cooking)

"Dum Pukht" literally means "choked steam." By sealing the pot with dough or a heavy lid, you create a high-pressure environment where the meat cooks in its own juices and the rice absorbs the aromatic steam. This prevents the delicate top layer of saffron rice from drying out while the bottom layer creates a delicious crust.

**How to do it at home:**
- Use a heavy-bottomed pot (Dutch oven or heavy steel/copper handi).
- Seal the lid with wheat dough (atta) or use a tight-fitting lid with a weight on top.
- Cook on the lowest flame for the final 20 minutes.

---

## Secret 2: The Whole Spice Infusion

Restaurant biryani uses a "Potli Masala" (spice bag) or whole spices fried in ghee. You cannot get this depth of flavor from powder alone. The oil/ghee extracts the essential oils from the spices, which then coat every grain of rice.

**Key Spices You Need:**
- **Shahi Jeera (Caraway Seeds):** Essential for that earthy, royal scent.
- **Whole Cardamom & Cloves:** Provide the floral high notes.
- **Cinnamon Bark:** For sweet, woody warmth.
- **Mace (Javitri) & Nutmeg:** The "secret weapons" of Mughlai cuisine.

> **Start with a base of [Tattva Co. Whole Cumin](/product/14) and crushed [Green Cardamom](/product/10) to mimic the restaurant flavor profile.**

---

## Secret 3: The Saffron Milk Finish

That beautiful gradient of yellow and orange rice? It comes from high-quality Saffron (Kesar). Never throw dry saffron strands on top. Always bloom them in warm milk for 20 minutes to release the "Crocin" (color) and "Safranal" (aroma).

**Pro Tip:** Add a few drops of rose water or kewra water to the saffron milk for that wedding-banquet aroma.

> **Our [Himalayan Saffron (Kesar)](/product/1) is Grade A Mongra, meaning you only need a few strands for a potent color and smell.**

---

## Recipe: Simplified Chicken Dum Biryani

**Ingredients:**
- 500g Chicken, marinated
- 2 cups Basmati Rice (70% par-cooked)
- 1/2 cup Fried Onions (Birista)
- 2 tbsp Ghee
- **Whole Spices:** Bay leaf, [Cinnamon](/product/11), [Cardamom](/product/10), Cloves

**Instructions:**
1. **Marinate:** Mix chicken with yogurt, ginger-garlic paste, red chilli powder, and salt. Let it sit for 2 hours.
2. **Layer:** Place marinated chicken at the bottom of a heavy pot.
3. **Rice:** Spread the 70% cooked rice over the chicken. Do not press it down.
4. **Garnish:** Sprinkle fried onions, mint leaves, and pour the saffron milk over the rice.
5. **Dum:** Seal the pot and cook on high for 5 mins, then low for 20 mins. Rest for 10 mins before opening.

> **For the marinade, use our [Jodhpuri Mathania Chilli Powder](/product/12) for a vibrant red color without excessive heat.**

---

## FAQs – Biryani Mastery

### Which rice is best for Biryani?
Always use "Extra Long Grain" or "aged" Basmati rice. Aged rice absorbs flavors better and doesn't turn mushy.

### Can I make this Vegetarian?
Absolutely. Replace chicken with mixed vegetables (cauliflower, carrot, beans) or Paneer. The spice layering technique remains exactly the same.

### Why is my rice breaking?
You likely overcooked it before the Dum stage. Boil the rice only until it is 70% done (still has a "bite" in the center). It will finish cooking in the steam.
    `,
    faqs: [
      {
        question: 'Which rice is best for Biryani?',
        answer: 'Use Extra Long Grain or aged Basmati rice for better absorption and texture.',
      },
      {
        question: 'Can I make this Vegetarian?',
        answer: 'Yes, substitute meat with mixed vegetables or Paneer; the technique is the same.',
      },
      {
        question: 'Why is my rice breaking?',
        answer: 'Avoid overcooking before the Dum stage; rice should be only 70% cooked initially.',
      },
    ],
  },
  {
    id: 104,
    slug: 'fake-turmeric-warning',
    title: 'Why "Supermarket Turmeric" Might Be Fake',
    author: 'Suresh R., Agronomist',
    date: 'Jan 10, 2025',
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    excerpt:
      'Lead chromate is often used to give stale turmeric a bright yellow color. Here is a simple water test you can do at home to check for purity.',
    tags: ['Education', 'Food Safety', 'Turmeric'],
    isMarkdown: false,
    content: `
        <h2>The Adulteration Crisis</h2>
        <p>Recent reliable studies have shown high levels of lead in commodity turmeric sold in loose markets. The bright yellow color often comes from *Lead Chromate*, a neurotoxin, rather than high heavy Curcumin content.</p>
        <h3>The Water Test</h3>
        <p>Mix a teaspoon of turmeric in warm water. If it settles calmly and leaves clear yellow water, it's likely pure. If it turns dark cloudy instantly, proceed with caution.</p>
        `,
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
