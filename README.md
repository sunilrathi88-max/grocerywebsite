<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tattva Co. - Indian Gourmet Products

A modern, performant e-commerce React application for premium Indian spices, nuts, and artisanal products. Built with React 19, TypeScript, and Vite, featuring advanced optimization techniques for exceptional user experience.

**Live Demo:** [https://sunilrathi88-max.github.io/grocerywebsite/](https://sunilrathi88-max.github.io/grocerywebsite/)

**AI Studio App:** [View in AI Studio](https://ai.studio/apps/drive/1B5O3ZV223LJISe8NXkr3_C4758LUzVva)

## ✨ Features

### Core Functionality
- 🛒 **Shopping Cart** - Add items, update quantities, and manage purchases
- ❤️ **Wishlist** - Save favorite products for later
- 🔍 **Search & Filter** - Find products by name and category
- ⭐ **Product Reviews** - Read and write customer reviews
- 📱 **Responsive Design** - Optimized for all screen sizes

### Advanced Features
- 🍳 **Recipe Integration** - Browse recipes and add ingredients to cart
- 🔄 **Reorder & Subscriptions** - Quickly reorder past purchases
- 🔀 **Smart Substitutions** - Out-of-stock product alternatives
- 📦 **Stock Management** - Real-time inventory tracking

## 🚀 Performance Optimizations

This project implements several performance best practices:

- **Code Splitting** - Lazy loading for ProductDetailModal and vendor chunks
- **React.memo** - Optimized re-renders for ProductGrid, Cart, and Wishlist
- **Custom Hooks** - Extracted logic into reusable `useCart` and `useWishlist` hooks
- **Memoization** - Strategic use of useMemo and useCallback
- **TypeScript Strict Mode** - Enhanced type safety and early bug detection

## 🏗️ Project Structure

```
grocerywebsite/
├── components/          # React components
│   ├── Cart.tsx        # Shopping cart UI (memoized)
│   ├── Wishlist.tsx    # Wishlist UI (memoized)
│   ├── ProductGrid.tsx # Product listing (memoized)
│   ├── ProductCard.tsx # Individual product display
│   ├── ProductDetailModal.tsx  # Lazy-loaded product details
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Footer.tsx      # Footer
│   ├── CategoryFilter.tsx  # Category filtering
│   ├── Testimonials.tsx    # Customer testimonials
│   ├── RecipeToCart.tsx    # Recipe feature
│   ├── ReorderSubscription.tsx  # Reorder feature
│   ├── InventorySubstitutions.tsx  # Substitutions
│   └── icons/          # Icon components
├── hooks/              # Custom React hooks
│   ├── useCart.ts      # Cart state management
│   └── useWishlist.ts  # Wishlist state management
├── data/               # Mock data and types
│   └── mockData.ts     # Products, testimonials, recipes, orders
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── vite.config.ts      # Vite configuration with optimizations
└── tsconfig.json       # TypeScript configuration (strict mode)
```

## 🛠️ Tech Stack

- **React 19.1.1** - Latest React with improved performance
- **TypeScript 5.8.2** - Strict mode enabled for type safety
- **Vite 6.2.0** - Fast build tool with optimized bundling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion 11.15.0** - Smooth animations

## 💻 Local Development

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunilrathi88-max/grocerywebsite.git
   cd grocerywebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with pnpm for faster installs
   pnpm install
   ```

3. **Set up environment variables (optional)**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   The production build will be in the `dist/` directory

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚢 Deployment

### GitHub Pages (Automatic)

This repository is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**

2. **Automatic Deployment:**
   - Every push to `main` branch triggers automatic deployment
   - Monitor progress in the **Actions** tab

3. **Manual Deployment:**
   - Go to **Actions → Deploy to GitHub Pages → Run workflow**

**Live Site:** `https://sunilrathi88-max.github.io/grocerywebsite/`

## 🎨 Component Overview

### Core Components

- **ProductGrid** - Displays products in a responsive grid layout, memoized for performance
- **ProductCard** - Individual product card with quick actions (add to cart, wishlist)
- **Cart** - Shopping cart sidebar with quantity controls, memoized
- **Wishlist** - Saved products display, memoized
- **ProductDetailModal** - Lazy-loaded detailed product view with reviews

### Feature Components

- **RecipeToCart** - Browse recipes and add all ingredients to cart
- **ReorderSubscription** - View past orders and set up recurring deliveries
- **InventorySubstitutions** - Suggests alternatives for out-of-stock items

## 🎯 Accessibility

This project follows accessibility best practices:

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Alt text for all images
- Focus management for modals

## 🔮 Future Enhancements

Potential improvements for scaling:

- **API Integration** - Replace mock data with real backend (consider SWR or React Query)
- **State Management** - Add Redux Toolkit or Zustand for complex state
- **Testing** - Jest + React Testing Library
- **Internationalization** - react-i18next for multi-language support
- **Image Optimization** - WebP/AVIF formats with responsive images
- **Analytics** - Google Lighthouse CI integration
- **PWA** - Progressive Web App capabilities

## 📝 License

This project is part of an AI Studio demonstration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
