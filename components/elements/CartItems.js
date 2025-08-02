"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { deleteCart } from "@/features/shopSlice";
import { applyDiscount } from "@/lib/discountHandler";
import { Button } from "../ui/button";
import { useState, useRef, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Individual Cart Item Component with Lazy Loading
const CartItemRow = ({ item, onDelete }) => {
  const [rowRef, isVisible, hasBeenVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Cloudinary optimization for cart thumbnails
  const getOptimizedImageUrl = (url, options = {}) => {
    const { width = 100, height = 100, quality = 70 } = options;
    if (url && url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto,dpr_auto/`);
    }
    return url;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error('Failed to load cart image:', e);
    setImageError(true);
    // Fallback to original URL
    if (item.images?.[0]) {
      e.target.src = item.images[0];
    }
  };

  const handleDelete = useCallback(() => {
    onDelete(item._id);
  }, [item._id, onDelete]);

  return (
    <tr className="cart-item" key={item._id} ref={rowRef}>
      <td className="product-thumbnail">
        <Link href={`/shop/${item._id}`}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            position: "relative",
            overflow: "hidden",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa"
          }}>
            {hasBeenVisible ? (
              <>
                {!imageError ? (
                  <img 
                    src={getOptimizedImageUrl(item.images?.[0])}
                    alt={item.name || "cart product"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "opacity 0.3s ease",
                      opacity: imageLoaded ? 1 : 0
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  // Fallback when image fails to load
                  <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6c757d",
                    fontSize: "12px",
                    border: "1px solid #e9ecef"
                  }}>
                    📦
                  </div>
                )}
                
                {/* Loading state */}
                {!imageLoaded && !imageError && (
                  <div style={{
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
                  }}>
                    <div 
                      className="spinner-border spinner-border-sm text-primary" 
                      role="status"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Placeholder before image loads
              <div style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6c757d",
                fontSize: "10px",
                border: "1px solid #e9ecef"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "16px", marginBottom: "2px" }}>📦</div>
                  <div>Loading</div>
                </div>
              </div>
            )}
          </div>
        </Link>
      </td>

      <td className="product-name">
        <Link 
          href={`/shop/${item._id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "500"
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#007bff";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "inherit";
          }}
        >
          {item.name}
        </Link>
      </td>

      <td className="product-price">
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {item.discounted_price ? (
            <>
              <span style={{ 
                fontWeight: "600", 
                color: "#28a745",
                fontSize: "14px"
              }}>
                PKR {applyDiscount(item.price, item.discounted_price)}
              </span>
              <span style={{
                textDecoration: "line-through",
                color: "#dc3545",
                fontSize: "12px",
                opacity: 0.7
              }}>
                PKR {item.price}
              </span>
            </>
          ) : (
            <span style={{ 
              fontWeight: "600", 
              fontSize: "14px"
            }}>
              PKR {item.price}
            </span>
          )}
        </div>
      </td>

      <td className="product-remove">
        <Button
          variant="secondary"
          onClick={handleDelete}
          className="remove"
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.color = "white";
            e.target.style.borderColor = "#dc3545";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "";
            e.target.style.color = "";
            e.target.style.borderColor = "";
          }}
        >
          <span className="flaticon-dustbin">Remove</span>
        </Button>
      </td>
    </tr>
  );
};

// Main CartItems Component
const CartItems = () => {
  const { cart } = useSelector((state) => state.shop) || {};
  const dispatch = useDispatch();

  // Memoized delete handler to prevent unnecessary re-renders
  const deleteCartHandler = useCallback((id) => {
    dispatch(deleteCart(id));
  }, [dispatch]);

  // Handle empty cart state
  if (!cart || cart.length === 0) {
    return (
      <tr>
        <td colSpan="4" style={{ 
          textAlign: "center", 
          padding: "40px 20px",
          color: "#6c757d"
        }}>
          <div>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
            <h5 style={{ marginBottom: "8px" }}>Your cart is empty</h5>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              Add some products to get started!
            </p>
            <Link 
              href="/shop" 
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0056b3";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#007bff";
              }}
            >
              Browse Products
            </Link>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {cart.map((item) => (
        <CartItemRow 
          key={item._id} 
          item={item} 
          onDelete={deleteCartHandler}
        />
      ))}
    </>
  );
};

export default CartItems;