import React, { useState } from 'react';
import SEO from '../components/SEO';
import { generateOrganizationSchema } from '../utils/seo';

const AffiliateProgramPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    instagram: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SEO
        title="Affiliate Program | Partner with Rathi Naturals."
        description="Join the Rathi Naturals. Affiliate Program. Earn 15% commission promoting India's most authentic, lab-tested spices to your audience."
        structuredData={generateOrganizationSchema()}
      />

      <div className="bg-white min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative bg-brand-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">
              For Food Bloggers & Influencers
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Share Authentic Flavors. <br />
              <span className="text-brand-primary">Earn Real Rewards.</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Partner with India's first science-backed, farm-direct spice brand. Help your audience
              cook better food while earning industry-leading commissions.
            </p>
            <a
              href="#join-form"
              className="inline-block bg-brand-primary hover:bg-brand-secondary hover:text-brand-dark text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Apply to Join Program
            </a>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 px-4 bg-zinc-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Why Partner With Rathi Naturals.?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We treat our affiliates like true partners. No "points" or "store credit"—just cash
                commissions and real support.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-6">
                  💸
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">15% Commission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Earn a flat 15% on every sale you generate. Our average order value is ₹850,
                  meaning you earn significant income per conversion.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6">
                  📦
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Free Review Samples</h3>
                <p className="text-gray-600 leading-relaxed">
                  Active affiliates get monthly care packages of our newest spices to cook with,
                  photograph, and review for their audience.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-6">
                  🕒
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">30-Day Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  If someone clicks your link but buys 3 weeks later, you still get paid. We credit
                  you for the entire customer journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-white border-b border-zinc-100">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">
              How It Works
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -z-10 transform -translate-y-1/2"></div>

              {/* Step 1 */}
              <div className="bg-white p-6 md:w-1/3 text-center relative">
                <div className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">Apply</h3>
                <p className="text-sm text-gray-500">
                  Fill out the simple form below. We approve legitimate creators within 24 hours.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 md:w-1/3 text-center relative">
                <div className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Share</h3>
                <p className="text-sm text-gray-500">
                  Get your unique link or coupon code. Share it in your recipes, reels, or blogs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 md:w-1/3 text-center relative">
                <div className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Earn</h3>
                <p className="text-sm text-gray-500">
                  Track clicks and sales in real-time on your dashboard. Get paid monthly via
                  UPI/Bank Transfer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="join-form" className="py-20 px-4 bg-zinc-50">
          <div className="container mx-auto max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-brand-primary p-6 text-center">
              <h2 className="text-2xl font-bold text-white">Join the Family</h2>
              <p className="text-white/90">Apply in 2 minutes. No fees.</p>
            </div>

            <div className="p-8 md:p-12">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    🎉
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Received!</h3>
                  <p className="text-gray-600 mb-8">
                    Thanks, {formData.name}. We've sent a confirmation email to{' '}
                    <strong>{formData.email}</strong>. Our team will review your profile and get
                    back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Start new application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="e.g. Aditi Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="e.g. aditi@foodblog.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-bold text-gray-700 mb-2"
                        htmlFor="website"
                      >
                        Website / Blog URL
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-bold text-gray-700 mb-2"
                        htmlFor="instagram"
                      >
                        Instagram Handle
                      </label>
                      <input
                        required
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        placeholder="@yourhandle"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="message">
                      Tell us about your audience (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="What kind of content do you create? Who follows you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-dark hover:bg-black text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    Submit Application
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting, you agree to our Affiliate Terms & Conditions.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AffiliateProgramPage;
