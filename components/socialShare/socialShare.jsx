// components/SocialShare.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
const SocialShare = ({ title }) => {
  const router = useRouter();
  
  // Get the current absolute URL by combining the base URL with the current path
  const getShareUrl = () => {
    // In client-side, window is available
    if (typeof window !== 'undefined') {
      return encodeURIComponent(window.location.href);
    }
    // During SSR, we need to construct the URL
    return '';
  };

  // Handle share action for different platforms
  const handleShare = (e, platform) => {
    e.preventDefault();
    
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const shareUrl = getShareUrl();
    const shareTitle = encodeURIComponent(title || document.title);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
toast.error('Instagram does not support direct URL sharing. URL copied to clipboard!');
        navigator.clipboard.writeText(decodeURIComponent(shareUrl));
        return;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${shareTitle} ${shareUrl}`;
        break;
      default:
        return;
    }
    
    // Open share dialog in a new window
    window.open(shareLink, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="tpproduct-details__information tpproduct-details__social">
      <p>Share:</p>
      <Link href="#" onClick={(e) => handleShare(e, 'facebook')}>
        <i className="fab fa-facebook-f" />
      </Link>
      <Link href="#" onClick={(e) => handleShare(e, 'twitter')}>
        <i className="fab fa-twitter" />
      </Link>
      <Link href="#" onClick={(e) => handleShare(e, 'instagram')}>
        <i className="fab fa-instagram" />
      </Link>
      <Link href="#" onClick={(e) => handleShare(e, 'whatsapp')}>
        <i className="fab fa-whatsapp" />
      </Link>
    </div>
  );
};

export default SocialShare;