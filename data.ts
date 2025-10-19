import { Product, User, Order, Testimonial, BlogPost } from './types';
import { PLACEHOLDER_IMAGES } from './constants';

const PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGES.PRODUCT;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Himalayan Saffron',
    description: 'The finest, hand-picked saffron from the valleys of Kashmir. Known for its deep red color, strong aroma, and rich flavor. Perfect for biryanis, desserts, and milk-based sweets.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'],
    category: 'Spices',
    variants: [
      { id: 101, name: '1g', price: 15.99, salePrice: 12.99, stock: 15 },
      { id: 102, name: '5g', price: 65.99, stock: 8 },
    ],
    reviews: [
      { id: 1, author: 'Priya K.', rating: 5, comment: 'Absolutely divine! The aroma filled my kitchen. Best saffron I have ever used.', verifiedPurchase: true },
      { id: 2, author: 'Raj S.', rating: 5, comment: 'Top quality product. Worth every penny.', verifiedPurchase: true },
    ],
    qna: [{ id: 1, author: 'Amit', question: 'Is this Grade A saffron?', answer: 'Yes, this is Grade A Mongra saffron, which is the highest quality available.' }],
    nutrition: [{ key: 'Rich in', value: 'Antioxidants' }],
    origin: 'Kashmir, India',
    tags: ['Premium', 'Aromatic'],
  },
  {
    id: 2,
    name: 'Malabar Black Pepper',
    description: 'Bold and pungent Tellicherry peppercorns from the Malabar Coast of Kerala. Sun-dried and hand-sorted to ensure only the best make it to your table.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Spices',
    variants: [{ id: 201, name: '250g', price: 8.99, stock: 30 }],
    reviews: [{ id: 3, author: 'Chef Maria', rating: 5, comment: 'As a chef, I can tell the difference. This is the real deal.', verifiedPurchase: false }],
    origin: 'Kerala, India',
    tags: ['Single-Origin'],
  },
  {
    id: 3,
    name: 'Kashmiri Almonds',
    description: 'Sweet, nutrient-rich Mamra almonds from the Kashmir valley. They are smaller than their Californian counterparts but packed with more flavor and natural oils.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Nuts',
    variants: [
        { id: 301, name: '500g', price: 22.50, stock: 20 },
        { id: 302, name: '1kg', price: 40.00, stock: 10 }
    ],
    reviews: [{ id: 4, author: 'Anjali P.', rating: 5, comment: 'So delicious and crunchy. You can taste the quality.', verifiedPurchase: true }],
    nutrition: [{ key: 'High in', value: 'Vitamin E & Protein' }],
    origin: 'Kashmir, India',
    tags: ['Premium', 'Gluten-Free'],
  },
   {
    id: 4,
    name: 'Organic Turmeric Powder',
    description: 'Vibrant, earthy, and potent turmeric powder with high curcumin content, sourced from organic farms in Andhra Pradesh. A staple for curries and a healthy boost for lattes.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Spices',
    variants: [{ id: 401, name: '200g', price: 6.99, stock: 5 }],
    reviews: [
      { id: 5, author: 'John D.', rating: 5, comment: 'The color and smell are so much richer than store-bought turmeric. Excellent!', verifiedPurchase: true },
      { id: 6, author: 'Emily R.', rating: 4, comment: 'Great product, makes a wonderful turmeric latte.', verifiedPurchase: true },
    ],
    nutrition: [{ key: 'High in', value: 'Curcumin' }],
    origin: 'Andhra Pradesh, India',
    tags: ['Organic', 'Gluten-Free'],
  },
  {
    id: 5,
    name: 'Darjeeling First Flush Tea',
    description: 'The "Champagne of Teas" from the first harvest of the season in Darjeeling. This tea has a light, floral aroma with a hint of astringency and a muscatel finish.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Beverages',
    variants: [{ id: 501, name: '100g', price: 19.99, salePrice: 17.50, stock: 25 }],
    reviews: [{ id: 7, author: 'Sophie L.', rating: 5, comment: 'An exquisite tea. Delicate and so refreshing.', verifiedPurchase: true }],
    origin: 'Darjeeling, India',
    tags: ['Premium', 'Single-Origin'],
  },
  {
    id: 6,
    name: 'Gourmet Garam Masala',
    description: 'Our signature blend of 12 aromatic spices, including cinnamon, cardamom, and cloves, roasted and ground in small batches for the perfect, balanced flavor profile.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Spices',
    variants: [{ id: 601, name: '100g', price: 9.50, stock: 40 }],
    reviews: [{ id: 8, author: 'David C.', rating: 5, comment: 'This has elevated my home cooking. I put it in everything!', verifiedPurchase: true }],
    qna: [{id: 2, author: 'Lisa', question: 'Is this very spicy/hot?', answer: 'Our Garam Masala is aromatic and flavorful, not primarily hot. The heat level is mild.'}],
    tags: ['Aromatic', 'House Blend'],
  },
  {
    id: 7,
    name: 'Organic Dried Apricots',
    description: 'Sun-dried, unsulphured apricots from Ladakh. These are naturally sweet, chewy, and packed with fiber and vitamins. A perfect healthy snack.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Dry Fruits',
    variants: [{ id: 701, name: '400g', price: 14.00, stock: 18 }],
    reviews: [],
    origin: 'Ladakh, India',
    tags: ['Organic', 'Gluten-Free'],
  },
  {
    id: 8,
    name: 'Goan Cashew Nuts',
    description: 'Large, creamy, and crunchy W240 grade cashew nuts from the sunny orchards of Goa. Perfectly roasted and lightly salted to bring out their natural sweetness.',
    images: [
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE,
    ],
    category: 'Nuts',
    variants: [
      { id: 801, name: '250g', price: 11.99, stock: 0 },
      { id: 802, name: '500g', price: 20.99, stock: 0 },
    ],
    reviews: [{ id: 9, author: 'Michael B.', rating: 5, comment: 'Best cashews I have ever had. So fresh and crunchy.', verifiedPurchase: true }],
    origin: 'Goa, India',
    tags: ['Premium'],
  },
];

export const MOCK_USER: User = {
  id: 1,
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  isAdmin: true,
  addresses: [
    { id: 1, type: 'Shipping', street: '42, Lotus Boulevard', city: 'Mumbai', state: 'MH', zip: '400001', country: 'India', isDefault: true },
    { id: 2, type: 'Billing', street: '15, Park Avenue', city: 'Delhi', state: 'DL', zip: '110001', country: 'India' },
  ]
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
        shippingCost: 5.00,
    },
    {
        id: 'TC1002-2024',
        date: '2024-06-01T14:30:00Z',
        items: [
            { product: MOCK_PRODUCTS[4], selectedVariant: MOCK_PRODUCTS[4].variants[0], quantity: 1 },
        ],
        total: 22.50,
        status: 'Shipped',
        shippingAddress: MOCK_USER.addresses[0],
        billingAddress: MOCK_USER.addresses[0],
        deliveryMethod: 'Standard',
        paymentMethod: 'PayPal',
        shippingCost: 5.00,
    }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: 1, name: 'Aarav Chen', quote: 'Tattva Co. has completely transformed my cooking. The freshness and quality of the spices are unparalleled.', rating: 5 },
    { id: 2, name: 'Isabelle Rodriguez', quote: 'I ordered the Himalayan Saffron and it was magical. The packaging is beautiful and the product is even better. Highly recommend!', rating: 5 },
    { id: 3, name: 'Ben Carter', quote: 'Fast shipping and incredible customer service. The Malabar Pepper has a kick I haven\'t found anywhere else.', rating: 4 },
];

const BLOG_PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGES.BLOG;

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'the-secret-to-perfect-biryani',
    title: 'The Secret to Perfect Biryani: It\'s All in the Saffron',
    author: 'Anika Sharma',
    date: 'July 15, 2024',
  image: BLOG_PLACEHOLDER_IMAGE,
    excerpt: 'Unlock the secrets to a truly aromatic and flavorful biryani. We dive deep into why high-quality saffron, like our Himalayan variety, is the game-changer you need in your kitchen.',
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
  image: BLOG_PLACEHOLDER_IMAGE,
    excerpt: 'Think all pepper is the same? Think again. We explore the bold, complex flavors of Tellicherry peppercorns from the Malabar Coast and why they deserve a prime spot in your spice rack.',
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
    totalRevenue: 12543.50,
    totalOrders: 320,
    uniqueCustomers: 180,
    salesData: [
        { name: 'Jan', sales: 1200 },
        { name: 'Feb', sales: 1800 },
        { name: 'Mar', sales: 1500 },
        { name: 'Apr', sales: 2500 },
        { name: 'May', sales: 2100 },
        { name: 'Jun', sales: 3443.50 },
    ]
};
