import React from 'react';
import { motion } from 'framer-motion';
import { PEACE_SOUNDBITES } from '../data/soundbites';

const PEACECards: React.FC = () => {
    return (
        <section className="py-20 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        Why Tattva Co.?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We're not just selling spices. We're fighting the mediocrity in your pantry.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PEACE_SOUNDBITES.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col items-start border border-gray-100"
                        >
                            {/* Header Label */}
                            <div className="mb-6 flex items-center space-x-3">
                                <span className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                    {index + 1}
                                </span>
                                <h3 className="text-sm font-bold tracking-widest text-brand-secondary uppercase">
                                    {item.label} Problem
                                </h3>
                            </div>

                            {/* The Problem */}
                            <h4 className="text-lg font-bold text-gray-900 mb-2 font-serif">
                                "{item.problem}"
                            </h4>

                            <div className="w-12 h-0.5 bg-gray-200 my-4"></div>

                            {/* The Result/Solution */}
                            <p className="text-gray-600 leading-relaxed flex-grow">
                                {item.empathy} {item.answer}
                            </p>

                            <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                                <p className="text-brand-primary font-bold text-lg">
                                    {item.result}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PEACECards;
