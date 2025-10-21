import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LeafIcon } from './icons/LeafIcon';
import { TruckIcon } from './icons/TruckIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import TrustBadges from './TrustBadges';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle the submission here (e.g., API call)
    alert('Thank you for subscribing!');
    (e.target as HTMLFormElement).reset();
  };
  
  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    onSelectCategory(category);
  };

  return (
    <footer className="bg-brand-accent text-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-xl font-serif font-bold text-brand-dark">Tattva Co.</h3>
            <p className="mt-4 text-sm text-gray-600">Authentic Indian Gourmet Products.</p>
            <div className="flex mt-4 space-x-4">
              <a href="https://facebook.com/tattvaco" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-brand-dark transition-colors"><FacebookIcon /></a>
              <a href="https://twitter.com/tattvaco" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-brand-dark transition-colors"><TwitterIcon /></a>
              <a href="https://pinterest.com/tattvaco" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-gray-500 hover:text-brand-dark transition-colors"><PinterestIcon /></a>
              <a href="https://instagram.com/tattvaco" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-brand-dark transition-colors"><InstagramIcon /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#/" onClick={(e) => handleCategoryClick(e, 'Spices')} className="hover:text-brand-dark transition-colors">Spices</a></li>
              <li><a href="#/" onClick={(e) => handleCategoryClick(e, 'Nuts')} className="hover:text-brand-dark transition-colors">Nuts</a></li>
              <li><a href="#/" onClick={(e) => handleCategoryClick(e, 'Dry Fruits')} className="hover:text-brand-dark transition-colors">Dry Fruits</a></li>
              <li><a href="#/" onClick={(e) => handleCategoryClick(e, 'Beverages')} className="hover:text-brand-dark transition-colors">Beverages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">About</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#/about" className="hover:text-brand-dark transition-colors">Our Story</a></li>
              <li><a href="#/blog" className="hover:text-brand-dark transition-colors">Blog</a></li>
              <li><a href="#/contact" className="hover:text-brand-dark transition-colors">Contact Us</a></li>
              <li><a href="#/faqs" className="hover:text-brand-dark transition-colors">FAQs</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#/privacy-policy" className="hover:text-brand-dark transition-colors">Privacy Policy</a></li>
              <li><a href="#/refund-policy" className="hover:text-brand-dark transition-colors">Refund Policy</a></li>
              <li><a href="#/terms-of-service" className="hover:text-brand-dark transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-bold tracking-wider uppercase text-gray-500">Contact Us</h4>
            <address className="mt-4 text-sm text-gray-600 not-italic">
                123 Spice Lane, Mumbai, MH 400001<br/>
                <a href="tel:+912212345678" className="hover:text-brand-dark transition-colors">+(91) 22 1234 5678</a><br/>
                <a href="mailto:support@tattvaco.com" className="hover:text-brand-dark transition-colors">support@tattvaco.com</a>
            </address>
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
            
            {/* Trust Badges with Payment Methods */}
            <TrustBadges />
            
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Tattva Co. All Rights Reserved.</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
