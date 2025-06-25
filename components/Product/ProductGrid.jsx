import React, { useState } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { applyDiscount } from "@/lib/discountHandler";

// Mock discount handler function since we don't have access to the external lib

const ProductCard = ({
  images,
  name,
  price,
  product_condition,
  discounted_price
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [randomRating] = useState(() => Math.random() * (5 - 2.5) + 2.5);
  const [randomReviewCount] = useState(() => Math.floor(Math.random() * (800 - 20 + 1)) + 20);

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
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex space-x-2">
            <button className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            <button className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  isLiked ? "text-red-500 fill-current" : "text-gray-700"
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

        {/* Countdown Timer for Discounted Items */}
        {hasDiscount && timeLeft && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        {/* Product Name */}
        <h3
          className="font-medium text-gray-800 text-xs sm:text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer truncate"
          title={name}
        >
          {name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center space-x-1">
          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            PKR {discounted_price ? applyDiscount(price, discounted_price) : price}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              PKR {price}
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
          <span className="text-xs text-gray-600">
            ({randomReviewCount})
          </span>
        </div>
      </div>
    </div>
  );
};

// Demo Component with Multiple Cards
const ProductGrid = ({ Products }) => {
  // Sample data for demo purposes
  const sampleProducts = [
    {
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop"
      ],
      name: "Wireless Headphones Premium",
      price: 2500,
      discounted_price: 20,
      product_condition: 8
    },
    {
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=300&h=300&fit=crop"
      ],
      name: "Smart Watch Series X",
      price: 4200,
      product_condition: 9
    },
    {
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop"
      ],
      name: "Sunglasses Designer",
      price: 1800,
      discounted_price: 15,
      product_condition: 7
    },
    {
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop"
      ],
      name: "Running Shoes Pro",
      price: 3500,
      product_condition: 8
    },
    {
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop"
      ],
      name: "Backpack Travel",
      price: 2200,
      discounted_price: 25,
      product_condition: 9
    },
    {
      images: [
        "https://images.unsplash.com/photo-1564466809058-bf4114613385?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
      ],
      name: "Coffee Maker Deluxe",
      price: 5500,
      product_condition: 8
    },
    {
      images: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop"
      ],
      name: "Smart Speaker",
      price: 3200,
      discounted_price: 30,
      product_condition: 9
    },
    {
      images: [
        "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop"
      ],
      name: "Gaming Controller",
      price: 1500,
      product_condition: 8
    }
  ];

  // Use provided Products or fallback to sample data
  const productsToShow = Products || sampleProducts;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - Auto-fit based on screen size */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 auto-cols-fr">
          {productsToShow.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;