/**
 * Generate product images via DALL-E 2 and save to public/images/products/
 *
 * Usage:
 *   node scripts/generate-product-images.mjs
 *   node scripts/generate-product-images.mjs --id 1,2,3   (specific products)
 *   node scripts/generate-product-images.mjs --overwrite   (regenerate existing)
 *
 * Requires: OPENAI_API_KEY in .env
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env manually (no dotenv dependency needed)
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...vals] = line.split('=');
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    });
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌  OPENAI_API_KEY not set in .env');
  process.exit(1);
}

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'products');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// All products with name, category, description snippet for prompt building
const PRODUCTS = [
  { id: 1,  name: 'Himalayan Saffron (Kesar)',           category: 'Spice', slug: 'saffron-kesar',           desc: 'deep crimson saffron strands, Mongra grade, from Kashmir' },
  { id: 2,  name: 'Malabar Black Pepper (Kali Mirch)',   category: 'Spice', slug: 'black-pepper',             desc: 'sun-dried Malabar black peppercorns, bold and aromatic' },
  { id: 3,  name: 'California Almonds (Badam)',          category: 'Nut',   slug: 'almonds-badam',            desc: 'premium California almonds, whole unpolished, Nonpareil grade' },
  { id: 4,  name: 'Salem Turmeric Powder (Haldi)',       category: 'Spice', slug: 'turmeric-powder',          desc: 'deep golden turmeric powder, high curcumin, from Salem Tamil Nadu' },
  { id: 5,  name: 'Royal Assam Kadak Chai',              category: 'Tea',   slug: 'assam-chai',               desc: 'dark malty CTC tea granules, strong Assam brew, amber color' },
  { id: 8,  name: 'Goan Cashew Nuts (Kaju)',             category: 'Nut',   slug: 'cashew-kaju',              desc: 'large ivory whole cashew nuts, W240 grade, from Goa' },
  { id: 10, name: 'Coorg Green Cardamom (Elaichi)',      category: 'Spice', slug: 'cardamom-elaichi',         desc: 'vibrant green cardamom pods, extra bold 8mm, from Coorg hills' },
  { id: 11, name: 'Cinnamon Bark (Dalchini)',            category: 'Spice', slug: 'cinnamon-dalchini',        desc: 'hand-rolled true cinnamon quills, Alba grade, from Sri Lanka' },
  { id: 12, name: 'Mathania Red Chilli Powder',          category: 'Spice', slug: 'red-chilli-powder',        desc: 'vibrant red Mathania chilli powder from Jodhpur, rich color' },
  { id: 13, name: 'Whole Coriander Seeds (Dhaniya)',     category: 'Spice', slug: 'coriander-seeds',          desc: 'sun-dried whole coriander seeds, citrusy woody aroma' },
  { id: 14, name: 'Premium Cumin Seeds (Jeera)',         category: 'Spice', slug: 'cumin-seeds',              desc: 'clean whole cumin seeds, nutty earthy aroma, from Gujarat' },
  { id: 15, name: 'Fennel Seeds (Saunf)',                category: 'Spice', slug: 'fennel-seeds',             desc: 'vibrant green Lucknowi fennel seeds, naturally sweet anise flavor' },
  { id: 18, name: 'Small Mustard Seeds (Rai)',           category: 'Spice', slug: 'mustard-seeds-rai',        desc: 'tiny black mustard seeds for tempering, from Rajasthan' },
  { id: 19, name: 'Fenugreek Seeds (Methi Dana)',        category: 'Spice', slug: 'fenugreek-seeds',          desc: 'golden fenugreek seeds, bold grade, subtle maple-like aroma' },
  { id: 22, name: 'Premium Pistachios (Pista)',          category: 'Nut',   slug: 'pistachios-pista',         desc: 'Akbari pistachios, naturally open shells, vibrant green kernels' },
  { id: 23, name: 'Premium Walnut Kernels (Akhrot)',     category: 'Nut',   slug: 'walnuts-akhrot',           desc: 'light butterfly walnut halves, Kashmiri, Omega-3 rich' },
  { id: 24, name: 'Premium Raisins (Kishmish)',          category: 'Dry Fruit', slug: 'raisins-kishmish',     desc: 'plump golden-brown raisins, naturally sweet, juicy' },
  { id: 25, name: 'Dried Figs (Anjeer)',                 category: 'Dry Fruit', slug: 'figs-anjeer',          desc: 'rope-dried figs, chewy and sweet, high fiber' },
  { id: 27, name: 'Premium Chai Masala',                 category: 'Spice', slug: 'chai-masala',             desc: 'aromatic chai masala blend with cardamom, ginger, clove, cinnamon' },
  { id: 28, name: 'Royal Garam Masala',                  category: 'Spice', slug: 'garam-masala',            desc: 'premium 15-spice garam masala blend, dry-roasted whole spices' },
];

function buildPrompt(product) {
  return (
    `Professional e-commerce product photo of ${product.name}. ` +
    `${product.desc}. ` +
    `Shot on a clean white background, soft studio lighting, sharp focus, ` +
    `top-down or 45-degree angle, showing texture and color clearly. ` +
    `Presented in or beside an elegant kraft paper / amber glass jar / wooden bowl. ` +
    `No text, no watermarks. Photorealistic, high quality.`
  );
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    proto.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(product, overwrite) {
  const filename = `${product.slug}-ai.png`;
  const destPath = path.join(OUTPUT_DIR, filename);
  const publicPath = `/images/products/${filename}`;

  if (!overwrite && fs.existsSync(destPath)) {
    console.log(`  ⏭  ${product.name} — already exists, skipping`);
    return publicPath;
  }

  const prompt = buildPrompt(product);
  console.log(`  🎨  Generating: ${product.name}...`);

  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'b64_json',
  });

  const b64 = response.data[0].b64_json;
  fs.writeFileSync(destPath, Buffer.from(b64, 'base64'));
  console.log(`  ✅  Saved → public/images/products/${filename}`);
  return publicPath;
}

async function main() {
  const args = process.argv.slice(2);
  const overwrite = args.includes('--overwrite');

  let targetIds = null;
  const idFlag = args.find((a) => a.startsWith('--id=') || a === '--id');
  if (idFlag) {
    const val = idFlag.includes('=') ? idFlag.split('=')[1] : args[args.indexOf('--id') + 1];
    targetIds = new Set(val.split(',').map(Number));
  }

  const products = targetIds
    ? PRODUCTS.filter((p) => targetIds.has(p.id))
    : PRODUCTS;

  console.log(`\n🚀  Generating images for ${products.length} products via DALL-E 2\n`);

  const results = [];

  for (const product of products) {
    try {
      const imagePath = await generateImage(product, overwrite);
      results.push({ id: product.id, name: product.name, path: imagePath });
      // Rate limit: DALL-E 2 allows ~5 req/min on free tier
      await sleep(1500);
    } catch (err) {
      console.error(`  ❌  Failed ${product.name}: ${err.message}`);
      results.push({ id: product.id, name: product.name, path: null, error: err.message });
    }
  }

  console.log('\n📋  Results summary:\n');
  results.forEach((r) => {
    if (r.path) {
      console.log(`  id: ${r.id}  →  images: ['${r.path}']`);
    } else {
      console.log(`  id: ${r.id}  ✗  ${r.error}`);
    }
  });

  // Write a JSON mapping for easy reference
  const mappingPath = path.join(ROOT, 'scripts', 'generated-images-map.json');
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
  console.log(`\n💾  Mapping saved to scripts/generated-images-map.json`);
  console.log('\n✨  Done! Add OPENAI_API_KEY to .env if not already set.\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
