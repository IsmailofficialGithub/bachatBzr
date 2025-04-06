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

  // Function to generate pagination items
  const renderPaginationItems = () => {
    if (!showPageNumbers) return null;
    
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust start if end is too close to totalPages
    if (endPage <= startPage) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      endPage = totalPages - 1;
    }
    
    // Add ellipsis if needed after first page
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed before last page
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Only render pagination if we have more than one page
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent className="flex items-center justify-center gap-2 cursor-pointer">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {renderPaginationItems()}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;