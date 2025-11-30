import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';

// Get the default MDX components from nextra-theme-docs
const themeComponents = getThemeComponents();

// Merge components - client components should be imported directly in MDX files
export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...themeComponents,
    ...components,
  };
}
