import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-64 w-full bg-gray-300"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="flex items-center">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full ml-1"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full ml-1"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full ml-1"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full ml-1"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
