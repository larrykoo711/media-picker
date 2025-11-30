import type { Metadata } from 'next';
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://media-picker.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Media Picker - React Media Picker for AIGC Apps',
    template: '%s - Media Picker',
  },
  description:
    'A beautiful React media picker component powered by Pexels. Feed your AI with unlimited free media. Zero config, MIT licensed.',
  keywords: [
    'react',
    'media picker',
    'image picker',
    'video picker',
    'pexels',
    'aigc',
    'ai',
    'react component',
    'typescript',
    'free images',
    'free videos',
    'stock media',
  ],
  authors: [{ name: 'LarryKoo', url: 'https://github.com/larrykoo711' }],
  creator: 'LarryKoo',
  publisher: 'LarryKoo',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Media Picker',
    title: 'Media Picker - React Media Picker for AIGC Apps',
    description: 'A beautiful React media picker component powered by Pexels. Feed your AI with unlimited free media.',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Media Picker - React Media Picker for AIGC Apps',
    description: 'A beautiful React media picker component powered by Pexels. Feed your AI with unlimited free media.',
    creator: '@larrykoo711',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },

  // Alternates
  alternates: {
    canonical: siteUrl,
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Category
  category: 'technology',
};

const navbar = (
  <Navbar
    logo={
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-lg">Media Picker</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          by LarryKoo
        </span>
      </div>
    }
    projectLink="https://github.com/larrykoo711/media-picker"
  >
    <ThemeSwitch lite />
  </Navbar>
);

const footer = (
  <Footer>
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-sm">
      <div className="flex items-center gap-4">
        <span>MIT © {new Date().getFullYear()} LarryKoo</span>
        <span className="hidden sm:inline text-gray-300 dark:text-gray-700">·</span>
        <a
          href="https://github.com/larrykoo711"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          GitHub
        </a>
        <span className="text-gray-300 dark:text-gray-700">·</span>
        <a
          href="mailto:larrykoo711@gmail.com"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Email
        </a>
      </div>
      <div className="flex items-center gap-1 text-gray-400">
        <span>Powered by</span>
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Pexels
        </a>
      </div>
    </div>
  </Footer>
);

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'Media Picker',
  description: 'A beautiful React media picker component powered by Pexels. Feed your AI with unlimited free media.',
  url: 'https://media-picker.vercel.app',
  codeRepository: 'https://github.com/larrykoo711/media-picker',
  programmingLanguage: ['TypeScript', 'React'],
  license: 'https://opensource.org/licenses/MIT',
  author: {
    '@type': 'Person',
    name: 'LarryKoo',
    url: 'https://github.com/larrykoo711',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/larrykoo711/media-picker/tree/main/examples/docs"
          editLink=""
          feedback={{ content: null }}
          sidebar={{ autoCollapse: true }}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
