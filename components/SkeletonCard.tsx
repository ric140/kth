
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse block h-full">
      {/* Image placeholder */}
      <div className="w-full h-56 bg-gray-200"></div>
      
      <div className="p-6 flex flex-col h-full">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        {/* Description placeholder lines */}
        <div className="space-y-3 mb-6 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Action placeholder */}
        <div className="flex justify-end mt-auto">
           <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
