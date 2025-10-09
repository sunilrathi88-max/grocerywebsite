
import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LeafIcon } from './icons/LeafIcon';
import { TruckIcon } from './icons/TruckIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { InstagramIcon } from './icons/InstagramIcon';

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle the submission here (e.g., API call)
    alert('Thank you for subscribing!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="bg-brand-accent text-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-brand-dark">Tattva Co.</h3>
            <p className="mt-4 text-sm text-gray-600">Authentic Indian Gourmet Products.</p>
            <div className="flex mt-4 space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-brand-dark transition-colors"><FacebookIcon /></a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-brand-dark transition-colors"><TwitterIcon /></a>
              <a href="#" aria-label="Pinterest" className="text-gray-500 hover:text-brand-dark transition-colors"><PinterestIcon /></a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-brand-dark transition-colors"><InstagramIcon /></a>
            </div>
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
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Newsletter</h4>
            <p className="mt-4 text-sm text-gray-600">Get the latest updates and offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex">
                <input 
                    type="email" 
                    placeholder="Your email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-sm"
                    aria-label="Email for newsletter"
                />
                <button 
                    type="submit"
                    className="bg-brand-dark text-white font-bold py-2 px-4 rounded-r-md hover:bg-opacity-80 transition-colors"
                    aria-label="Subscribe to newsletter"
                >
                    Go
                </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-brand-dark mb-10">
                <div className="flex flex-col items-center gap-3">
                    <ShieldCheckIcon className="h-10 w-10 text-brand-primary"/>
                    <h5 className="font-bold">Secure Checkout</h5>
                    <p className="text-sm text-gray-600">Guaranteed safe payments</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <LeafIcon className="h-10 w-10 text-brand-primary"/>
                    <h5 className="font-bold">Quality Assured</h5>
                    <p className="text-sm text-gray-600">Sourced from the best</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <TruckIcon className="h-10 w-10 text-brand-primary"/>
                    <h5 className="font-bold">Fast Shipping</h5>
                    <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Tattva Co. All Rights Reserved.</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
