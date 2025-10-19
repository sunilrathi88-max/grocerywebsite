import React from 'react';
import { BlogPost } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface BlogPostCardProps {
  post: BlogPost;
  onSelectPost: (slug: string) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onSelectPost }) => {
  const [imageError, setImageError] = React.useState(false);
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0Y4RTNEOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VGF0dHZhIENvLjwvdGV4dD48L3N2Zz4=';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300">
      <a href={`#/blog/${post.slug}`} onClick={(e) => { e.preventDefault(); onSelectPost(post.slug); }} className="block">
        <div className="relative h-56">
          <img 
            src={imageError ? fallbackImage : post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-6 flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{post.date} &bull; By {post.author}</p>
          <h3 className="text-xl font-serif font-bold text-brand-dark flex-grow h-20 overflow-hidden">{post.title}</h3>
          <p className="text-gray-600 mt-2 text-sm flex-grow h-24 overflow-hidden">{post.excerpt}</p>
          <div className="mt-4 pt-4 border-t flex justify-between items-center text-brand-primary font-bold">
            <span>Read More</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default BlogPostCard;
