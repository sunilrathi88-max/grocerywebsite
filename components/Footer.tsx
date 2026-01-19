import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-accent-footer text-gray-400 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 flex flex-col items-start gap-6">
            <h2 className="text-2xl font-serif text-white tracking-wide">
              Rathi Naturals
            </h2>
            <p className="text-sm font-light leading-relaxed max-w-xs">
              We believe in the power of pure ingredients. Sourced with
              conscience, delivered with care.
            </p>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
              Shop
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link
                  to="#"
                  className="hover:text-primary transition-colors"
                  onClick={() => onSelectCategory('Spices')}
                >
                  All Spices
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
              Company
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/farmers"
                  className="hover:text-primary transition-colors"
                >
                  Farms
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
              Newsletter
            </h5>
            <p className="text-xs mb-4">
              Subscribe for recipes and farm updates.
            </p>
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
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs font-mono text-gray-600 gap-4">
          <p>© {new Date().getFullYear()} Rathi Naturals. Pure Origin.</p>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
