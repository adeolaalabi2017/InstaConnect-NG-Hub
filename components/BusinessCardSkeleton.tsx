import React from 'react';

const BusinessCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      {/* Image Container Skeleton */}
      <div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 w-full"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-2/3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>

        <div className="flex items-center gap-1 mb-6">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between">
           <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
           </div>
           <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardSkeleton;
