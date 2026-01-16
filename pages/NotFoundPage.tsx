import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-brand-accent to-white px-4">
      <div className="max-w-lg text-center">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-bold text-brand-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl animate-bounce">🌶️</div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this spice got lost in the kitchen! The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="text-sm text-brand-primary hover:underline font-medium">
              Shop All Spices
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/offers" className="text-sm text-brand-primary hover:underline font-medium">
              Special Offers
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/about" className="text-sm text-brand-primary hover:underline font-medium">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-sm text-brand-primary hover:underline font-medium">
              Contact
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            Can&apos;t find what you need? Try searching:
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const searchInput = e.currentTarget.querySelector('input');
              if (searchInput?.value) {
                navigate(`/search?q=${encodeURIComponent(searchInput.value)}`);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Search for spices..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm"
            />
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
