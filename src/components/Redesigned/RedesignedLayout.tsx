import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Product, BlogPost } from '../../../types';

interface RedesignedLayoutProps {
  products: Product[];
  posts: BlogPost[];
}

const RedesignedLayout: React.FC<RedesignedLayoutProps> = ({ products, posts }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar products={products} posts={posts} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RedesignedLayout;
