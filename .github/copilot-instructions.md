# Copilot Instructions for Tattva Co. Grocery Website

## Project Overview

This is an e-commerce web application for Tattva Co., an Indian gourmet products store. The application features product browsing, cart management, wishlists, checkout, user profiles, and an admin dashboard.

## Tech Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Animations**: Framer Motion 11.0.8
- **Type Definitions**: TypeScript ~5.8.2
- **Package Manager**: npm

## Project Structure

```
/
├── components/          # React components
│   ├── icons/          # Icon components (SVG)
│   ├── AdminDashboard.tsx
│   ├── Cart.tsx
│   ├── CheckoutPage.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailModal.tsx
│   ├── ProductGrid.tsx
│   └── ...
├── App.tsx             # Main application component with state management
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── index.html          # HTML template
```

## Development Commands

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types in `types.ts` for shared interfaces
- Use React.FC for functional components with explicit prop types
- Avoid `any` type; use proper type definitions
- Import types from `types.ts` for consistency

### React Components

- Use functional components with hooks (no class components)
- Define prop interfaces for all components
- Use `React.FC` with typed props
- Keep components focused and single-responsibility
- Example structure:
  ```tsx
  import React from 'react';
  import { ProductType } from '../types';

  interface ProductCardProps {
    product: ProductType;
    onAddToCart: (product: ProductType) => void;
  }

  const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
      // Component JSX
    );
  };

  export default ProductCard;
  ```

### Styling

- Use Tailwind CSS utility classes for styling
- Follow the brand color scheme:
  - Primary: `brand-primary` (#FFB7C1 - Light Pink)
  - Secondary: `brand-secondary` (#F8E3D9 - Light Peach)
  - Dark: `brand-dark` (#333333 - Dark Gray)
  - Accent: `brand-accent` (#F5F5F5 - Light Gray)
- Use responsive classes (sm:, md:, lg:) for mobile-first design
- Prefer utility classes over custom CSS

### State Management

- Main application state is managed in `App.tsx`
- Use React hooks (useState, useEffect, useMemo, useCallback)
- Pass state and handlers via props
- No external state management library is used

### Animations

- Use Framer Motion for animations
- Follow existing animation patterns:
  ```tsx
  import { motion } from 'framer-motion';
  
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
  ```

### Icons

- Icon components are in `components/icons/`
- All icons are SVG-based React components
- Icons accept `className` prop for styling
- Example: `<HeartIcon className="h-6 w-6 text-red-500" />`

## Key Features & Components

### Product Management
- **Product**: Items with variants, reviews, images, and videos
- **Variant**: Different sizes/quantities with separate pricing and stock
- **ProductCard**: Display product in grid
- **ProductDetailModal**: Detailed product view with media gallery
- **ProductFormModal**: Admin product creation/editing

### Shopping Features
- **Cart**: Shopping cart with quantity management
- **Wishlist**: Save favorite products
- **Checkout**: Multi-step checkout with address and payment
- **Order History**: View past orders

### User Features
- **UserProfile**: User information and address management
- **AdminDashboard**: Product management (admin only)

### UI Components
- **Toast**: Notification system
- **SideModal**: Slide-in modal for cart/wishlist
- **CategoryFilter**: Filter products by category
- **SortDropdown**: Sort products
- **AdvancedFilters**: Price range and rating filters

## Environment Variables

- `GEMINI_API_KEY`: API key for Gemini AI features (set in `.env.local`)

## Best Practices

1. **Maintain consistency**: Follow existing code patterns and naming conventions
2. **Type safety**: Always use TypeScript types, avoid `any`
3. **Component reusability**: Create reusable components when possible
4. **Accessibility**: Use semantic HTML and ARIA labels where appropriate
5. **Performance**: Use `useMemo` and `useCallback` for expensive computations
6. **Responsive design**: Ensure mobile-first responsive design
7. **Error handling**: Handle edge cases (out of stock, empty cart, etc.)
8. **User feedback**: Use Toast notifications for user actions

## Common Patterns

### Adding a new product
```typescript
const newProduct: Product = {
  id: uniqueId,
  name: 'Product Name',
  description: 'Detailed description',
  images: ['url1', 'url2'],
  videos: ['video-url'], // optional
  category: 'Spices',
  variants: [
    { id: 101, name: '100g', price: 9.99, stock: 50 }
  ],
  reviews: []
};
```

### Adding to cart
```typescript
const addToCart = (product: Product, variant: Variant, quantity: number) => {
  const newItem: CartItem = { product, selectedVariant: variant, quantity };
  setCart([...cart, newItem]);
};
```

### Showing toast notifications
```typescript
const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  const newToast: ToastMessage = {
    id: Date.now(),
    message,
    type
  };
  setToasts([...toasts, newToast]);
};
```

## Notes

- Mock data is currently stored in `App.tsx` (MOCK_PRODUCTS array)
- No backend API integration yet
- Authentication is simulated (no real auth system)
- Payment processing is mocked
- The app uses Tailwind CSS via CDN in `index.html`
- Images are hosted on Unsplash and videos on Pexels

## Testing

Currently, there are no automated tests. When adding tests:
- Use Jest and React Testing Library
- Test component rendering and user interactions
- Test state management logic
- Follow existing patterns if tests are added

## Accessibility

- Use semantic HTML elements
- Add `aria-label` to icon buttons
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Use alt text for images
