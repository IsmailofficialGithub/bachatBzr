import SingleCategories from './singleCategory';
import theme from '@/data';

export default function Page({ params }) {
  return <SingleCategories slug={params.slug} />;
}

// 👇 This adds SEO metadata for each category
export async function generateMetadata({ params }) {
  const { slug } = params;

  const meta = {
    title: `${slug} - Second-Hand & Branded Deals | BachatBzr`,
    description: `Explore great deals on ${slug} items at low prices. Shop second-hand and vintage items on BachatBzr.`,
    image: theme.websiteLogoUrl,
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://bachatbzr.com/category/${slug}`,
      siteName: 'BachatBzr',
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      type: 'website',
    },
  };
}
