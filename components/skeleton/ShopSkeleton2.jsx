import React from "react";

const ProductSkeleton2 = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start w-full gap-6  animate-pulse">
      {/* Skeleton Image */}
      <div className="w-full lg:w-1/2">
        <div className="bg-gray-200 w-full h-64 lg:h-full"></div>
      </div>

      {/* Skeleton Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start gap-4 p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>

        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </div>

        {/* Category */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton2;
