import React from 'react';
import { Link } from 'react-router-dom';

import { BLOG_POSTS_DATA } from '../data/posts';

const BLOG_POSTS = BLOG_POSTS_DATA.slice(0, 3).map((post) => ({
  id: post.id,
  title: post.title,
  category: post.tags[0] || 'Story',
  image: post.image,
  date: post.date,
  slug: `/blog/${post.slug}`,
}));

const BlogHighlights: React.FC = () => {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#c2410c] font-bold tracking-widest uppercase text-sm mb-2 block">
              The Spice Journal
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1917]">
              Latest Stories & Recipes
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex text-[#c2410c] font-bold hover:underline items-center"
          >
            View All Posts <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.id} to={post.slug} className="group block">
              <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 shadow-md">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                <span className="text-[#c2410c]">{post.category}</span>
                <span className="mx-2">•</span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1c1917] group-hover:text-[#c2410c] transition-colors leading-tight mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                Discover the secrets behind authentic Indian cooking with our expert guides and
                chef-curated recipes.
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/blog" className="text-[#c2410c] font-bold hover:underline items-center">
            View All Posts <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogHighlights;
