import BlogsPage from './BlogsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs | GFI UAE',
  description:
    'Explore our latest insights, stories, and updates. From expert tips to company news, our blog keeps you informed and inspired.',
  keywords: [
    'blogs',
    'GFI UAE',
    'office partitions',
    'movable walls',
    'HPL solutions',
    'pivot doors',
    'glass partitions'
  ],
  openGraph: {
    title: 'Blogs | GFI UAE',
    description:
      'Explore our latest insights, stories, and updates. From expert tips to company news, our blog keeps you informed and inspired.',
    url: 'https://gfiuae.com/blogs',
    siteName: 'GFI UAE',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs | GFI UAE',
    description:
      'Explore our latest insights, stories, and updates. From expert tips to company news, our blog keeps you informed and inspired.',
    images: ['/og-default.jpg']
  }
};

export default function Page() {
  return <BlogsPage />;
}
