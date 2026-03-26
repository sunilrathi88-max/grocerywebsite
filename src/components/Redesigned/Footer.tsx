import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#42210B] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="font-display text-3xl font-bold tracking-tight">
              Rathi Naturals
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Bringing the authentic heritage of Rajasthani spices from farm to your kitchen with 60
              years of tradition and uncompromising purity.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#B38B59] transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#B38B59] transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#B38B59] transition-all"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-8 text-[#B38B59] uppercase tracking-widest">
              Explore
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shop"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Shop Spices
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Hot Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Kitchen Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display text-lg font-bold mb-8 text-[#B38B59] uppercase tracking-widest">
              Information
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <h4 className="font-display text-lg font-bold text-[#B38B59] uppercase tracking-widest">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-stone-400">
                <MapPin size={18} className="text-[#B38B59] mt-1 shrink-0" />
                <span className="text-xs leading-relaxed">
                  Rathi Naturals Pvt Ltd, NH-15, Sangaria, Hanumangarh, Rajasthan - 335063
                </span>
              </div>
              <div className="flex items-center gap-4 text-stone-400">
                <Mail size={18} className="text-[#B38B59] shrink-0" />
                <span className="text-xs">hello@rathinaturals.in</span>
              </div>
              <div className="flex items-center gap-4 text-stone-400">
                <Phone size={18} className="text-[#B38B59] shrink-0" />
                <span className="text-xs">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mr-auto">
            &copy; {currentYear} RATHI NATURALS. ALL RIGHTS RESERVED.
          </div>

          {/* Certification Logos (Simulated) */}
          <div className="flex items-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="text-[10px] font-black border-2 border-current px-2 py-0.5 rounded">
              FSSAI
            </div>
            <div className="text-[10px] font-black border-2 border-current px-2 py-0.5 rounded italic">
              100% ORGANIC
            </div>
            <div className="text-[10px] font-black border-2 border-current px-2 py-0.5 rounded">
              ISO 9001
            </div>
          </div>

          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest ml-auto">
            CRAFTED WITH ❤️ IN RAJASTHAN
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
