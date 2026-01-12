import React from 'react';
import { OptimizedImage } from './OptimizedImage'; // Assuming you have this or standard img
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'single-origin',
    name: 'Single Origin',
    description: 'High-grade turmeric, chili, and pepper.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', // Placeholder
  },
  {
    id: 'spice-blends',
    name: 'Spice Blends',
    description: 'Authentic masalas for every dish.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'ready-to-cook',
    name: 'Ready-to-Cook',
    description: 'Pastes and marinades for quick meals.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'organic-staples',
    name: 'Organic Staples',
    description: 'Daily essentials, 100% certified organic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'gifting',
    name: 'Gifting & Hampers',
    description: 'Beautifully packed spice collections.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'wellness',
    name: 'Wellness & Herbal',
    description: 'Teas, infusions, and immunity boosters.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
];

interface ShopByCategoryProps {
  onSelectCategory?: (category: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 15,
    },
  },
};

const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6"
          >
            Shop by Category
          </motion.h2>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 shadow-md bg-white">
                <OptimizedImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{cat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByCategory;
