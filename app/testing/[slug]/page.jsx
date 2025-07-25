// app/category/[slug]/page.jsx
import { notFound } from 'next/navigation';

// Fake example data source (replace with your API or DB)
const categories = {
  fashion: {
    title: 'Fashion - Shop Stylish Second-Hand & Vintage Clothes',
    description: 'Explore affordable second-hand and branded fashion items. Vintage clothing and accessories at unbeatable prices.',
  },
  electronics: {
    title: 'Electronics - Buy Used & Refurbished Gadgets Online',
    description: 'Shop reliable second-hand electronics including phones, laptops, and more. High quality, low price.',
  },
};

export async function generateMetadata({ params }) {
  const { slug } = params;

  const category = categories[slug];

  if (!category) {
    return notFound(); // or return default metadata
  }

  return {
    title: `BachatBzr - ${category.title}`,
    description: category.description,
    openGraph: {
      title: `BachatBzr - ${category.title}`,
      description: category.description,
      url: `https://yourdomain.com/category/${slug}`,
      siteName: 'BachatBzr',
      images: [
        {
          url: `https://yourdomain.com/images/og/${slug}.jpg`, // dynamic og image per category
          width: 1200,
          height: 630,
          alt: `${category.title} - BachatBzr`,
        },
      ],
      type: 'website',
    },
  };
}
