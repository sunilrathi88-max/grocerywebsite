# 🛒 Tattva Co. - Premium Organic Grocery Store

<div align="center">

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)
![Cypress](https://img.shields.io/badge/Cypress-15.5-17202C?logo=cypress)
![Percy](https://img.shields.io/badge/Percy-Visual_Testing-9E66BF?logo=percy)
![Tests](https://img.shields.io/badge/Tests-172+_Automated-success)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

*A modern, feature-rich e-commerce platform for organic groceries with enterprise-grade automated testing, visual regression, and performance monitoring.*

[🚀 Quick Start](#quick-start) • [📚 Documentation](#documentation) • [🎯 Features](#features) • [🧪 Testing](#testing) • [🛠 Development](#development-guide)

</div>

---

## ✨ Key Features

### 🛍️ **Shopping Experience**
- **Smart Product Grid** with advanced filters (category, price, diet, sustainability)
- **Intelligent Search** with autocomplete suggestions
- **Product Comparison** (compare up to 4 products side-by-side)
- **Wishlist Management** with persistent storage
- **Shopping Cart** with quantity controls and promo codes
- **Graceful Image Fallbacks** with branded placeholders

### 🎨 **User Interface**
- **Responsive Design** - Mobile-first approach with perfect tablet/desktop scaling
- **Smooth Animations** - Powered by Framer Motion
- **Mini Cart Preview** - Quick cart access from header
- **Exit Intent Modal** - Special offers on exit
- **Toast Notifications** - Real-time feedback
- **Loading Skeletons** - Professional loading states

### 📦 **Checkout & Orders**
- **Multi-Step Checkout** with form validation
- **Multiple Payment Methods** (Cash, Card, UPI, NetBanking, Wallet)
- **Delivery Slot Selection** with time preferences
- **Order History** with detailed tracking
- **Promo Code System** with validation

### 📝 **Content Features**
- **Blog Section** with rich content and categories
- **Recipe Collection** with detailed instructions and ingredients
- **Quiz Module** for personalized recommendations
- **Q&A System** on product pages
- **Review & Rating System** with verified purchases

### 👤 **User Management**
- **Authentication** (Login/Register with email validation)
- **User Profiles** with editable information
- **Address Management** (multiple addresses)
- **Admin Dashboard** for product/order management
- **Role-Based Access Control**

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# 1. Clone the repository (if from Git)
git clone <repository-url>
cd grocerywebsite

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

🎉 **Open http://localhost:3000** in your browser!

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
grocerywebsite/
├── components/              # React components
│   ├── icons/              # SVG icon components (40+)
│   ├── ProductCard.tsx     # Product grid card
│   ├── ProductDetailModal.tsx
│   ├── Cart.tsx            # Shopping cart
│   ├── CheckoutPage.tsx    # Multi-step checkout
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   └── ...                 # 50+ components
│
├── utils/                  # Utility functions
│   └── imageHelpers.ts     # Image fallback system
│
├── docs/                   # Documentation
│   └── IMAGE_FALLBACK_IMPLEMENTATION.md
│
├── data.ts                 # Mock data (products, users, orders)
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main app component with routing
├── index.tsx               # Entry point
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind customization
```

---

## 🎯 Features Breakdown

### Image Handling System
All product images use a centralized fallback system for reliability:

```tsx
import { imageErrorHandlers } from '../utils/imageHelpers';

<img 
  src={product.images[0]} 
  alt={product.name}
  onError={imageErrorHandlers.product} // Automatic fallback
/>
```

**Benefits:**
- ✅ Consistent branded placeholders
- ✅ No broken image icons
- ✅ 100% component coverage
- ✅ Production-tested

📖 **See [IMAGE_FALLBACK_IMPLEMENTATION.md](./docs/IMAGE_FALLBACK_IMPLEMENTATION.md)** for details.

### State Management
- **React Hooks** (useState, useEffect, useMemo, useCallback)
- **LocalStorage** for cart/wishlist persistence
- **URL State** for filters and sorting

### Styling System
- **Tailwind CSS** for utility-first styling
- **Custom Brand Colors:**
  - Primary: `#F8E3D9` (warm beige)
  - Accent: `#333333` (dark charcoal)
  - Success: `#10b981` (green)
  - Warning: `#f59e0b` (orange)
- **Framer Motion** for animations

---

## 🛠 Development Guide

### Component Development

#### Creating New Components

1. **Create file** in `components/` directory:
```tsx
// components/MyComponent.tsx
import React from 'react';
import { imageErrorHandlers } from '../utils/imageHelpers';

interface MyComponentProps {
  /** Product to display */
  product: Product;
  /** Callback when clicked */
  onClick: (id: string) => void;
}

/**
 * MyComponent - Displays a product item
 */
const MyComponent: React.FC<MyComponentProps> = ({ product, onClick }) => {
  return (
    <div className="rounded-lg border p-4">
      <img 
        src={product.images[0]} 
        alt={product.name}
        className="w-full h-48 object-cover rounded"
        onError={imageErrorHandlers.product}
      />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <button 
        onClick={() => onClick(product.id)}
        className="mt-2 bg-primary text-white px-4 py-2 rounded"
      >
        View Details
      </button>
    </div>
  );
};

export default MyComponent;
```

2. **Add to App.tsx** if it's a page component
3. **Test with mock data** from `data.ts`

#### Best Practices

✅ **DO:**
- Use TypeScript for all components
- Add JSDoc comments for props
- Implement image fallbacks for all `<img>` tags
- Use Tailwind utility classes
- Keep components small (<300 lines)
- Extract reusable logic to hooks/utils

❌ **DON'T:**
- Use inline styles (prefer Tailwind)
- Hardcode colors (use Tailwind classes)
- Ignore TypeScript warnings
- Leave console.logs in production code

### Testing

**Comprehensive automated testing with Cypress E2E framework.**

#### Quick Test Commands

```bash
# Open Cypress Test Runner (GUI)
npm run cypress:open

# Run all tests (headless)
npm run test:e2e

# Run with specific browser
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge

# Run for CI/CD
npm run test:ci
```

#### Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| Dropdown Navigation | 5 | Products hover delay fix |
| Quiz & Promo Codes | 7 | 8-question quiz, discount codes |
| Performance & Web Vitals | 12 | LCP, FID, CLS monitoring |
| Lazy Loading | 13 | Image loading optimization |
| Social Proof | 14 | Purchase notifications |
| Checkout Flow | 17 | End-to-end purchase |
| Mobile Responsive | 30+ | Multi-device testing |
| **Visual Regression (Percy)** | **14** | **UI consistency snapshots** |
| **Advanced Scenarios** | **60+** | **Edge cases & error handling** |

**Total: 9 test suites, 172+ automated tests**

📖 **See [TESTING.md](./TESTING.md)** for complete documentation.

#### CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Nightly schedule (2 AM UTC)

**Browser matrix:** Chrome, Firefox, Edge

**Includes:**
- Cypress E2E tests
- Percy visual regression testing
- Lighthouse CI performance monitoring
- Visual regression (ready for Percy/Applitools)
- Test artifacts (videos, screenshots, reports)

#### Manual Testing Checklist

**Homepage:**
- [ ] Products display correctly
- [ ] Search filters products in real-time
- [ ] Category filters work
- [ ] Sort dropdown (Price, Rating, Name)
- [ ] Add to cart notification appears
- [ ] Add to wishlist works
- [ ] Image placeholders for broken URLs

**Product Detail:**
- [ ] Modal opens with correct product
- [ ] Image gallery navigation works
- [ ] Variant selection (size, flavor)
- [ ] Quantity selector works
- [ ] Add to cart from modal
- [ ] Reviews display and submission works
- [ ] Q&A section functional
- [ ] Frequently bought together displays

**Shopping Cart:**
- [ ] Items display with correct images/prices
- [ ] Quantity increase/decrease updates total
- [ ] Remove item works
- [ ] Promo code validation works
- [ ] Subtotal calculates correctly
- [ ] Checkout button navigates to checkout

**Checkout:**
- [ ] Order summary matches cart
- [ ] Shipping address form validation
- [ ] Payment method selection
- [ ] Delivery slot selection
- [ ] Order placement creates order
- [ ] Order confirmation displays

**Other Features:**
- [ ] Wishlist displays saved items
- [ ] Comparison bar shows when comparing products
- [ ] Blog pages load with correct content
- [ ] Recipe pages render properly
- [ ] Admin dashboard (login as admin)

#### Browser Testing

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Optimization

```bash
# Build and analyze
npm run build

# Check bundle size
npx vite-bundle-visualizer
```

**Performance Targets:**
- Bundle size: < 500KB (gzipped)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse score: > 90

**Optimizations in place:**
- ✅ Code splitting by route
- ✅ Image lazy loading
- ✅ Tree shaking (removes unused code)
- ✅ CSS purging (removes unused styles)
- ✅ Minification (production build)

---

## 📚 Documentation

### Core Documentation
- **[IMAGE_FALLBACK_IMPLEMENTATION.md](./docs/IMAGE_FALLBACK_IMPLEMENTATION.md)** - Complete guide to image handling system

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Framer Motion API](https://www.framer.com/motion/)

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] **Replace test URLs** with production images (see `data.ts` line 9)
- [ ] **Update API endpoints** (if using backend)
- [ ] **Test production build** locally: `npm run preview`
- [ ] **Run Lighthouse audit** (target 90+ score)
- [ ] **Test on real devices** (mobile, tablet)
- [ ] **Configure environment variables**
- [ ] **Set up error monitoring** (Sentry, LogRocket)
- [ ] **Configure CDN caching** (for images)
- [ ] **Enable SSL certificate**
- [ ] **Test payment flow** (if using real payments)

### Hosting Options

| Platform | Best For | Deploy Command |
|----------|----------|----------------|
| **Vercel** | Zero-config, fast | `vercel` |
| **Netlify** | Simple, has forms | `netlify deploy` |
| **AWS S3 + CloudFront** | Full control, scalable | Manual upload |
| **GitHub Pages** | Free static hosting | `npm run build && gh-pages -d dist` |

### Environment Variables

Create `.env` file:
```env
VITE_API_URL=https://api.tattva.com
VITE_STRIPE_KEY=pk_live_...
VITE_ANALYTICS_ID=UA-XXXXX-X
```

---

## 🔧 Troubleshooting

### Common Issues

#### **Images Not Loading**
1. Check browser console for 404 errors
2. Verify `imageErrorHandlers` are imported
3. Test with broken URL to confirm fallback works
4. Check CORS settings for external images

**Solution:**
```tsx
// Ensure this is present
import { imageErrorHandlers } from '../utils/imageHelpers';

<img 
  src={url} 
  onError={imageErrorHandlers.product} 
/>
```

#### **Dev Server Won't Start**
1. Check if port 3000 is available
2. Clear cache and reinstall:
```powershell
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Recurse -Force .\node_modules\.vite
npm install
npm run dev -- --force
```

#### **Build Fails**
1. Check for TypeScript errors:
```bash
npx tsc --noEmit
```
2. Check for unused imports
3. Verify all file paths are correct

#### **Styling Issues**
1. Verify Tailwind classes are valid
2. Check `tailwind.config.js` for custom colors
3. Clear browser cache
4. Check for conflicting CSS

---

## 🤝 Contributing

### Code Style
- ✅ Use TypeScript for all new code
- ✅ Follow existing naming conventions (PascalCase for components, camelCase for functions)
- ✅ Add JSDoc comments for complex functions
- ✅ Keep components focused (single responsibility)
- ✅ Extract reusable logic to `utils/`

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Message Format
- `feat:` New feature (e.g., `feat: add wishlist page`)
- `fix:` Bug fix (e.g., `fix: cart total calculation`)
- `docs:` Documentation (e.g., `docs: update README`)
- `style:` Code style (e.g., `style: format with Prettier`)
- `refactor:` Code refactoring (e.g., `refactor: extract cart logic`)
- `test:` Adding tests (e.g., `test: add cart tests`)
- `chore:` Maintenance (e.g., `chore: update dependencies`)

---

## 📞 Support

### Getting Help

1. **Check Documentation** - Read this README and docs/
2. **Search Issues** - Look for similar problems on GitHub
3. **Create Issue** - If not found, create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

### Contact
- **Email:** support@tattva.com
- **GitHub Issues:** [Create Issue](./issues)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind Labs** for Tailwind CSS
- **Framer** for Framer Motion
- **Vite Team** for blazing-fast build tool
- **Unsplash** for product images (development)

---

<div align="center">

**Made with ❤️ for organic food lovers**

[⬆ Back to Top](#-tattva-co---premium-organic-grocery-store)

</div>