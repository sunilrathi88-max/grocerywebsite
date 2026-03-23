import React from 'react';
import { BlogPost } from '../types';
import BlogPostCard from './BlogPostCard';

interface BlogPageProps {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="bg-[#FAF6F2] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-[#B38B59]/10 border border-[#B38B59]/20 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest mb-6">
            The Rathi Journal
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[#42210B] mb-6 leading-tight">
            Stories of <span className="text-[#B38B59] italic">Flavor & Heritage</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Explore the deep-rooted traditions of Indian spices, authentic recipes, and our journey
            from farm to your kitchen.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} onSelectPost={onSelectPost} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
