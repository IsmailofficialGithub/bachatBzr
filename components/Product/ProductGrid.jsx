import React, { useEffect, useState, useRef, useCallback } from "react";
import { ShoppingCart, Eye, Heart, ImageOff, Package, Loader2 } from "lucide-react";

// Image optimization utility
const getOptimizedImageUrl = (originalUrl, width = 400, quality = 80) => {
  // For Cloudinary URLs, add transformation parameters
  if (originalUrl?.includes('cloudinary.com')) {
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},q_${quality},f_auto,c_fill/${parts[1]}`;
    }
  }
  return originalUrl;
};

// Enhanced fallback component with loading state
const ImageFallback = ({ productName, className = "", isLoading = false }) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-gray-400">
        {isLoading ? (
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 animate-spin text-blue-500" strokeWidth={1.5} />
        ) : (
          <Package className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" strokeWidth={1.5} />
        )}
        
        <div className="text-center px-2">
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">
            {isLoading ? "Loading..." : "No Image"}
          </p>
          <p className="text-xs text-gray-400 leading-tight line-clamp-2">
            {productName?.substring(0, 30) + (productName?.length > 30 ? '...' : '')}
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/20 to-transparent pointer-events-none" />
      <div className="absolute top-2 right-2 opacity-10">
        {isLoading ? (
          <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" />
        ) : (
          <ImageOff className="w-4 h-4 sm:w-6 sm:h-6" />
        )}
      </div>
    </div>
  );
};

// Optimized Image Component with lazy loading and error handling
const OptimizedImage = ({ src, alt, onLoad, onError, className, priority = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [priority]);

  if (hasError) {
    return <ImageFallback productName={alt} />;
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && <ImageFallback productName={alt} isLoading={true} />}
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={priority ? undefined : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};

const ProductCard = ({
  images,
  name,
  price,
  product_condition,
  _id,
  discounted_price,
  addToWishlist,
  additional_information,
  addToCart,
  soldProducts = [],
  priority = false // New prop for above-the-fold images
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [randomRating] = useState(() => Math.random() * (5 - 2.5) + 2.5);
  const [randomReviewCount] = useState(() => Math.floor(Math.random() * (800 - 20 + 1)) + 20);
  
  const isSold = soldProducts.includes(_id);

  // Optimize images
  const optimizedPrimaryImage = images?.[0] ? getOptimizedImageUrl(images[0]) : null;
  const optimizedHoverImage = images?.[1] ? getOptimizedImageUrl(images[1]) : optimizedPrimaryImage;

  const hasDiscount = discounted_price ? true : false;

  // Preload hover image on first hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Preload hover image if not loaded yet
    if (optimizedHoverImage && !hoverImageLoaded && optimizedHoverImage !== optimizedPrimaryImage) {
      const img = new Image();
      img.onload = () => setHoverImageLoaded(true);
      img.src = optimizedHoverImage;
    }
  }, [optimizedHoverImage, hoverImageLoaded, optimizedPrimaryImage]);

  // Countdown timer effect
  useEffect(() => {
    if (hasDiscount) {
      const randomHours = Math.floor(Math.random() * 6) + 1;
      const randomMinutes = Math.floor(Math.random() * 60);
      const randomSeconds = Math.floor(Math.random() * 60);

      const endTime = new Date().getTime() + randomHours * 3600000 + randomMinutes * 60000 + randomSeconds * 1000;

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        } else {
          setTimeLeft(null);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasDiscount]);

  const renderStars = (rating) => {
    const stars = [];
    const starRating = (rating / 10) * 5;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  const getCurrentImage = () => {
    if (isHovered && optimizedHoverImage && hoverImageLoaded && optimizedHoverImage !== optimizedPrimaryImage) {
      return optimizedHoverImage;
    }
    return optimizedPrimaryImage;
  };
  const normalizedInfo = {};
Object.entries(additional_information || {}).forEach(([key, value]) => {
  normalizedInfo[key.trim()] = typeof value === "string" ? value.trim() : value;
});

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <style jsx>{`
        .sold-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideDown 0.5s ease-out forwards;
          z-index: 10;
        }

        .sold-overlay h2 {
          color: #ff3b3b;
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        @media (min-width: 640px) {
          .sold-overlay h2 {
            font-size: 3rem;
          }
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-gray-100 aspect-square ${isSold ? "cursor-not-allowed" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSold && (
          <div className="sold-overlay">
            <h2>SOLD</h2>
          </div>
        )}

        {/* Optimized Image Display */}
        {getCurrentImage() ? (
          <OptimizedImage
            src={getCurrentImage()}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            priority={priority}
            onLoad={() => {
              if (getCurrentImage() === optimizedPrimaryImage) {
                setPrimaryImageLoaded(true);
              }
            }}
          />
        ) : (
          <ImageFallback productName={name} className="relative transition-all duration-300 group-hover:scale-105" />
        )}

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-60" : "opacity-0"}`}>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                addToCart(_id);
              }}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            <button 
                onClick={() => window.location.href = `/shop/${_id}`}
                className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
              </button>
            <button
              onClick={() => addToWishlist(_id)}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            {discounted_price}% OFF
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <h3 className="font-medium text-gray-800 text-xs sm:text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer truncate" title={name}>
          {name}
        </h3>

        <div className="flex items-center space-x-1">
          <span className="text-sm sm:text-base md:text-lg font-semibold sm:font-bold text-gray-900">
            PKR {discounted_price ? Math.round(price * (1 - discounted_price / 100)) : price}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              PKR {price}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-600">Condition: </span>
          <span className="font-medium text-gray-800 text-xs ml-1">
           Size: {normalizedInfo?.Size || "N/A"}

          </span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-600">Condition: </span>
          <span className="font-medium text-gray-800 text-xs ml-1">
            {product_condition}/10
          </span>
        </div>


        <div className="flex items-center space-x-1">
          <div className="flex items-center text-xs sm:text-sm">
            {renderStars(product_condition)}
          </div>
          <span className="text-xs text-gray-600">({randomReviewCount})</span>
        </div>

        {hasDiscount && timeLeft && (
          <div className="text-center bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}
      </div>
    </div>
  );
};

// ProductGrid component that accepts your API data
const ProductGrid = ({ Products, addToWishlist, addToCart, soldProducts = [] }) => {
  // Handle loading state
  if (!Products || Products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {/* Loading skeleton */}
            {Array(10).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-2 sm:p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - matches your original layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 auto-cols-fr">
          {Products.map((product, index) => (
            <ProductCard
              key={product._id}
              {...product}
              addToWishlist={addToWishlist}
              addToCart={addToCart}
              soldProducts={soldProducts}
              priority={index < 6} // First 6 products load immediately (first row)
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;