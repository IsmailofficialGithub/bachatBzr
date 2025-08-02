// Complete working solution with navigation buttons
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Import Swiper styles - ADD THESE TO YOUR MAIN CSS FILE OR COMPONENT
// import 'swiper/css';
// import 'swiper/css/navigation';

// Individual Related Product Card Component
const RelatedProductCard = ({ 
  relatedproduct, 
  RelatedaddToCart, 
  RelatedaddToWishlist, 
  applyDiscount 
}) => {
  const [cardRef, isVisible, hasBeenVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
  const [showHoverImage, setShowHoverImage] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const getOptimizedImageUrl = (url, options = {}) => {
    const { width = 300, height = 250, quality = 75 } = options;
    if (url && url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto,dpr_auto/`);
    }
    return url;
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (!hoverImageLoaded && relatedproduct.images?.[1] && hasBeenVisible) {
      const img = new Image();
      img.onload = () => setHoverImageLoaded(true);
      img.src = getOptimizedImageUrl(relatedproduct.images[1]);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setShowHoverImage(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowHoverImage(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="tpproduct pb-15 mb-30" ref={cardRef}>
      <div className="tpproduct__thumb p-relative">
        <Link href={`/shop/${relatedproduct._id}`}>
          <div
            style={{ height: "250px", position: "relative", overflow: "hidden" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {hasBeenVisible ? (
              <>
                <img
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "250px",
                    transition: "opacity 0.3s ease",
                    opacity: primaryImageLoaded ? 1 : 0
                  }}
                  src={getOptimizedImageUrl(relatedproduct.images?.[0])}
                  alt={relatedproduct.name}
                  onLoad={() => setPrimaryImageLoaded(true)}
                  onError={(e) => {
                    console.error('Failed to load primary image:', e);
                    if (relatedproduct.images?.[0]) {
                      e.target.src = relatedproduct.images[0];
                    }
                  }}
                />
                
                {relatedproduct.images?.[1] && showHoverImage && hoverImageLoaded && (
                  <img
                    loading="lazy"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "250px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 0.3s ease"
                    }}
                    className="product-thumb-secondary"
                    src={getOptimizedImageUrl(relatedproduct.images[1])}
                    alt={`${relatedproduct.name} - alternate view`}
                    onError={(e) => {
                      console.error('Failed to load hover image:', e);
                      e.target.src = relatedproduct.images[1];
                    }}
                  />
                )}
              </>
            ) : (
              <div 
                style={{
                  height: "250px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6c757d",
                  border: "1px solid #e9ecef",
                  borderRadius: "4px"
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "18px", marginBottom: "6px" }}>📦</div>
                  <div style={{ fontSize: "10px", fontWeight: "500" }}>
                    {relatedproduct.name?.slice(0, 20)}...
                  </div>
                </div>
              </div>
            )}
            
            {hasBeenVisible && !primaryImageLoaded && (
              <div 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(248, 249, 250, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1
                }}
              >
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {primaryImageLoaded && (
          <div className="tpproduct__thumb-action" style={{ marginTop: "20px" }}>
            <Link className="quckview" href={`/shop/${relatedproduct._id}`}>
              <i className="fal fa-eye" />
            </Link>
            <Link
              className="wishlist"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                RelatedaddToWishlist(relatedproduct);
              }}
            >
              <i className="fal fa-heart" />
            </Link>
          </div>
        )}
      </div>
      
      <div className="tpproduct__content">
        <h3 className="tpproduct__title">
          <Link href={`/shop/${relatedproduct._id}`}>
            {relatedproduct.name}
          </Link>
        </h3>
        <div className="tpproduct__priceinfo p-relative">
          <div className="tpproduct__priceinfo-list">
            <span>
              {relatedproduct.discounted_price ? (
                <>
                  <span>
                    PKR{" "}
                    {applyDiscount(relatedproduct.price, relatedproduct.discounted_price)}
                  </span>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "red",
                      marginLeft: "8px",
                      fontSize: "0.9em"
                    }}
                  >
                    PKR {relatedproduct.price}
                  </span>
                </>
              ) : (
                `PKR ${relatedproduct.price}`
              )}
            </span>
          </div>
          <div className="tpproduct__cart">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                RelatedaddToCart(relatedproduct);
              }}
            >
              <i className="fal fa-shopping-cart" />
              Add To Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Related Products Component with Working Navigation
const OptimizedRelatedProducts = ({ 
  relatedProducts, 
  RelatedaddToCart, 
  RelatedaddToWishlist, 
  applyDiscount 
}) => {
  const [sectionRef, isSectionVisible, hasSectionBeenVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  const [swiperInstance, setSwiperInstance] = useState(null);

  // Manual navigation handlers
  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  // Swiper configuration
  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 4,
    spaceBetween: 30,
    onSwiper: (swiper) => {
      setSwiperInstance(swiper);
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 1,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
    watchOverflow: true,
    observer: true,
    observeParents: true,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    allowTouchMove: true,
    loop: relatedProducts && relatedProducts.length > 4,
  };

  return (
    <div className="related-product-area pb-50 related-product-border" ref={sectionRef}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-6 mt-10">
            <div className="tpsection mb-10">
              <h4 className="tpsection__title">Related Products</h4>
            </div>
          </div>
          <div className="col-sm-6">
            {/* Navigation arrows with manual click handlers */}
            {relatedProducts && relatedProducts.length > 1 && (
              <div className="tprelated__arrow d-flex align-items-center justify-content-end sm:mb-7 mb-0">
                <div 
                  className="tprelated__prv"
                  onClick={handlePrev}
                  style={{ 
                    cursor: 'pointer',
                    padding: '12px',
                    marginRight: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = 'inherit';
                  }}
                >
                  <i className="far fa-long-arrow-left" />
                </div>
                <div 
                  className="tprelated__nxt"
                  onClick={handleNext}
                  style={{ 
                    cursor: 'pointer',
                    padding: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = 'inherit';
                  }}
                >
                  <i className="far fa-long-arrow-right" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="swiper-container related-product-active">
          {!relatedProducts || relatedProducts.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px 0",
              color: "#6c757d"
            }}>
              <h5>No Related Products Found</h5>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>
                We couldn't find any related products at the moment.
              </p>
            </div>
          ) : (
            hasSectionBeenVisible ? (
              <Swiper {...swiperOptions}>
                {relatedProducts.map((relatedproduct) => (
                  <SwiperSlide key={relatedproduct._id}>
                    <RelatedProductCard
                      relatedproduct={relatedproduct}
                      RelatedaddToCart={RelatedaddToCart}
                      RelatedaddToWishlist={RelatedaddToWishlist}
                      applyDiscount={applyDiscount}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={{ 
                display: "flex", 
                gap: "20px", 
                padding: "20px 0",
                overflowX: "auto"
              }}>
                {[...Array(Math.min(4, relatedProducts.length))].map((_, index) => (
                  <div 
                    key={index}
                    style={{
                      minWidth: "250px",
                      height: "350px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6c757d"
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "20px", marginBottom: "8px" }}>📦</div>
                      <div style={{ fontSize: "12px" }}>Related Products</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedRelatedProducts;