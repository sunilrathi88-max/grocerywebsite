import React from 'react';
import { Link } from 'react-router-dom';
import TrustBadges from './TrustBadges';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-accent-footer text-gray-400 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 flex flex-col items-start gap-6">
            <h2 className="text-2xl font-serif text-white tracking-wide">Rathi Naturals</h2>
            <p className="text-sm font-light leading-relaxed max-w-xs">
              We believe in the power of pure ingredients. Sourced with conscience, delivered with
              care.
            </p>
          </div>
          {/* Block 1: Shop */}
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 border-b border-primary/20 pb-2 w-fit">
              Shop
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link
                  to="/collections/all"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                  onClick={() => onSelectCategory('All')}
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  All Spices
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/all?sort=newest"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/gift-sets"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 2: Company */}
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 border-b border-primary/20 pb-2 w-fit">
              Company
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/farmers" className="hover:text-primary transition-colors">
                  Farms & Sustainability
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/affiliate-program" className="hover:text-primary transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 3: Learn */}
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 border-b border-primary/20 pb-2 w-fit">
              Learn
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link to="/indian-spices-guide" className="hover:text-primary transition-colors">
                  Indian Spices Guide
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog & Recipes
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-primary transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/spice-freshness-calculator"
                  className="hover:text-primary transition-colors"
                >
                  Freshness Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 4: Help & Policies */}
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 border-b border-primary/20 pb-2 w-fit">
              Help & Policies
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
              Newsletter
            </h5>
            <p className="text-xs mb-4">Subscribe for recipes and farm updates.</p>
            <div className="flex border-b border-white/20 pb-2">
              <input
                className="bg-transparent border-none text-white placeholder-gray-600 w-full focus:ring-0 px-0 py-1 text-sm outline-none"
                placeholder="Email Address"
                type="email"
              />
              <button className="text-primary hover:text-white uppercase text-xs font-bold tracking-widest transition-colors">
                Join
              </button>
            </div>
            {/* Trust Badges in Footer */}
            <div className="mt-8">
              <TrustBadges variant="footer" showPaymentMethods showSecurityBadges />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs font-mono text-gray-600 gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <p>© {new Date().getFullYear()} Rathi Naturals. Pure Origin.</p>
            <span className="hidden md:inline text-gray-700">|</span>
            <p className="flex items-center text-primary/80 font-semibold tracking-wide">
              FSSAI Lic. No. 12225025000253
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-gray-400">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gray-400">
              Terms
            </Link>
            <Link to="/shipping" className="hover:text-gray-400">
              Shipping
            </Link>
            <Link to="/return-policy" className="hover:text-gray-400">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
