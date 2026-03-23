import React from 'react';
import { BlogPost } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { OptimizedImage } from './OptimizedImage';

interface BlogPostCardProps {
  post: BlogPost;
  onSelectPost: (slug: string) => void;
}

import { Link } from 'react-router-dom';

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onSelectPost }) => {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden group border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500">
      <Link
        to={`/blog/${post.slug}`}
        onClick={(e) => {
          e.preventDefault();
          onSelectPost(post.slug);
        }}
        className="block"
      >
        <div className="relative h-64 overflow-hidden">
          <OptimizedImage
            src={post.image}
            alt={post.title}
            type="card"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={imageErrorHandlers.blog}
          />
          <div className="absolute top-6 left-6">
            <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#42210B] uppercase tracking-widest shadow-sm">
              {post.date}
            </div>
          </div>
        </div>
        <div className="p-10">
          <div className="text-[10px] font-black text-[#B38B59] uppercase tracking-[0.2em] mb-4">By {post.author}</div>
          <h3 className="font-display text-2xl font-bold text-[#42210B] mb-4 line-clamp-2 leading-tight group-hover:text-[#B38B59] transition-colors">
            {post.title}
          </h3>
          <p className="text-stone-500 text-sm mb-8 line-clamp-3 leading-relaxed font-normal">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs font-black text-[#42210B] uppercase tracking-widest group-hover:gap-5 transition-all">
            Read Story
            <div className="w-8 h-8 rounded-full bg-[#FAF6F2] flex items-center justify-center group-hover:bg-[#42210B] group-hover:text-white transition-colors">
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogPostCard;
