'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { MediaPickerButton, type MediaItem, configurePexelsClient } from '@koo-labs/media-picker';
import { ShikiCode } from './ShikiCode';

// Configure API proxy
if (typeof window !== 'undefined') {
  configurePexelsClient({
    proxyUrl: '/api/pexels',
  });
}

// Installation command component with copy button
function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'pnpm add @koo-labs/media-picker';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative inline-flex items-center gap-3 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 rounded-lg text-sm border border-gray-700 dark:border-gray-300 hover:border-gray-600 dark:hover:border-gray-400 transition-colors">
      <span className="text-gray-500 dark:text-gray-500 select-none font-mono">$</span>
      <code className="text-gray-100 dark:text-gray-900 font-mono bg-transparent">{command}</code>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-700"
        title="Copy to clipboard"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-500">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" />
          </svg>
        )}
      </button>
    </div>
  );
}

// Feature badge
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
      {children}
    </span>
  );
}

// Thumbnail preview
function MediaThumbnail({ media }: { media: MediaItem }) {
  const isVideo = media.type === 'video';
  const thumbnailUrl = isVideo
    ? (media as { image?: string }).image || (media as { video_pictures?: Array<{ picture: string }> }).video_pictures?.[0]?.picture
    : (media as { src?: { medium?: string } }).src?.medium;

  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={(media as { alt?: string }).alt || 'Selected media'}
          className="w-full h-full object-cover"
        />
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Live Demo Section
function LiveDemo() {
  const [media, setMedia] = useState<MediaItem | null>(null);

  const handleSelect = useCallback((m: MediaItem | MediaItem[]) => {
    setMedia(Array.isArray(m) ? m[0] : m);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <MediaPickerButton
          onSelect={handleSelect}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
        >
          Open Picker
        </MediaPickerButton>
        {media && <MediaThumbnail media={media} />}
      </div>
      {media && (
        <ShikiCode
          code={JSON.stringify(media, null, 2)}
          lang="json"
          filename="response.json"
          theme="dracula"
        />
      )}
    </div>
  );
}

// Quick start code
const quickStartCode = `import { MediaPickerButton } from '@koo-labs/media-picker';
import '@koo-labs/media-picker/styles.css';

function App() {
  return (
    <MediaPickerButton onSelect={(media) => console.log(media)}>
      Select Media
    </MediaPickerButton>
  );
}`;

// Hero Section
export function HeroSection() {
  return (
    <section className="pt-16 pb-12 md:pt-20 md:pb-16">
      <div className="max-w-3xl">
        {/* Tagline - Main headline */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          <span>Media Picker</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-500 ml-4">by LarryKoo</span>
        </h1>

        {/* Description */}
        <p className="text-base text-gray-500 dark:text-gray-400 mb-4 max-w-2xl">
          Feed your AI with unlimited free media.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge>React</Badge>
          <Badge>TypeScript</Badge>
          <Badge>MIT</Badge>
          <Badge>Free for commercial use</Badge>
        </div>

        {/* Install command */}
        <div className="mb-6">
          <InstallCommand />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/docs/installation"
            className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors no-underline text-sm"
          >
            Get Started
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href="https://github.com/larrykoo711/media-picker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors no-underline text-sm"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

// Features Section
export function FeaturesSection() {
  const features = [
    {
      title: 'Prompt Reference',
      description: 'High-quality reference materials for AI art and image generation.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      title: 'Multimodal Input',
      description: 'Get images/videos with one click, feed to your AI models.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      ),
    },
    {
      title: 'Semantic Search',
      description: 'Use natural language to find exactly what you need.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: 'AI-Ready Output',
      description: 'Structured data that integrates seamlessly with your AI workflow.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 border-t border-dashed border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-8">
        Built for AI Developers
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Screenshot Section with Try it button
export function ScreenshotSection() {
  return (
    <section className="py-16 border-t border-dashed border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preview
        </h2>
        <MediaPickerButton
          onSelect={() => {}}
          className="inline-flex items-center px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
        >
          Try it
        </MediaPickerButton>
      </div>

      {/* Description above screenshot */}
      <div className="mb-4 space-y-1">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          A beautiful, responsive media picker with photos and videos tabs.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Built for AIGC applications.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Zero copyright concerns.
        </p>
      </div>

      {/* Screenshot with browser-like frame */}
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md max-w-xs" />
          </div>
        </div>
        {/* Screenshot */}
        <div className="relative">
          <Image
            src="/media-picker-screenshot.png"
            alt="Media Picker Screenshot"
            width={1280}
            height={720}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}

// Demo Section
export function DemoSection() {
  return (
    <section className="py-16 border-t border-dashed border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Try it
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
        Click the button, select media, get structured data.
      </p>

      <LiveDemo />
    </section>
  );
}

// Quick Start Section
export function QuickStartSection() {
  return (
    <section className="py-16 border-t border-dashed border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Quick Start
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
        Get up and running in minutes.
      </p>

      <ShikiCode code={quickStartCode} lang="tsx" filename="App.tsx" theme="dracula" />

      <div className="mt-6">
        <Link
          href="/docs"
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors no-underline"
        >
          Read the documentation
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// Footer Section
export function FooterSection() {
  return (
    <footer className="py-12 border-t border-dashed border-gray-200 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/larrykoo711/media-picker/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white no-underline transition-colors"
          >
            MIT
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <a
            href="https://github.com/larrykoo711"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white no-underline transition-colors"
          >
            @larrykoo711
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <a
            href="mailto:larrykoo711@gmail.com"
            className="hover:text-gray-900 dark:hover:text-white no-underline transition-colors"
          >
            Email
          </a>
        </div>
        <div className="flex items-center gap-1">
          Powered by{' '}
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white no-underline transition-colors"
          >
            Pexels
          </a>
        </div>
      </div>
    </footer>
  );
}

// Full Home Page
export function HomePage() {
  return (
    <div className="homepage-wrapper">
      <main className="max-w-3xl mx-auto px-4">
        <HeroSection />
        <ScreenshotSection />
        <FeaturesSection />
        <DemoSection />
        <QuickStartSection />
      </main>
    </div>
  );
}
