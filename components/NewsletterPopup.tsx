import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check, Gift, ArrowRight } from 'lucide-react';

interface NewsletterPopupProps {
  delayMs?: number;
  onClose?: () => void;
}

const STORAGE_KEY = 'rathi_newsletter_dismissed';
const PROMO_CODE = 'WELCOME10';

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ delayMs = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const showPopup = () => setIsVisible(true);
    const timer = setTimeout(showPopup, delayMs);

    const handleScroll = () => {
      const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct > 50) {
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
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setIsSubmitted(true);
    try {
      const subs = JSON.parse(localStorage.getItem('rathi_subscribers') || '[]');
      subs.push({ email, date: new Date().toISOString() });
      localStorage.setItem('rathi_subscribers', JSON.stringify(subs));
    } catch {
      // ignore
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-md w-full overflow-hidden rounded-[2rem]"
            style={{
              background: '#0F0704',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(179,139,89,0.1)',
            }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={15} />
            </button>

            {/* Top panel */}
            <div className="relative overflow-hidden px-8 pt-10 pb-8">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#B38B59]/20 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10 text-center">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                    boxShadow: '0 8px 32px rgba(179,139,89,0.4)',
                  }}
                >
                  {isSubmitted ? (
                    <Gift size={28} className="text-white" />
                  ) : (
                    <Mail size={28} className="text-white" />
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="font-display text-3xl font-black text-white mb-2">
                        Welcome to the Family! 🎉
                      </h2>
                      <p className="text-stone-400 text-sm">
                        Your exclusive discount code is ready.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B38B59]/10 border border-[#B38B59]/20 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B38B59]">
                          Limited Offer
                        </span>
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
                        Get 10% Off
                        <br />
                        <span className="italic font-light text-[#B38B59]">Your First Order</span>
                      </h2>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        Join 10,000+ spice lovers for exclusive recipes, origin stories &
                        member-only deals.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom panel */}
            <div className="px-8 pb-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Code box */}
                    <div
                      className="rounded-2xl p-5 text-center"
                      style={{
                        background: 'rgba(179,139,89,0.08)',
                        border: '2px dashed rgba(179,139,89,0.3)',
                      }}
                    >
                      <p className="text-stone-500 text-xs uppercase tracking-widest mb-2 font-bold">
                        Your Code
                      </p>
                      <p className="font-mono text-3xl font-black text-[#B38B59] tracking-[0.12em]">
                        {PROMO_CODE}
                      </p>
                      <p className="text-stone-600 text-xs mt-2">
                        Valid 7 days · Orders above ₹499
                      </p>
                    </div>

                    <button
                      onClick={copyCode}
                      className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                        boxShadow: '0 8px 30px rgba(179,139,89,0.35)',
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={16} /> Copied!
                        </>
                      ) : (
                        <>
                          <ArrowRight size={16} /> Copy Code & Shop
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    <div className="relative">
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
                        className="w-full h-12 pl-10 pr-4 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(179,139,89,0.5)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                        boxShadow: '0 8px 30px rgba(179,139,89,0.35)',
                        opacity: isLoading ? 0.75 : 1,
                      }}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Unlock My 10% Off'
                      )}
                    </button>

                    <p className="text-center text-[10px] text-stone-600 font-bold uppercase tracking-widest">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
