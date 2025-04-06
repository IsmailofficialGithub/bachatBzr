export default function ProductSkeleton() {
    return (
      <div className="animate-pulse rounded-md shadow-md p-4 w-[250px] bg-white">
        <div className="bg-gray-300 h-40 w-full rounded-md mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
        <div className="flex space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-300" />
          <div className="h-4 w-4 rounded-full bg-gray-300" />
          <div className="h-4 w-4 rounded-full bg-gray-300" />
        </div>
      </div>
    );
  }
  