import React from 'react';
import { BlogPost } from '../types';
import BlogPostCard from './BlogPostCard';

interface BlogPageProps {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">From the Tattva Co. Journal</h2>
        <p className="mt-4 text-lg text-gray-600">Stories, recipes, and inspiration from the world of Indian gourmet.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} onSelectPost={onSelectPost} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
