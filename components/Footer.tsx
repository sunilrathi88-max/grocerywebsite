
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-accent text-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-brand-dark">Tattva Co.</h3>
            <p className="mt-4 text-sm text-gray-600">Authentic Indian Gourmet Products.</p>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-dark transition-colors">Spices</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Nuts & Dry Fruits</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Beverages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">About</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-dark transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Follow Us</h4>
            <div className="flex mt-4 space-x-4">
              {/* Add social icons here */}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tattva Co. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;