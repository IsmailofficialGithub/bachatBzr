export default function ProductSkeleton() {
    return (
      <div className="animate-pulse rounded-md shadow-md p-2 sm:p-4 w-full max-w-[250px] sm:w-[250px] bg-white">
        <div className="bg-gray-300 h-32 sm:h-40 w-full rounded-md mb-2 sm:mb-4" />
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2 mb-2 sm:mb-4" />
        <div className="flex space-x-1.5 sm:space-x-2">
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-300" />
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-300" />
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-300" />
        </div>
      </div>
    );
  }