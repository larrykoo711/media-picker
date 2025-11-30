'use client';

import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';

interface ShikiCodeProps {
  code: string;
  lang?: string;
  filename?: string;
  theme?: 'inverted' | 'dracula';
}

// Copy button component - Nextra style
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="cursor-pointer rounded p-1.5 ms-auto text-xs transition opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      title="Copy code"
      type="button"
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
  );
}

export function ShikiCode({ code, lang = 'json', filename, theme = 'inverted' }: ShikiCodeProps) {
  const [lightHtml, setLightHtml] = useState<string>('');
  const [darkHtml, setDarkHtml] = useState<string>('');
  const [draculaHtml, setDraculaHtml] = useState<string>('');

  // Highlight code with themes
  useEffect(() => {
    const highlight = async () => {
      try {
        if (theme === 'dracula') {
          const result = await codeToHtml(code, { lang, theme: 'dracula' });
          setDraculaHtml(result);
        } else {
          const [light, dark] = await Promise.all([
            codeToHtml(code, { lang, theme: 'github-light' }),
            codeToHtml(code, { lang, theme: 'github-dark' }),
          ]);
          setLightHtml(light);
          setDarkHtml(dark);
        }
      } catch {
        // Fallback to plain text if highlighting fails
        const fallback = `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
        setLightHtml(fallback);
        setDarkHtml(fallback);
        setDraculaHtml(fallback);
      }
    };
    highlight();
  }, [code, lang, theme]);

  // Dracula theme - always dark
  if (theme === 'dracula') {
    return (
      <div className="group w-full nextra-code relative rounded-md overflow-hidden border border-[#44475a]">
        {/* Header with filename - dracula style */}
        {filename && (
          <div className="px-3 text-xs text-gray-300 bg-[#282a36] flex items-center h-10 gap-2 border-b border-[#44475a]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <path d="M13 2v7h7" />
            </svg>
            <span className="truncate font-medium">{filename}</span>
            <CopyButton text={code} />
          </div>
        )}
        {/* Code content - Dracula theme */}
        <div
          className="shiki-wrapper overflow-x-auto subpixel-antialiased text-sm bg-[#282a36] max-h-80 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: draculaHtml }}
        />
        {/* Copy button when no filename */}
        {!filename && (
          <div className="absolute top-2 right-2">
            <CopyButton text={code} />
          </div>
        )}
      </div>
    );
  }

  // Inverted theme (default)
  return (
    <div className="group w-full nextra-code relative rounded-md overflow-hidden border border-gray-700 dark:border-gray-200">
      {/* Header with filename - inverted colors */}
      {filename && (
        <div className="px-3 text-xs text-gray-400 dark:text-gray-600 bg-gray-800 dark:bg-gray-100 flex items-center h-10 gap-2 border-b border-gray-700 dark:border-gray-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <path d="M13 2v7h7" />
          </svg>
          <span className="truncate font-medium">{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      {/* Code content - Light mode shows dark theme (inverted) */}
      <div
        className="shiki-wrapper block dark:hidden overflow-x-auto subpixel-antialiased text-sm bg-gray-900 max-h-80 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
      {/* Code content - Dark mode shows light theme (inverted) */}
      <div
        className="shiki-wrapper hidden dark:block overflow-x-auto subpixel-antialiased text-sm bg-gray-50 max-h-80 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      {/* Copy button when no filename */}
      {!filename && (
        <div className="absolute top-2 right-2">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}
