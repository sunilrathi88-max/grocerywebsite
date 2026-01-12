import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface NewsletterPopupProps {
  delayMs?: number;
  onClose?: () => void;
}

const STORAGE_KEY = 'tattva_newsletter_dismissed';
const PROMO_CODE = 'WELCOME10';

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ delayMs = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Show popup after delay or on scroll
    const showPopup = () => setIsVisible(true);

    const timer = setTimeout(showPopup, delayMs);

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        showPopup();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delayMs]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);

    // Store email (in real app, send to backend)
    try {
      const subscribers = JSON.parse(localStorage.getItem('tattva_subscribers') || '[]');
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem('tattva_subscribers', JSON.stringify(subscribers));
    } catch {
      // Silently fail
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors z-10"
          aria-label="Close popup"
        >
          <XIcon className="w-5 h-5 text-neutral-500" />
        </button>

        {/* Header Image */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 py-8 px-6 text-center text-white">
          <SparklesIcon className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-serif font-bold mb-2">
            {isSubmitted ? '🎉 Welcome to the Family!' : 'Get 10% Off Your First Order'}
          </h2>
          {!isSubmitted && (
            <p className="text-amber-100 text-sm">
              Join 10,000+ spice lovers for exclusive recipes & deals
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-neutral-600 mb-4">
                Your discount code is ready! Use it at checkout:
              </p>
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg py-4 px-6 mb-4">
                <p className="font-mono text-2xl font-bold text-amber-700 tracking-wider">
                  {PROMO_CODE}
                </p>
              </div>
              <p className="text-sm text-neutral-500 mb-4">Valid for 7 days on orders above ₹499</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(PROMO_CODE);
                  handleClose();
                }}
                className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Copy Code & Start Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none mb-4"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Get My 10% Off'}
              </button>
              <p className="text-xs text-neutral-400 text-center mt-3">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default NewsletterPopup;
