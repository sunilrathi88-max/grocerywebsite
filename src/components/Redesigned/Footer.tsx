import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  Check,
} from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const FOOTER_LINKS = {
  Explore: [
    { label: 'Shop All Spices', to: '/shop' },
    { label: 'Hot Offers', to: '/offers' },
    { label: 'Our Story', to: '/about' },
    { label: 'Kitchen Blog', to: '/blog' },
    { label: 'From Our Farms', to: '/farmers' },
    { label: 'Help & FAQs', to: '/faqs' },
  ],
  Policies: [
    { label: 'Shipping Policy', to: '/shipping-policy' },
    { label: 'Refund Policy', to: '/refund-policy' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Affiliate Program', to: '/affiliate' },
  ],
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
    }, 900);
  };

  return (
    <footer className="bg-[#0F0704] text-white">
      {/* Newsletter section */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center md:text-left">
              <span className="text-[#B38B59] text-[11px] font-black uppercase tracking-[0.25em] mb-3 block">
                Rathi Insider
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                Recipes, stories &amp; early offers
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Join 8,000+ home cooks getting weekly recipes, origin stories, and exclusive
                subscriber discounts.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[400px]">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/40 rounded-2xl px-6 py-5"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">You&apos;re subscribed!</p>
                    <p className="text-stone-500 text-xs mt-0.5">
                      Check your inbox for a welcome gift.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-stone-600 outline-none focus:border-[#B38B59]/60 focus:ring-2 focus:ring-[#B38B59]/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-12 px-6 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-2 shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #B38B59, #8C6D45)',
                      boxShadow: '0 4px 20px rgba(179,139,89,0.35)',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={15} />
                        Subscribe
                      </>
                    )}
                  </button>
                </form>
              )}
              <p className="text-stone-600 text-[10px] mt-3 text-center md:text-left">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-7">
            <Link
              to="/"
              className="font-display text-3xl font-bold tracking-tight text-white block"
            >
              Rathi Naturals
            </Link>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              Bringing authentic Rajasthani spices from farm to kitchen with 60 years of tradition
              and uncompromising purity.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-stone-400 hover:bg-[#B38B59] hover:text-white hover:border-[#B38B59] transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-black text-[#B38B59] uppercase tracking-[0.25em] mb-7">
                {title}
              </h4>
              <ul className="space-y-3.5">
                {links.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group text-stone-500 hover:text-white text-sm font-medium transition-colors flex items-center gap-0 hover:gap-2"
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200 text-[#B38B59] shrink-0"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="space-y-7">
            <h4 className="text-[11px] font-black text-[#B38B59] uppercase tracking-[0.25em]">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:hello@rathinaturals.com"
                className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-[#1a0d04] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a0d04] group-hover:bg-[#B38B59] flex items-center justify-center transition-colors">
                  <Mail size={18} className="text-[#B38B59] group-hover:text-white" />
                </div>
                <span className="text-sm">hello@rathinaturals.com</span>
              </a>

              <a
                href="tel:+918890006364"
                className="flex items-center gap-3 text-stone-500 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#B38B59]/20 transition-colors">
                  <Phone size={14} className="text-[#B38B59]" />
                </div>
                <span className="text-sm">+91 88900 06364</span>
              </a>

              <div className="flex items-start gap-3 text-stone-500">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[#B38B59]" />
                </div>
                <span className="text-xs leading-relaxed">
                  125, Main Market, Sangaria,
                  <br />
                  Hanumangarh, Rajasthan – 335063
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest order-2 sm:order-1">
            © {currentYear} Rathi Naturals. All rights reserved.
          </p>

          {/* Cert badges */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            {['FSSAI', '100% ORGANIC', 'ISO 9001'].map((cert) => (
              <div
                key={cert}
                className="text-[9px] font-black border border-white/10 text-stone-500 px-2.5 py-1 rounded-lg tracking-widest hover:border-[#B38B59]/40 hover:text-[#B38B59] transition-all cursor-default"
              >
                {cert}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest order-3">
            Crafted with ❤️ in Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
