import "@/public/assets/css/tailwind-cdn.css"
import React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  // Convert currentPage to number to handle string inputs
  const currentPageNum = Number(currentPage);
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      // Update URL with query parameter
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      window.history.pushState({}, '', url);
    }
  };

  // Function to generate pagination items with fixed structure
  const renderPaginationItems = () => {
    if (!showPageNumbers) return null;
    
    const items = [];
    
    // Always show page 1
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          isActive={currentPageNum === 1} 
          onClick={() => handlePageChange(1)}
          className="min-w-0 px-2 sm:px-3"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Always show page 2 if totalPages > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="page-2">
          <PaginationLink 
            isActive={currentPageNum === 2} 
            onClick={() => handlePageChange(2)}
            className="min-w-0 px-2 sm:px-3"
          >
            2
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show current page if it's greater than 2
    if (currentPageNum > 2) {
      items.push(
        <PaginationItem key={`page-${currentPageNum}`}>
          <PaginationLink 
            isActive={true}
            onClick={() => handlePageChange(currentPageNum)}
            className="min-w-0 px-2 sm:px-3"
          >
            {currentPageNum}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if(currentPage<3 && totalPages > 2) {
      items.push(
        <PaginationItem key={`page-${3}`}>
          <PaginationLink 
            onClick={() => handlePageChange(3)}
            className="min-w-0 px-2 sm:px-3"
          >
            {3}
          </PaginationLink>
        </PaginationItem>
      );

    }
    
    // Add ellipsis if current page is not the last page and there are more pages
    if (currentPageNum < totalPages) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis className="px-1 sm:px-2" />
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Only render pagination if we have more than one page
  if (totalPages <= 1) return null;

  return (
    <div className={className} >
      <Pagination>
        <PaginationContent className="flex items-center justify-center gap-1 sm:gap-2 cursor-pointer flex-wrap">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPageNum > 1 && handlePageChange(currentPageNum - 1)}
              className={`${currentPageNum <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} px-2 sm:px-3 text-xs sm:text-sm`}
            />
          </PaginationItem>
          
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full">
            {renderPaginationItems()}
          </div>
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => { 
                currentPageNum < totalPages && handlePageChange(currentPageNum + 1);
               }}
              className={`${currentPageNum >= totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} px-2 sm:px-3 text-xs sm:text-sm`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;