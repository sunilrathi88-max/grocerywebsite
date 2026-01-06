import React from 'react';
import { Button } from './Button';
import { OptimizedImage } from './OptimizedImage';

const posts = [
  {
    id: 1,
    title: '5 Easy Recipes with Garam Masala',
    excerpt: 'Simple, everyday dishes that show what a fresh blend can do.',
    image:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600',
    slug: '5-easy-recipes-garam-masala',
  },
  {
    id: 2,
    title: 'How to Store Spices for Maximum Freshness',
    excerpt: 'Practical storage rules to keep aroma and color for longer.',
    image:
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600',
    slug: 'how-to-store-spices',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Our Cold-Grinding Process',
    excerpt: 'Walkthrough of how grinding method changes flavor.',
    image:
      'https://images.unsplash.com/photo-1599940824399-b87987ced7bb?auto=format&fit=crop&q=80&w=600',
    slug: 'behind-the-scenes-cold-grinding',
  },
];

const BlogStrip = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2">
              Recipes & Cooking Tips
            </h2>
            <div className="h-1 w-20 bg-brand-primary rounded-full" />
          </div>
          <Button variant="outline" className="hidden sm:inline-flex">
            Explore All Articles
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={225}
                />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full">
            Explore All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogStrip;
