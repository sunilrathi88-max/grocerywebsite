<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tattva Co. - Indian Gourmet Products

A modern, performant e-commerce web application for Indian gourmet products built with React, TypeScript, and Vite.

## ✨ Features

- **Product Catalog**: Browse a curated selection of premium Indian spices, nuts, and beverages
- **Smart Shopping Cart**: Add items to cart with real-time price calculations and quantity management
- **Wishlist**: Save favorite products for later
- **Product Reviews**: Read and submit product reviews with ratings
- **Recipe Integration**: Discover recipes and add ingredients directly to cart
- **Reorder & Subscriptions**: Quick reorder of past purchases and subscription management
- **Inventory & Substitutions**: Smart product substitution suggestions
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Code splitting, lazy loading, and React.memo optimizations

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunilrathi88-max/grocerywebsite.git
   cd grocerywebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local` and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
grocerywebsite/
├── components/          # React components
│   ├── Cart.tsx        # Shopping cart component
│   ├── ProductGrid.tsx # Product listing with grid layout
│   ├── Wishlist.tsx    # Wishlist management
│   ├── Header.tsx      # Site header with navigation
│   ├── Hero.tsx        # Landing page hero section
│   ├── Footer.tsx      # Site footer
│   ├── ProductCard.tsx # Individual product card
│   ├── ProductDetailModal.tsx # Product details modal
│   ├── CategoryFilter.tsx     # Category filtering
│   ├── Testimonials.tsx       # Customer testimonials
│   ├── RecipeToCart.tsx       # Recipe-to-cart feature
│   ├── ReorderSubscription.tsx # Reorder/subscription management
│   ├── InventorySubstitutions.tsx # Product substitutions
│   └── icons/          # SVG icon components
├── data/               # Mock data and data utilities
│   └── mockData.ts     # Product, recipe, and testimonial data
├── hooks/              # Custom React hooks
│   ├── useCart.ts      # Cart state management
│   └── useWishlist.ts  # Wishlist state management
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration

```

## 🏗️ Architecture & Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** (strict mode) - Type safety and better developer experience
- **Vite** - Fast build tool with HMR
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework (via classes)

### Performance Optimizations
- **React.memo** - Prevents unnecessary re-renders in ProductGrid, Cart, and Wishlist
- **Lazy Loading** - ProductDetailModal loads on-demand using React.lazy
- **Code Splitting** - Automatic route-based code splitting via Vite
- **Custom Hooks** - Reusable state logic (useCart, useWishlist)
- **useMemo** - Optimized filtering and calculations

### Development Tools
- **GitHub Actions** - CI/CD pipeline with npm caching
- **ESLint** - Code quality and consistency
- **TypeScript strict mode** - Enhanced type checking

## 🔧 Key Components

### Cart (`components/Cart.tsx`)
Manages shopping cart with quantity controls, price calculations, and checkout flow. Optimized with React.memo.

### ProductGrid (`components/ProductGrid.tsx`)
Displays products in a responsive grid. Memoized to prevent re-renders when parent state changes.

### Wishlist (`components/Wishlist.tsx`)
Allows users to save products for later. Includes quick "add to cart" functionality.

### Custom Hooks

#### `useCart`
Manages cart state with methods:
- `handleAddToCart(product, quantity)` - Add items to cart
- `handleUpdateQuantity(productId, quantity)` - Update item quantities
- `cartItemCount` - Total items in cart

#### `useWishlist`
Manages wishlist state with methods:
- `handleToggleWishlist(product)` - Add/remove from wishlist
- `wishlistedIds` - Set of wishlisted product IDs

## 🚢 Deployment

### Deploy to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages on every push to the `main` branch.

#### Setup Instructions:

1. **Enable GitHub Pages in your repository:**
   - Go to **Settings → Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**

2. **Push to main branch:**
   - Every push to `main` will automatically trigger the deployment workflow
   - You can also manually trigger the workflow from the Actions tab

3. **Access your deployed site:**
   - Your site will be available at: `https://sunilrathi88-max.github.io/grocerywebsite/`
   - The deployment URL will also be shown in the Actions workflow output

### Manual Deployment:

You can also trigger a deployment manually:
- Go to **Actions → Deploy to GitHub Pages → Run workflow**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [https://sunilrathi88-max.github.io/grocerywebsite/](https://sunilrathi88-max.github.io/grocerywebsite/)
- **AI Studio**: [View in AI Studio](https://ai.studio/apps/drive/1B5O3ZV223LJISe8NXkr3_C4758LUzVva)
- **Repository**: [https://github.com/sunilrathi88-max/grocerywebsite](https://github.com/sunilrathi88-max/grocerywebsite)

## 🐛 Known Issues & Future Improvements

- Add unit tests with Jest and React Testing Library
- Implement API integration for real product data
- Add user authentication and persistent cart/wishlist
- Implement payment gateway integration
- Add product search with fuzzy matching
- Implement internationalization (i18n) for multiple languages
- Add product image optimization with WebP/AVIF formats
- Implement analytics and monitoring

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
