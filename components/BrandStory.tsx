import React from 'react';
import { motion } from 'framer-motion';

const BrandStory: React.FC = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-4 block">Our Origins</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6 leading-tight">
                                Why We Started <br /> Rathi Naturals
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-sans">
                                <p>
                                    It started with a simple disappointment. We bought "premium" saffron that tasted like... nothing. We bought "organic" turmeric that looked dull and dusty.
                                </p>
                                <p>
                                    We realized the spice industry was broken. Middlemen were holding onto stock for months, sometimes years. By the time it reached your kitchen, the <strong>life</strong> of the spice—the volatile oils—had evaporated.
                                </p>
                                <p className="font-semibold text-brand-dark">
                                    We decided to fix it.
                                </p>
                                <p>
                                    Tattva Co. (Rathi Naturals) was born from a promise: <strong>Harvest to Home in record time.</strong> We source directly from farmers we know by name, test every batch for purity, and package it immediately.
                                </p>
                                <p className="text-xl font-serif italic text-brand-secondary">
                                    "We don't just sell ingredients. We sell the confidence that your food will taste extraordinary."
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4">
                                <img src="https://ui-avatars.com/api/?name=Sunil+Rathi&background=8B5CF6&color=fff" alt="Founder" className="w-12 h-12 rounded-full shadow-md" />
                                <div>
                                    <p className="font-bold text-gray-900">Sunil Rathi</p>
                                    <p className="text-sm text-gray-500">Founder</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-brand-primary/10 -rotate-3 rounded-2xl transform scale-105 z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                                alt="Spices in hands"
                                className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[500px]"
                            />

                            {/* Stats Card */}
                            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-2xl z-20 max-w-xs hidden md:block">
                                <div className="flex items-center justify-between gap-8 mb-4">
                                    <div>
                                        <p className="text-3xl font-bold text-brand-primary">28</p>
                                        <p className="text-sm text-gray-500">Premium Products</p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-gray-200"></div>
                                    <div>
                                        <p className="text-3xl font-bold text-brand-secondary">0%</p>
                                        <p className="text-sm text-gray-500">Fillers/Additives</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 italic">Verified by independent labs.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
