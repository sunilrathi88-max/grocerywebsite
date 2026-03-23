import React from 'react';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { SEO } from './SEO';
import { pageSEO } from '../utils/seo';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-[#FAF6F2] min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SEO {...pageSEO.contact()} />
        
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-[#B38B59]/10 border border-[#B38B59]/20 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest mb-6">
            Get in Touch
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#42210B] mb-6">
            We'd Love to <span className="text-[#B38B59] italic">Hear From You</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question about our cold-ground process or looking for a specific single-origin spice? 
            Our team of spice enthusiasts is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" id="name" required className="w-full bg-[#FAF6F2] border-none rounded-xl p-4 text-stone-900 focus:ring-2 focus:ring-[#B38B59] outline-none" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" id="email" required className="w-full bg-[#FAF6F2] border-none rounded-xl p-4 text-stone-900 focus:ring-2 focus:ring-[#B38B59] outline-none" placeholder="name@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Subject</label>
                <input type="text" id="subject" className="w-full bg-[#FAF6F2] border-none rounded-xl p-4 text-stone-900 focus:ring-2 focus:ring-[#B38B59] outline-none" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Your Message</label>
                <textarea id="message" rows={6} required className="w-full bg-[#FAF6F2] border-none rounded-xl p-4 text-stone-900 focus:ring-2 focus:ring-[#B38B59] outline-none resize-none" placeholder="Tell us more about your inquiry..." />
              </div>
              <button
                type="submit"
                className="w-full bg-[#B38B59] hover:bg-[#8C6D45] text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-12 lg:pl-8">
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-[#B38B59]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MailIcon className="h-6 w-6 text-[#B38B59]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-2">Email Support</h3>
                  <p className="text-[#42210B] font-display text-xl font-bold mb-1">sunilrathi88@gmail.com</p>
                  <p className="text-stone-500 text-sm">We typically respond within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-[#B38B59]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PhoneIcon className="h-6 w-6 text-[#B38B59]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-2">Call Center</h3>
                  <p className="text-[#42210B] font-display text-xl font-bold mb-1">+91 88900 06364</p>
                  <p className="text-stone-500 text-sm">Available Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
