import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const ShopCardMain = ({ item, addToCart, addToWishlist }) => {
  const [cardRef, isVisible, hasBeenVisible] = useIntersectionObserver();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
  const [showHoverImage, setShowHoverImage] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const { starCount, rating } = useMemo(() => {
    return {
      starCount: Math.floor(Math.random() * (4 - 3 + 1)) + 3,
      rating: Math.floor(Math.random() * (200 - 30 + 1)) + 30,
    };
  }, [item._id]);

  // Cloudinary optimization
  const getOptimizedImageUrl = (url, options = {}) => {
    const { width = 300, height = 250, quality = 80 } = options;
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto,dpr_auto/`);
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (!hoverImageLoaded && item.images[1] && hasBeenVisible) {
      const img = new Image();
      img.onload = () => setHoverImageLoaded(true);
      img.src = getOptimizedImageUrl(item.images[1]);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setShowHoverImage(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowHoverImage(false);
  };
  const normalizedInfo = {};
Object.entries(item.additional_information || {}).forEach(([key, value]) => {
  normalizedInfo[key.trim()] = typeof value === "string" ? value.trim() : value;
});
  return (
    <div className="col" ref={cardRef}>
      <div className="tpproduct tpproductitem mb-15 p-relative">
        <div className="tpproduct__thumb">
          <div
            className="tpproduct__thumbitem p-relative"
            style={{ height: "250px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link href={`/shop/${item._id}`}>
              {/* Only load images when component is visible */}
              {hasBeenVisible ? (
                <>
                  <img
                    loading="lazy"
                    src={getOptimizedImageUrl(item.images[0])}
                    alt={item.name}
                    style={{ 
                      height: "250px", 
                      objectFit: "cover",
                      transition: "opacity 0.3s ease",
                      opacity: imageLoaded ? 1 : 0
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      console.error('Failed to load primary image:', e);
                      e.target.src = item.images[0];
                    }}
                  />
                  
                  {item.images[1] && showHoverImage && hoverImageLoaded && (
                    <img
                      className="thumbitem-secondary"
                      src={getOptimizedImageUrl(item.images[1])}
                      alt={`${item.name} - alternate view`}
                      style={{ 
                        height: "250px",
                        objectFit: "cover",
                        transition: "opacity 0.3s ease"
                      }}
                      onError={(e) => {
                        console.error('Failed to load hover image:', e);
                        e.target.src = item.images[1];
                      }}
                    />
                  )}
                </>
              ) : (
                // Placeholder while not visible
                <div 
                  style={{
                    height: "250px",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6c757d",
                    border: "1px solid #e9ecef"
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>📦</div>
                    <div style={{ fontSize: "12px" }}>Loading product...</div>
                  </div>
                </div>
              )}
              
              {hasBeenVisible && !imageLoaded && (
                <div 
                  style={{
                    height: "250px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </Link>
            
            <div className="tpproduct__thumb-bg">
              <div className="tpproductactionbg">
                <a
                  onClick={() => addToCart(item._id)}
                  className="add-to-cart"
                  role="button"
                  tabIndex={0}
                >
                  <i className="fal fa-shopping-basket" />
                </a>
                <Link href={`shop/${item._id}`}>
                  <i className="fal fa-eye" />
                </Link>
                <a
                  onClick={() => addToWishlist(item._id)}
                  className="wishlist"
                  role="button"
                  tabIndex={0}
                >
                  <i className="fal fa-heart" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tpproduct__content-area">
          <h3 className="tpproduct__title mb-5">
            <Link href={`/shop/${item._id}`}>{item.name}</Link>
          </h3>
          <div className="tpproduct__priceinfo p-relative">
            <div
              className="tpproduct__ammount"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>
                PKR{" "}
                {item.discounted_price
                  ? applyDiscount(item.price, item.discounted_price)
                  : item.price}
                .00
              </span>
              <span>{item.product_condition}/10</span>
            </div>
          </div>
          <div className="tpproduct__ammount" style={{display: "flex", justifyContent: "space-between"}}>
               Size: {normalizedInfo?.Size || "N/A"}
              </div>
        </div>
        
        <div className="tpproduct__ratingarea">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tpproductdot">
              {[...Array(4)].map((_, index) => (
                <Link
                  key={index}
                  className="tpproductdot__variationitem"
                  href={`/shop/${item._id}`}
                >
                  <div className="tpproductdot__termshape">
                    <span className={`tpproductdot__termshape-bg ${
                      index === 1 ? 'red-product-bg' : 
                      index === 2 ? 'orange-product-bg' : 
                      index === 3 ? 'purple-product-bg' : ''
                    }`} />
                    <span className={`tpproductdot__termshape-border ${
                      index === 1 ? 'red-product-border' : 
                      index === 2 ? 'orange-product-border' : 
                      index === 3 ? 'purple-product-border' : ''
                    }`} />
                  </div>
                </Link>
              ))}
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
                  <span> ({rating})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCardMain;