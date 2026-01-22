import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MOCK DATA (Copied from data.ts to avoid TypeScript compilation issues)
const MOCK_PRODUCTS = [
  {
    name: 'Himalayan Saffron (Kesar)',
    description:
      'Known as "Red Gold," our Himalayan Saffron is hand-harvested from the pristine valleys of Kashmir. These deep crimson strands (Mongra grade) possess a potent aroma and flavor. Your dishes will taste alive—never bland again.',
    images: ['/images/products/saffron-kesar-front.jpg', '/images/products/saffron-kesar-back.jpg'],
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'],
    category: 'Spices',
    variants: [
      { name: '1g', price: 300, stock: 15 },
      { name: '5g', price: 1500, stock: 8 },
    ],
    reviews: [
      {
        author: 'Priya K.',
        rating: 5,
        comment: 'Absolutely divine! The aroma filled my kitchen. Best saffron I have ever used.',
        verifiedPurchase: true,
        date: '2023-10-15',
        helpful: 12,
      },
      {
        author: 'Raj S.',
        rating: 5,
        comment: 'Top quality product. Worth every penny.',
        verifiedPurchase: true,
      },
    ],
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
    name: 'Malabar Black Pepper (Kali Mirch)',
    description:
      'Sourced directly from the Malabar coast, these bold black peppercorns are sun-dried to preserve their sharp, biting heat and complex citrusy aroma. Rich in piperine for a robust kick. Your dishes will taste alive—never bland again.',
    images: ['/images/products/tattv-malabar-black-pepper-front.png'],
    category: 'Spices',
    variants: [{ name: '250g', price: 300, stock: 30 }],
    reviews: [
      {
        author: 'Chef Maria',
        rating: 5,
        comment: 'As a chef, I can tell the difference. This is the real deal.',
        verifiedPurchase: false,
      },
    ],
    origin: 'Kerala, India',
    harvestDate: 'January 2025',
    grade: 'TGSEB',
    purityTest: 'Pesticide Free',
    storage: 'Airtight container',
    shelfLife: '18 Months',
    grind: 'Whole',
    tags: ['Single-Origin', 'Spicy', 'Indian', 'International', 'Bestseller'],
  },
  {
    name: 'California Almonds (Badam)',
    description:
      'Sourced from the best orchards in California, Tattv Almonds are sweet, crunchy, and packed with healthy fats, protein, and Vitamin E. Perfect for snacking or making rich Badam milk.',
    images: ['/images/products/almonds-badam-front.jpg'],
    category: 'Nuts',
    variants: [
      { name: '500g', price: 500, stock: 20 },
      { name: '1kg', price: 1000, stock: 10 },
    ],
    reviews: [
      {
        author: 'Anjali P.',
        rating: 5,
        comment: 'So delicious and crunchy. You can taste the quality.',
        verifiedPurchase: true,
      },
    ],
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
    name: 'Salem Turmeric Powder (Haldi)',
    description:
      'The Golden Standard of Purity. Sourced from the Salem region of Tamil Nadu, known for its rich essential oils and high curcumin content. This deep golden-orange powder is pure, healing, and free from artificial colors. Your dishes will taste alive—never bland again.',
    images: [
      '/images/products/turmeric-powder-front.jpg',
      '/images/products/turmeric-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { name: '200g', price: 100, stock: 5 },
      { name: '500g', price: 220, stock: 5 },
    ],
    reviews: [
      {
        author: 'John D.',
        rating: 5,
        comment: 'The color and smell are so much richer than store-bought turmeric. Excellent!',
        verifiedPurchase: true,
      },
      {
        author: 'Emily R.',
        rating: 4,
        comment: 'Great product, makes a wonderful turmeric latte.',
        verifiedPurchase: true,
      },
    ],
    origin: 'Salem, Tamil Nadu',
    harvestDate: 'February 2025',
    grade: 'High Curcumin (5%+)',
    purityTest: 'Certified Organic',
    storage: 'Cool, dark place',
    shelfLife: '12 Months',
    tags: ['Organic', 'Gluten-Free', 'Healthy', 'Bestseller'],
  },
  {
    name: 'Royal Assam Kadak Chai',
    description:
      'For those who love their tea strong and bold. A blend of premium CTC granules that brews a dark, malty cup with a rich amber color. Delivers the authentic "Kadak" taste of India.',
    images: [
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Beverages',
    variants: [{ name: '500g', price: 300, stock: 25 }],
    reviews: [
      {
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
    name: 'Goan Cashew Nuts (Kaju)',
    description:
      'Experience the superior taste of Indian cashews. Renowned for their large size, ivory color, and naturally sweet, buttery taste. Expertly processed to ensure they remain whole and crunchy.',
    images: ['/images/products/cashew-kaju-front.png'],
    category: 'Nuts',
    variants: [
      { name: '250g', price: 350, stock: 0 },
      { name: '500g', price: 700, stock: 0 },
    ],
    reviews: [
      {
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
    name: 'Coorg Green Cardamom (Elaichi)',
    description:
      'Grown in the misty hills of Coorg, handpicked at peak ripeness. Bursting with sweet, floral notes and refreshing menthol undertones. Essential for Masala Chai and rich desserts.',
    images: ['/images/products/tattv-coorg-green-cardamom-front.jpg'],
    category: 'Spices',
    variants: [{ name: '50g', price: 250, stock: 30 }],
    origin: 'Coorg, Karnataka',
    harvestDate: 'October 2024',
    grade: 'Extra Bold (8mm+)',
    purityTest: 'Unadulterated',
    storage: 'Airtight container',
    shelfLife: '24 Months',
    tags: ['Aromatic', 'Baking', 'Chai'],
  },
  {
    name: 'Cinnamon Bark (Dalchini)',
    description:
      'Provides a warm, sweet-spicy flavor profile. Perfect for steeping in tea, adding to rice pilafs, or grinding into baking spice mixes. Adds natural sweetness without sugar.',
    images: ['/images/products/tattv-cinnamon-bark-front.png'],
    category: 'Spices',
    variants: [{ name: '100g', price: 120, stock: 25 }],
    origin: 'Sri Lanka',
    harvestDate: 'November 2024',
    grade: 'Alba Grade',
    purityTest: 'True Cinnamon',
    storage: 'Cool, dark place',
    shelfLife: '36 Months',
    tags: ['Sweet', 'Baking', 'True Cinnamon'],
  },
  {
    name: 'Jodhpuri Mathania Red Chilli Powder',
    description:
      'Discover the Legend of Mathania. Sourced directly from the arid soils of Jodhpur, this "Red Gold" delivers a unique pungent heat and vibrant color perfect for authentic Rajasthani marinades and curries.',
    images: [
      '/images/products/red-chilli-powder-front.jpg',
      '/images/products/red-chilli-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { name: '200g', price: 120, stock: 60 },
      { name: '500g', price: 250, stock: 60 },
    ],
    origin: 'Jodhpur, Rajasthan',
    harvestDate: 'March 2025',
    grade: 'Mathaniya Laal',
    purityTest: 'No Artificial Colors',
    storage: 'Airtight container',
    shelfLife: '12 Months',
    tags: ['Spicy', 'Essential', 'Indian'],
  },
  {
    name: 'Whole Coriander Seeds (Sabut Dhaniya)',
    description:
      'Light, crisp, and full of citrusy, woody notes. Perfect for dry roasting and grinding fresh at home, or for crushing coarsely into Samosa fillings and pickles.',
    images: ['/images/products/coriander-seeds-whole.jpg'],
    category: 'Spices',
    variants: [{ name: '200g', price: 80, stock: 45 }],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    grade: 'Split (Dal)',
    purityTest: 'Clean & Unpolished',
    storage: 'Cool, dry place',
    shelfLife: '18 Months',
    tags: ['Citrusy', 'Essential', 'Whole'],
  },
  {
    name: 'Premium Cumin Seeds (Jeera)',
    description:
      'Cleaned and sorted to ensure zero dust or stones. They release an intense, nutty, and earthy aroma when tempered in hot oil/ghee. A digestive aid and flavor powerhouse.',
    images: ['/images/products/tattv-cumin-seeds-front.jpg'],
    category: 'Spices',
    variants: [{ name: '200g', price: 120, stock: 50 }],
    origin: 'Gujarat, India',
    harvestDate: 'March 2025',
    grade: 'Singapore Quality',
    purityTest: 'No Adulteration',
    storage: 'Airtight container',
    shelfLife: '24 Months',
    tags: ['Earthy', 'Essential', 'Whole'],
  },
  {
    name: 'Fennel Seeds (Saunf)',
    description:
      'Vibrant green and naturally sweet. Traditionally used as a post-meal digestive and mouth freshener (Mukhwas), they add a subtle anise-like sweetness to curries and pickles.',
    images: ['/images/products/tattv-fennel-seeds-front.jpg'],
    category: 'Spices',
    variants: [{ name: '200g', price: 130, stock: 40 }],
    origin: 'Lucknow, Uttar Pradesh',
    harvestDate: 'April 2025',
    grade: 'Lucknowi',
    purityTest: 'Natural & Clean',
    storage: 'Cool, dry place',
    shelfLife: '18 Months',
    tags: ['Sweet', 'Digestive', 'Mukhwas'],
  },
  {
    name: 'Small Mustard Seeds (Rai)',
    description:
      'Small in size but big on flavor. These seeds pop with a nutty, pungent kick when tempered. Essential for South Indian curries, pickles, and Bengali fish dishes.',
    images: ['/images/products/tattv-mustard-seeds-rai-front.jpg'],
    category: 'Spices',
    variants: [{ name: '200g', price: 60, stock: 60 }],
    origin: 'Rajasthan, India',
    harvestDate: 'March 2025',
    grade: 'Yellow Mustard',
    purityTest: 'Clean & Unpolished',
    storage: 'Airtight container',
    shelfLife: '18 Months',
    tags: ['Pungent', 'Tempering', 'Essential'],
  },
  {
    name: 'Fenugreek Seeds (Methi Dana)',
    description:
      'Known for their maple-like aroma and subtle bitterness. A staple for pickles and Sambars. Rich in fiber and known to support blood sugar health.',
    images: ['/images/products/tattv-fenugreek-seeds-front.png'],
    category: 'Spices',
    variants: [{ name: '200g', price: 60, stock: 40 }],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    grade: 'Bold',
    purityTest: 'Natural & Clean',
    storage: 'Cool, dry place',
    shelfLife: '24 Months',
    tags: ['Bitter', 'Pickling', 'Essential'],
  },
  {
    name: 'Premium Pistachios (Pista)',
    description:
      'Roasted to perfection to bring out their nutty flavor. Bursting with vibrant green kernels inside naturally open shells. A fiber-rich snack that is as delicious as it is healthy.',
    images: ['/images/products/pistachios-pista-front.jpg'],
    category: 'Nuts',
    variants: [{ name: '200g', price: 350, stock: 30 }],
    origin: 'Iran',
    harvestDate: 'September 2024',
    grade: 'Akbari',
    purityTest: 'Naturally Opened',
    storage: 'Airtight container',
    shelfLife: '9 Months',
    tags: ['Snack', 'Roasted', 'Salted'],
  },
  {
    name: 'Premium Walnut Kernels (Akhrot)',
    description:
      'Fresh, earthy, and mildly bitter-sweet. Shelled carefully to keep the butterfly halves intact. Rich in Omega-3 fatty acids, the ultimate brain food.',
    images: ['/images/products/walnuts-akhrot-front.jpg'],
    category: 'Nuts',
    variants: [{ name: '500g', price: 500, stock: 20 }],
    origin: 'Kashmir, India',
    harvestDate: 'October 2024',
    grade: 'Light Halves',
    purityTest: 'No Shell Fragments',
    storage: 'Refrigerate',
    shelfLife: '12 Months',
    tags: ['Healthy', 'Baking', 'Snack'],
  },
  {
    name: 'Premium Raisins (Kishmish)',
    description:
      'Dried to a golden-brown perfection. Plump, juicy, and naturally sweet. Perfect for adding to Kheer, Pulao, or eating by the handful for an instant energy boost.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ name: '500g', price: 350, stock: 50 }],
    tags: ['Sweet', 'Snack', 'Natural'],
  },
  {
    name: 'Dried Figs (Anjeer)',
    description:
      'Rope dried to concentrate their sweetness and form a chewy, seed-filled texture. Known for high fiber and calcium content, a delicious natural treat.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Dry Fruits',
    variants: [{ name: '250g', price: 399, stock: 30 }],
    tags: ['Sweet', 'Healthy', 'Snack'],
  },
  {
    name: 'Premium Chai Masala',
    description:
      'The Soul of Your Morning Cup. A natural blend dominated by premium Green Cardamom and dry Ginger, balanced with Clove and Cinnamon. No sugar, no fillers—just 100% pure aromatic spices.',
    images: ['/images/products/chai-masala-front.jpg', '/images/products/chai-masala-back.jpg'],
    category: 'Spices',
    variants: [{ name: '100g', price: 200, stock: 40 }],
    tags: ['Tea', 'Spiced', 'Ritual'],
    origin: 'Kerala, India',
    storage: 'Airtight container',
  },
  {
    name: 'Royal Garam Masala',
    description:
      'A Symphony of Spices. A premium blend of 15+ dry-roasted whole spices, including Cardamom and Mace. Just a pinch at the end of cooking transforms a simple dish into a gourmet feast.',
    images: ['/images/products/garam-masala-front.jpg', '/images/products/garam-masala-back.jpg'],
    category: 'Spices',
    variants: [{ name: '100g', price: 220, stock: 35 }],
    tags: ['Blend', 'Essential', 'Aromatic'],
    origin: 'India (House Blend)',
  },
  {
    name: 'Organic Coriander Powder (Dhaniya)',
    description:
      'Freshness You Can Smell. Stone-ground from organic coriander seeds to preserve the volatile oils responsible for that citrusy aroma. The perfect thickener and flavor enhancer for gravies.',
    images: [
      '/images/products/coriander-powder-front.jpg',
      '/images/products/coriander-powder-back.jpg',
    ],
    category: 'Spices',
    variants: [
      { name: '200g', price: 130, stock: 45 },
      { name: '500g', price: 250, stock: 45 },
    ],
    tags: ['Earthy', 'Citrusy', 'Essential'],
    origin: 'Rajasthan, India',
    harvestDate: 'April 2025',
    storage: 'Cool, dry place',
  },
];

async function seed() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      '❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY in .env'
    );
    console.log('   Please make sure your .env file contains these keys.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🌱 Starting Database Seeding...');
  let successCount = 0;
  let failCount = 0;

  for (const product of MOCK_PRODUCTS) {
    // Basic product data without variants/reviews nested
    const productData = {
      name: product.name,
      description: product.description,
      images: product.images,
      // videos: product.videos || [], // Column missing in DB schema
      category: product.category,
      // Price is required by DB, using the first variant's price or a default
      price: product.variants?.[0]?.price || 0,
      origin: product.origin,
      harvest_date: product.harvestDate,
      grade: product.grade,
      purity_test: product.purityTest,
      storage: product.storage,
      shelf_life: product.shelfLife,
      grind: product.grind,
      tags: product.tags || [],
    };

    try {
      // 1. Insert Product
      const { data: newProduct, error: prodError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (prodError) {
        throw new Error(prodError.message);
      }

      console.log(`✅ Added: ${newProduct.name} (ID: ${newProduct.id})`);

      // 2. Insert Variants
      if (product.variants && product.variants.length > 0) {
        const variantsData = product.variants.map((v) => ({
          product_id: newProduct.id,
          name: v.name,
          price: v.price,
          stock: v.stock,
        }));

        const { error: varError } = await supabase.from('variants').insert(variantsData);

        if (varError) console.error(`   ⚠️ Failed to add variants: ${varError.message}`);
      }

      // 3. Insert Reviews
      if (product.reviews && product.reviews.length > 0) {
        const reviewsData = product.reviews.map((r) => ({
          product_id: newProduct.id,
          author: r.author,
          rating: r.rating,
          comment: r.comment,
          verified_purchase: r.verifiedPurchase,
          date: r.date || new Date().toISOString(),
          helpful: r.helpful || 0,
        }));

        const { error: revError } = await supabase.from('reviews').insert(reviewsData);

        if (revError) console.error(`   ⚠️ Failed to add reviews: ${revError.message}`);
      }

      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${product.name} - ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n🏁 Seeding Complete. Success: ${successCount}, Failed: ${failCount}`);
}

seed();
