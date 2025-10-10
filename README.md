<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tattva Co. - Indian Gourmet Products

An e-commerce web application for Indian gourmet products featuring product browsing, cart management, wishlists, checkout, user profiles, and an admin dashboard.

View your app in AI Studio: https://ai.studio/apps/drive/1B5O3ZV223LJISe8NXkr3_C4758LUzVva

## Tech Stack

- **Frontend**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Animations**: Framer Motion 11.0.8
- **Testing**: Vitest 3.2.4

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Gemini API Key** - Get yours from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sunilrathi88-max/grocerywebsite.git
cd grocerywebsite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file from the example template:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Note**: The `.env.local` file is already in `.gitignore` and will not be committed to version control.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### 6. Preview Production Build

```bash
npm run preview
```

### 7. Run Tests

```bash
npm test
```

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
│   └── ...
├── tests/              # Test files
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
└── index.html          # HTML template
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest

## Features

- 🛍️ Product browsing with filtering and sorting
- 🛒 Shopping cart with variant selection
- ❤️ Wishlist management
- 💳 Checkout process
- 👤 User profile management
- 🔐 Admin dashboard
- 📱 Responsive design
- ✨ Smooth animations

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to your preferred port
  host: '0.0.0.0',
}
```

### API Key Issues

- Ensure your `.env.local` file exists and contains a valid `VITE_GEMINI_API_KEY`
- Restart the development server after changing environment variables
- Check that the API key is correctly copied without extra spaces

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is private and proprietary.
