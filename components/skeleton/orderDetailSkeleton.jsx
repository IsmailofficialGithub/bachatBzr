// components/skeletons/OrderDetailsSkeleton.js
import React from 'react'

const OrderDetailsSkeleton = () => {
  // Skeleton color scheme
  const skeletonColors = {
    base: 'bg-gray-400',       // Light gray for main elements
    highlight: 'bg-gray-500',  // Slightly darker for contrast
    accent: 'bg-gray-600',     // For interactive elements
    card: 'bg-white',          // White card backgrounds
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gray-50 mt-3">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className={`h-8 w-48 ${skeletonColors.highlight} rounded-full animate-pulse mb-4`}></div>
          <div className={`h-4 w-64 ${skeletonColors.base} rounded-full animate-pulse`}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card Skeleton */}
            <div className={`${skeletonColors.card} rounded-xl shadow-sm p-6 h-32 animate-pulse`}>
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className={`h-5 w-32 ${skeletonColors.highlight} rounded-full`}></div>
                  <div className={`h-4 w-48 ${skeletonColors.base} rounded-full`}></div>
                </div>
                <div className={`h-10 w-24 ${skeletonColors.accent} rounded-full`}></div>
              </div>
            </div>
            
            {/* Products Card Skeleton */}
            <div className={`${skeletonColors.card} rounded-xl shadow-sm overflow-hidden`}>
              <div className={`p-4 border-b ${skeletonColors.base} h-16 flex items-center`}>
                <div className={`h-5 w-40 ${skeletonColors.highlight} rounded-full`}></div>
              </div>
              
              {[1, 2].map((item) => (
                <div key={item} className="p-4 border-b">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className={`w-full md:w-32 h-32 ${skeletonColors.base} rounded-lg animate-pulse`}></div>
                    <div className="flex-1 space-y-3">
                      <div className={`h-5 w-3/4 ${skeletonColors.highlight} rounded-full animate-pulse`}></div>
                      <div className={`h-4 w-1/2 ${skeletonColors.base} rounded-full animate-pulse`}></div>
                      <div className="flex justify-between items-center">
                        <div className={`h-4 w-1/4 ${skeletonColors.base} rounded-full animate-pulse`}></div>
                        <div className={`h-8 w-24 ${skeletonColors.accent} rounded-full animate-pulse`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className={`${skeletonColors.card} rounded-xl shadow-sm p-6`}>
              <div className={`h-6 w-40 ${skeletonColors.highlight} rounded-full mb-4`}></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className={`h-4 w-full ${skeletonColors.base} rounded-full animate-pulse`}></div>
                ))}
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className={`${skeletonColors.card} rounded-xl shadow-sm p-6`}>
              <div className={`h-6 w-40 ${skeletonColors.highlight} rounded-full mb-4`}></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className={`h-4 w-24 ${skeletonColors.base} rounded-full`}></div>
                    <div className={`h-4 w-20 ${skeletonColors.base} rounded-full`}></div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <div className={`h-5 w-16 ${skeletonColors.highlight} rounded-full`}></div>
                    <div className={`h-5 w-24 ${skeletonColors.highlight} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className={`${skeletonColors.card} rounded-xl shadow-sm p-6`}>
              <div className={`h-6 w-32 ${skeletonColors.highlight} rounded-full mb-3`}></div>
              <div className={`h-4 w-full ${skeletonColors.base} rounded-full mb-4`}></div>
              <div className={`h-10 w-full ${skeletonColors.accent} rounded-lg animate-pulse`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsSkeleton