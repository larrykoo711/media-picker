import nextra from 'nextra';

const withNextra = nextra({
  // Enable copy button for all code blocks
  defaultShowCopyCode: true,
});

export default withNextra({
  transpilePackages: ['@larrykoo711/media-picker'],
  turbopack: {
    resolveAlias: {
      // Path to mdx-components file with extension
      'next-mdx-import-source-file': './src/mdx-components.tsx',
    },
  },
});
