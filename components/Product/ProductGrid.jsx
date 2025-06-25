import React, { useState } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";

// Mock discount handler function since we don't have access to the external lib

const ProductCard = ({
  images,
  name,
  price,
  product_condition,
  _id,
  discounted_price,
  addToWishlist,
  addToCart
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [randomRating] = useState(() => Math.random() * (5 - 2.5) + 2.5);
  const [randomReviewCount] = useState(
    () => Math.floor(Math.random() * (800 - 20 + 1)) + 20,
  );

  // Default placeholder image
  const defaultPlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Cpath d='M150 100c-13.807 0-25 11.193-25 25s11.193 25 25 25 25-11.193 25-25-11.193-25-25-25zm0 40c-8.271 0-15-6.729-15-15s6.729-15 15-15 15 6.729 15 15-6.729 15-15 15z' fill='%236b7280'/%3E%3Cpath d='M200 75H100c-13.807 0-25 11.193-25 25v100c0 13.807 11.193 25 25 25h100c13.807 0 25-11.193 25-25V100c0-13.807-11.193-25-25-25zM85 200V100c0-8.271 6.729-15 15-15h100c8.271 0 15 6.729 15 15v68.787l-21.213-21.213c-5.858-5.858-15.355-5.858-21.213 0L150 170.148l-7.574-7.574c-5.858-5.858-15.355-5.858-21.213 0L85 199.148V200z' fill='%236b7280'/%3E%3C/svg%3E";

  // Use first image as default, second image on hover (if available)
  const defaultImage = images && images[0] ? images[0] : defaultPlaceholder;
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
    setImageError(true);
  };

  const getImageToShow = () => {
    if (imageError) return defaultPlaceholder;
    if (isHovered && images && images[1] && !imageError) return hoverImage;
    return defaultImage;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gray-100 aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          loading="lazy"
          src={getImageToShow()}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Hover Actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-60" : "opacity-0"
          }`}
        >
          <div className="flex space-x-2">
            <button 
              onClick={() => addToCart(_id)}
            className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            <Link href={`/shop/${_id}`}>
            <button className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            </Link>
            <button
              onClick={() => {addToWishlist(_id)}}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Heart
              
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  "text-gray-700"
                }`}
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
            {renderStars(randomRating)}
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
const ProductGrid = ({ Products ,addToWishlist,addToCart}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - Auto-fit based on screen size */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 auto-cols-fr">
          {Products.map((product, index) => (
            <ProductCard key={index} {...product} addToWishlist={addToWishlist} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
