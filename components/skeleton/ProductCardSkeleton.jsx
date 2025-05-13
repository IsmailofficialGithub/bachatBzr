import React, { useEffect, useState } from 'react';

const ProductSkeleton = () => {
  const [isMounted, setIsMounted] = useState(false);

  // This effect will run after the component mounts on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inline styles
  const skeletonStyles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: '20px',
      padding: '20px',
      background: '#ffffff',
    },
    card: {
      width: '400px',
      border: '1px solid #eee',
      borderRadius: '12px',
      padding: '16px',
      background: '#fff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    image: {
      width: '100%',
      height: '200px',
      borderRadius: '8px',
      background: '#e0e0e0',
      marginBottom: '12px',
    },
    text: {
      height: '16px',
      background: '#e0e0e0',
      borderRadius: '4px',
      marginBottom: '8px',
    },
    title: {
      width: '40%',
    },
    price: {
      width: '60%',
      height: '18px',
    },
    rating: {
      width: '20%',
    },
    shimmer: {
      position: 'relative',
      overflow: 'hidden',
    },
    shimmerBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-150px',
      height: '100%',
      width: '150px',
      background: 'linear-gradient(to right, transparent 0%, #f0f0f0 50%, transparent 100%)',
      animation: 'shimmer 1.5s infinite',
    },
  };

  // Adding shimmer animation to the `@keyframes` in the style tag
  const shimmerAnimation = `
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `;

  if (!isMounted) return null; // Avoid rendering during SSR

  return (
    <>
      <style>{shimmerAnimation}</style> {/* Add shimmer animation */}
      <div style={skeletonStyles.wrapper}>
        {Array.from({ length: 1 }).map((_, index) => (
          <div style={skeletonStyles.card} key={index}>
            <div style={{ ...skeletonStyles.image, ...skeletonStyles.shimmer }} />
            <div style={{ ...skeletonStyles.text, ...skeletonStyles.title, ...skeletonStyles.shimmer }} />
            <div style={{ ...skeletonStyles.text, ...skeletonStyles.price, ...skeletonStyles.shimmer }} />
            <div style={{ ...skeletonStyles.text, ...skeletonStyles.rating, ...skeletonStyles.shimmer }} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductSkeleton;
