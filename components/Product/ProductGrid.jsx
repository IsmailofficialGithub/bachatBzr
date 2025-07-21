import React, { useEffect, useState } from "react";
import { ShoppingCart, Eye, Heart, ImageOff, Package } from "lucide-react";
import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";

// Custom responsive fallback component
const ImageFallback = ({ productName, className = "" }) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${className}`}>
      {/* Icon container - responsive sizing */}
      <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-gray-400">
        <Package className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" strokeWidth={1.5} />
        
        {/* Text - responsive sizing */}
        <div className="text-center px-2">
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">
            No Image
          </p>
          <p className="text-xs text-gray-400 leading-tight line-clamp-2">
            {productName?.substring(0, 30) + (productName?.length > 30 ? '...' : '')}
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/20 to-transparent pointer-events-none" />
      <div className="absolute top-2 right-2 opacity-10">
        <ImageOff className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
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
  addToCart,
  soldProducts = [],
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [randomRating] = useState(() => Math.random() * (5 - 2.5) + 2.5);
  const isSold = soldProducts.includes(_id);

  const [randomReviewCount] = useState(
    () => Math.floor(Math.random() * (800 - 20 + 1)) + 20,
  );

  // Use first image as default, second image on hover (if available)
  const defaultImage = images && images[0] ? images[0] : null;
  const hoverImage = images && images[1] ? images[1] : defaultImage;

  const hasDiscount = discounted_price ? true : false;

  // Generate random countdown timer for discounted items
  React.useEffect(() => {
    if (hasDiscount) {
      // Random time between 1-6 hours
      const randomHours = Math.floor(Math.random() * 6) + 1;
      const randomMinutes = Math.floor(Math.random() * 60);
      const randomSeconds = Math.floor(Math.random() * 60);

      const endTime =
        new Date().getTime() +
        randomHours * 3600000 +
        randomMinutes * 60000 +
        randomSeconds * 1000;

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
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

  const handleImageError = () => {
    setImageError(false);
  };

  const getImageToShow = () => {
    if (!defaultImage || imageError) return null;
    if (isHovered && images && images[1] && !imageError) return hoverImage;
    return defaultImage;
  };

  const renderStars = (rating) => {
    const stars = [];
    
    // Convert 1-10 rating to 1-5 star scale
    const starRating = (rating / 10) * 5;
    
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ☆
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ☆
          </span>,
        );
      }
    }
    return stars;
  };

  const currentImage = getImageToShow();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <style jsx>{`
        .product-wrapper {
          position: relative;
          display: inline-block;
        }

        .product-image {
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .blocked {
          cursor: not-allowed;
        }

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
        className={`relative overflow-hidden bg-gray-100 aspect-square ${isSold ? "blocked" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSold && (
          <div className="sold-overlay">
            <h2>SOLD</h2>
          </div>
        )}

        {/* Show image or fallback component */}
        {currentImage ? (
          <img
            loading="lazy"
            src={currentImage}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <ImageFallback 
            productName={name} 
            className="relative transition-all duration-300 group-hover:scale-105"
          />
        )}

        {/* Hover Actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-60" : "opacity-0"
          }`}
        >
          <div className="flex space-x-2">
            <button
              onClick={() => addToCart(_id)}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            <Link href={`/shop/${_id}`}>
              <button className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
              </button>
            </Link>
            <button
              onClick={() => {
                addToWishlist(_id);
              }}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${"text-gray-700"}`}
              />
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
        {/* Product Name */}
        <Link href={`/shop/${_id}`}>
          <h3
            className="font-medium text-gray-800 text-xs sm:text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer truncate"
            title={name}
          >
            {name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center space-x-1">
          <span className="text-sm sm:text-base md:text-lg font-semibold sm:font-bold text-gray-900">
            PKR{" "}
            {discounted_price ? applyDiscount(price, discounted_price) : price}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              {price}
            </span>
          )}
        </div>

        {/* Condition */}
        <div className="flex items-center">
          <span className="text-xs text-gray-600">Condition: </span>
          <span className="font-medium text-gray-800 text-xs ml-1">
            {product_condition}/10
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center text-xs sm:text-sm">
            {renderStars(product_condition)}
          </div>
          <span className="text-xs text-gray-600">({randomReviewCount})</span>
        </div>

        {/* Countdown Timer for Discounted Items */}
        {hasDiscount && timeLeft && (
          <div className="text-center bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}
      </div>
    </div>
  );
};

// Demo Component with Multiple Cards
const ProductGrid = ({ Products, addToWishlist, addToCart, soldProducts }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - Auto-fit based on screen size */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 auto-cols-fr">
          {Products.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              addToWishlist={addToWishlist}
              addToCart={addToCart}
              soldProducts={soldProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;