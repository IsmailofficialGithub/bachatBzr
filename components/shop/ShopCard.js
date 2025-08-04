import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { applyDiscount } from "@/lib/discountHandler";

// Image optimization utility for Cloudinary
const getOptimizedImageUrl = (originalUrl, width = 400, quality = 80) => {
  if (originalUrl?.includes('cloudinary.com')) {
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},q_${quality},f_auto,c_fill/${parts[1]}`;
    }
  }
  return originalUrl;
};

// Optimized Image Component with lazy loading
const OptimizedShopImage = ({ 
  primarySrc, 
  secondarySrc, 
  alt, 
  priority = false,
  style,
  className,
  onImageError 
}) => {
  const [primaryLoaded, setPrimaryLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const [primaryError, setPrimaryError] = useState(false);
  const [secondaryError, setSecondaryError] = useState(false);
  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && primaryRef.current) {
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

      if (primaryRef.current) observer.observe(primaryRef.current);
      if (secondaryRef.current) observer.observe(secondaryRef.current);
      
      return () => observer.disconnect();
    }
  }, [priority]);

  // Preload secondary image on hover
  const handleMouseEnter = useCallback(() => {
    if (secondarySrc && !secondaryLoaded && !secondaryError) {
      const img = new Image();
      img.onload = () => setSecondaryLoaded(true);
      img.onerror = () => setSecondaryError(true);
      img.src = getOptimizedImageUrl(secondarySrc);
    }
  }, [secondarySrc, secondaryLoaded, secondaryError]);

  const handlePrimaryLoad = () => setPrimaryLoaded(true);
  const handleSecondaryLoad = () => setSecondaryLoaded(true);
  const handlePrimaryError = () => {
    setPrimaryError(true);
    onImageError?.();
  };
  const handleSecondaryError = () => setSecondaryError(true);

  return (
    <div onMouseEnter={handleMouseEnter} className="relative w-full h-full">
      {/* Loading placeholder */}
      {!primaryLoaded && !primaryError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          style={style}
        >
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {primaryError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          style={style}
        >
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}

      {/* Primary Image */}
      {!primaryError && (
        <img
          ref={primaryRef}
          src={priority ? getOptimizedImageUrl(primarySrc) : undefined}
          data-src={priority ? undefined : getOptimizedImageUrl(primarySrc)}
          alt={alt}
          style={style}
          className={`${className} ${primaryLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={priority ? "eager" : "lazy"}
          onLoad={handlePrimaryLoad}
          onError={handlePrimaryError}
        />
      )}

      {/* Secondary Image (hover effect) */}
      {secondarySrc && !secondaryError && (
        <img
          ref={secondaryRef}
          src={priority ? getOptimizedImageUrl(secondarySrc) : undefined}
          data-src={priority ? undefined : getOptimizedImageUrl(secondarySrc)}
          alt={alt}
          style={style}
          className={`thumbitem-secondary ${className} ${secondaryLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleSecondaryLoad}
          onError={handleSecondaryError}
        />
      )}
    </div>
  );
};


const ShopCard = React.memo(({ item, addToCart, addToWishlist, soldProducts, priority = false }) => {
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [randomRating] = useState(() => Math.random() * (5 - 2.5) + 2.5);
  const normalizedInfo = {};
Object.entries(item.additional_information || {}).forEach(([key, value]) => {
  normalizedInfo[key.trim()] = typeof value === "string" ? value.trim() : value;
});
 useEffect(() => {
    if (item.discounted_price) {
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
  }, [item.disconnected_price]);


  const { starCount, rating } = useMemo(() => {
    return {
      starCount: Math.floor(Math.random() * (4 - 3 + 1)) + 3,
      rating: Math.floor(Math.random() * (200 - 30 + 1)) + 30
    };
  }, [item._id]);

  const isSold = soldProducts.includes(item._id);


  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="col">
      <div className="tpproduct tpproductitem mb-50 p-relative">
        <div className="tpproduct__thumb">
          <div
            className="tpproduct__thumbitem p-relative"
            style={{ height: "249px", width: "100%" }}
          >
            <div className={`product-wrapper ${isSold ? "blocked" : ""}`}>
              {isSold && (
                <div className="sold-overlay">
                  <h2>SOLD</h2>
                </div>
              )}

              <Link
                href={isSold ? "#" : `/shop/${item._id}`}
                onClick={(e) => isSold && e.preventDefault()}
              >
                <OptimizedShopImage
                  primarySrc={item.images?.[0]}
                  secondarySrc={item.images?.[1]}
                  alt="product-thumb"
                  style={{ height: "250px" }}
                  className="product-image"
                  priority={priority}
                  onImageError={handleImageError}
                />
              </Link>

              <style jsx>{`
                .product-wrapper {
                  position: relative;
                  display: inline-block;
                }

                .product-image {
                  height: 250px;
                  object-fit: cover;
                  display: block;
                  width: 100%;
                }

                .thumbitem-secondary {
                  position: absolute;
                  top: 0;
                  left: 0;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                .product-wrapper:hover .thumbitem-secondary {
                  opacity: 1;
                }

                .product-wrapper:hover .product-image:not(.thumbitem-secondary) {
                  opacity: 0;
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
                  font-size: 3rem;
                  font-weight: bold;
                  margin: 0;
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

                /* Action buttons styling */
                .tpproduct__thumb-bg {
                  position: absolute;
                  top: 20px;
                  right: 20px;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                .product-wrapper:hover .tpproduct__thumb-bg {
                  opacity: 1;
                }

                .tpproductactionbg {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                }

                .tpproductactionbg a {
                  width: 40px;
                  height: 40px;
                  background: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  transition: all 0.3s ease;
                  cursor: pointer;
                  color: #333;
                  text-decoration: none;
                }

                .tpproductactionbg a:hover {
                  background: #ff6b35;
                  color: white;
                  transform: scale(1.1);
                }

                /* Product content styling */
                .tpproduct__content-area {
                  padding: 20px 0;
                }

                .tpproduct__title {
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 10px;
                }

                .tpproduct__title a {
                  color: #333;
                  text-decoration: none;
                  transition: color 0.3s ease;
                }

                .tpproduct__title a:hover {
                  color: #ff6b35;
                }

                .tpproduct__title span {
                  background: #ff6b35;
                  color: white;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  margin-left: 10px;
                }

                .tpproduct__ammount {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-weight: 600;
                  color: #333;
                }

                /* Rating area styling */
                .tpproduct__ratingarea {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 15px;
                }

                .tpproductdot {
                  display: flex;
                  gap: 8px;
                }

                .tpproductdot__variationitem {
                  text-decoration: none;
                }

                .tpproductdot__termshape {
                  position: relative;
                  width: 20px;
                  height: 20px;
                }

                .tpproductdot__termshape-bg {
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  display: block;
                  background: #ddd;
                }

                .red-product-bg { background: #ff4757 !important; }
                .orange-product-bg { background: #ff6348 !important; }
                .purple-product-bg { background: #a55eea !important; }

                .tpproductdot__termshape-border {
                  position: absolute;
                  top: -2px;
                  left: -2px;
                  width: calc(100% + 4px);
                  height: calc(100% + 4px);
                  border: 2px solid transparent;
                  border-radius: 50%;
                  transition: border-color 0.3s ease;
                }

                .tpproductdot__variationitem:hover .tpproductdot__termshape-border {
                  border-color: #ff6b35;
                }

                .tpproduct__rating ul {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  list-style: none;
                  margin: 0;
                  padding: 0;
                }

                .tpproduct__rating .fas.fa-star {
                  color: #ffd700;
                }

                .tpproduct__rating .far.fa-star {
                  color: #ddd;
                }

                .tpproduct__rating span {
                  color: #666;
                  font-size: 14px;
                  margin-left: 5px;
                }
              `}</style>
            </div>

            <div className="tpproduct__thumb-bg">
              <div className="tpproductactionbg">
                <a
                  onClick={() => addToCart(item._id)}
                  className="add-to-cart"
                >
                  <i className="fal fa-shopping-basket" />
                </a>

                <Link href={`/shop/${item._id}`} target="_blank">
                  <i className="fal fa-eye" />
                </Link>
                <a
                  onClick={() => addToWishlist(item._id)}
                  className="wishlist"
                >
                  <i className="fal fa-heart" />
                </a>
              </div>
              
            </div>
            
          </div>
        </div>
        
<div className="tpproduct__content-area">
                 {item.discounted_price && timeLeft && (
          <div style={{marginBottom:"1rem"}} className="text-center bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}
            <h3 className="tpproduct__title mb-5 " >
              <Link href={`/shop/${item._id}`}>{item.name}</Link>
              {item.discounted_price && <span style={{fontWeight: "900"}}>{item.discounted_price}% OFF</span>}
            </h3>
            
            <div className="tpproduct__priceinfo p-relative">
              <div className="tpproduct__ammount"style={{display: "flex", justifyContent: "space-between"}}>
                <span>PKR {item.discounted_price?applyDiscount(item.price,item.discounted_price):item.price}.00</span>
                <span>{item.product_condition}/10</span>
              </div>
              <div className="tpproduct__ammount" style={{display: "flex", justifyContent: "space-between"}}>
               <span> Size: {normalizedInfo?.Size || "N/A"}</span>
              </div>
            </div>
          </div>
        
        <div className="tpproduct__ratingarea">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tpproductdot">
              <Link
                className="tpproductdot__variationitem"
                href={`/shop/${item._id}`}
              >
                <div className="tpproductdot__termshape">
                  <span className="tpproductdot__termshape-bg" />
                  <span className="tpproductdot__termshape-border" />
                </div>
              </Link>
              <Link
                className="tpproductdot__variationitem"
                href={`/shop/${item._id}`}
              >
                <div className="tpproductdot__termshape">
                  <span className="tpproductdot__termshape-bg red-product-bg" />
                  <span className="tpproductdot__termshape-border red-product-border" />
                </div>
              </Link>
              <Link
                className="tpproductdot__variationitem"
                href={`/shop/${item._id}`}
              >
                <div className="tpproductdot__termshape">
                  <span className="tpproductdot__termshape-bg orange-product-bg" />
                  <span className="tpproductdot__termshape-border orange-product-border" />
                </div>
              </Link>
              <Link
                className="tpproductdot__variationitem"
                href={`/shop/${item._id}`}
              >
                <div className="tpproductdot__termshape">
                  <span className="tpproductdot__termshape-bg purple-product-bg" />
                  <span className="tpproductdot__termshape-border purple-product-border" />
                </div>
              </Link>
            </div>
            <div className="tpproduct__rating">
              <ul>
                <li>
                  {[...Array(5)].map((_, index) => (
                    <Link href="#" key={index}>
                      <i
                        className={
                          index < starCount ? "fas fa-star" : "far fa-star"
                        }
                      />
                    </Link>
                  ))}
                </li>
                <li>
                  <span>({rating})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShopCard;