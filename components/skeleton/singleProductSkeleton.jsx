import "@/public/assets/css/tailwind-cdn.css"
import React from "react";

const SingleProductSkeleton = ({ type }) => {
  if (type === "image") {
    return (
      <div className="w-full h-full animate-pulse">
        <div className="w-full h-[400px] bg-gray-300 rounded-lg mb-3" style={{height:"300px"}}></div>
        <div className="w-full h-[400px] bg-gray-300 rounded-lg mb-3" style={{height:"300px"}}></div>
        <div className="w-full h-[400px] bg-gray-300 rounded-lg mb-3" style={{height:"300px"}}></div>
      </div>
    );
  }

  if (type === "content") {
    return (
      <div className="w-full animate-pulse space-y-4 gap-10">
        {/* Title & Stock */}
        <div className="flex items-start flex-row gap-4">
         <div className="bg-gray-300 rounded-md h-5 w-20 "></div>
         <div className="flex flex-row  items-center">
          <div className="text-gray-300 "><i class="fas fa-star"/></div>
          <div className="text-gray-300 "><i class="fas fa-star"/></div>
          <div className="text-gray-300 "><i class="fas fa-star"/></div>
          <div className="text-gray-300 "><i class="fas fa-star"/></div>
          <div className="text-gray-300 "><i class="fas fa-star"/></div>
         </div>
        </div>

        <div className="h-5 w-20 bg-gray-300 rounded-md"></div>

        <div className="h-16 w-40 bg-gray-300 rounded-md"></div>


        <div className="space-y-2">
          <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
        </div>

        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
          <div className="h-12 w-10 bg-gray-300 rounded-md"></div>
         
        </div>

        <div className="space-y-2">
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
         
            <div className="flex gap-2 mt-2 flex-row ">
          <div className="h-3 w-10 bg-gray-300 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-300 rounded-full"></div>
          ))}
        </div>
        </div>

        
      </div>
    );
  }

  return null;
};

export default SingleProductSkeleton;
