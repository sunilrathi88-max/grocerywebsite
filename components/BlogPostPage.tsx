import React from 'react';
import { BlogPost } from '../types';
import Breadcrumbs from './Breadcrumbs';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  if (!post) {
    return <div className="text-center py-20"><h2>Post not found</h2></div>;
  }

  const breadcrumbItems = [
    { label: 'Home', href: '#/' },
    { label: 'Blog', href: '#/blog' },
    { label: post.title }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark my-6">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span>By {post.author}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
        </div>
  <img src={post.image} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8" onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = 'https://via.placeholder.com/800x450/F8E3D9/333333?text=Tattva+Co.'; }} />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-bold text-sm text-gray-600">Tags:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-brand-secondary text-brand-dark text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
};

export default BlogPostPage;
