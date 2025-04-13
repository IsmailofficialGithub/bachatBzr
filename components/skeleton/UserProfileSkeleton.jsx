import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-5xl mx-auto">
      {/* Left Card Skeleton */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-md flex flex-col items-center space-y-4 animate-pulse">
        <div className="w-32 h-32 rounded-full bg-gray-300" />
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />
        <div className="h-8 w-32 bg-gray-300 rounded" />
      </div>

      {/* Right Info Section Skeleton */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md animate-pulse space-y-6">
        <div className="h-6 w-40 bg-gray-300 rounded" />

        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="w-1/3 space-y-2">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>
            <div className="w-1/3 space-y-2">
              <div className="h-3 w-24 bg-gray-300 rounded" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-40 bg-gray-300 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-64 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-10 w-40 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
