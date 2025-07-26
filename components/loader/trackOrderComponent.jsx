"use client"
import React from 'react';
import { Package, Loader2 } from 'lucide-react';
import "@/public/assets/css/tailwind-cdn.css"

export const TrackingLoaderComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div className="relative">
        {/* Animated package icon */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
          <Package className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-bounce" />
        </div>
        
        {/* Loading spinner overlay */}
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
        </div>
      </div>
      
      {/* Loading text with animated dots */}
      <div className="text-center max-w-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Tracking Your Order
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Please wait while we fetch your order details...
        </p>
        
        {/* Animated progress dots */}
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-0"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};