import React from 'react';

const SkeletonPost: React.FC = () => {
  return (
    <div className="animate-pulse bg-white shadow rounded-lg p-4 space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="flex space-x-4 mt-4">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonPost;