export const metadata = {
  title: 'Notification - BachatBzr | Your Second-Hand & Vintage Items',
  description: 'Review your cart items from BachatBzr. Shop second-hand, vintage, and branded products at unbeatable prices. Secure checkout and fast delivery available.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'shopping cart',
    'cart items',
    'second-hand products',
    'vintage fashion',
    'branded products',
    'affordable shopping',
    'used items for sale',
    'designer clothing',
    'BachatBzr',
    'shoes',
    'tshirts',
    'shorts',
    'accessories',
    'tracksuits',
    'trousors',
    'bachatbzr',
    'discount shopping',
    'cheap branded clothes',
    'sustainable fashion',
    'checkout',
    'buy now'
  ],
  authors: [{ name: 'BachatBzr', url: 'https://bachatbzr.com', developer: "M Ismail Abbasi" }],
  creator: 'BachatBzr',
  publisher: 'BachatBzr',
  openGraph: {
    title: 'Shopping Cart - BachatBzr | Review Your Items',
    description: 'Review your selected second-hand and vintage branded products. Complete your purchase with secure checkout at BachatBzr.',
    url: 'https://bachatbzr.com/cart',
    siteName: 'BachatBzr',
    images: [
      {
        url: 'https://res.cloudinary.com/dzkoeyx3s/image/upload/v1750419010/Bachat_2_tap7mv.png',
        width: 1200,
        height: 630,
        alt: 'BachatBzr Cart - Vintage & Branded Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL('https://bachatbzr.com'),
};

export default function CartLayout({ children }) {
  return children;
}