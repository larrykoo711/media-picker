'use client';

import dynamic from 'next/dynamic';

// Dynamically import all demo components with SSR disabled
export const BasicDemo = dynamic(
  () => import('./Demo').then((mod) => mod.BasicDemo),
  { ssr: false, loading: () => <DemoLoading /> }
);

export const MultipleDemo = dynamic(
  () => import('./Demo').then((mod) => mod.MultipleDemo),
  { ssr: false, loading: () => <DemoLoading /> }
);

export const CallbacksDemo = dynamic(
  () => import('./Demo').then((mod) => mod.CallbacksDemo),
  { ssr: false, loading: () => <DemoLoading /> }
);

export const I18nDemo = dynamic(
  () => import('./Demo').then((mod) => mod.I18nDemo),
  { ssr: false, loading: () => <DemoLoading /> }
);

export const ControlledDemo = dynamic(
  () => import('./Demo').then((mod) => mod.ControlledDemo),
  { ssr: false, loading: () => <DemoLoading /> }
);

function DemoLoading() {
  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    </div>
  );
}
