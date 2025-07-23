import Layout from "@/components/layout/Layout"
import FilterShopBox from "@/components/shop/FilterShopBox"
export const metadata = {
  title: 'BachatBzr - Shop | Buy Second-Hand & Vintage Branded Products at Low Prices | Shop Now',
  description: 'Shop second-hand, vintage, and branded products at the best prices. Explore affordable fashion, designer clothing, accessories, and more. Sustainable shopping starts here!',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'second-hand products',
    'vintage fashion',
    'branded products',
    'affordable shopping',
    'used items for sale',
    'designer clothing',
    'BachatBzr',
    "shoes",
    "tshirts",
    "shorts",
    'accessories',
    "tracksuits",
    "trousors",
    "bachatbzr",
    'discount shopping',
    'cheap branded clothes',
    'sustainable fashion'
  ],
  authors: [{ name: 'BachatBzr', url: 'https://bachatbzr.com',developer:"M Ismail Abbasi" }],
  creator: 'BachatBzr',
  publisher: 'BachatBzr',
  openGraph: {
    title: 'BachatBzr | Affordable Second-Hand & Vintage Shopping',
    description: 'Find unbeatable deals on second-hand and vintage branded products at BachatBzr. Start shopping smart today!',
    url: 'https://bachatbar.com/shoppage',
    siteName: 'BachatBzr',
    images: [
      {
        url: 'https://res.cloudinary.com/dzkoeyx3s/image/upload/v1750419010/Bachat_2_tap7mv.png', // Add an OG image for sharing
        width: 1200,
        height: 630,
        alt: 'BachatBzr Shop - Vintage & Branded Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL('https://bachatbzr.com'),
};


export default function Shop() {
    // mobile-p-10 in spacing.css
  
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop">
                <div className="product-filter-area pt-65 pb-65 mobile-p-10">
                    <div className="container">
                        <FilterShopBox />
                    </div>
                </div>

            </Layout>
        </>
    )
}