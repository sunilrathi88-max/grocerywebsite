import React, { useState } from 'react';
import { BlogPost } from '../types';
import BlogPostCard from './BlogPostCard';

interface BlogPageProps {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {currentPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} onSelectPost={onSelectPost} />
          ))}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-[#B38B59]/20 text-[#42210B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
              // Show limited page numbers if there are too many
              if (
                number === 1 ||
                number === totalPages ||
                (number >= currentPage - 1 && number <= currentPage + 1)
              ) {
                return (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`min-w-[40px] h-[40px] rounded-full border border-[#B38B59]/20 font-bold transition-all ${
                      currentPage === number
                        ? 'bg-[#42210B] text-white border-[#42210B]'
                        : 'text-[#42210B] hover:bg-white'
                    }`}
                  >
                    {number}
                  </button>
                );
              } else if (number === currentPage - 2 || number === currentPage + 2) {
                return (
                  <span key={number} className="text-[#B38B59]">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-[#B38B59]/20 text-[#42210B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
