
'use client';

import { useEffect, useState } from 'react';

export function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [mounted]);

  // To avoid a flash of unstyled content or the wrong theme, we can render nothing or a loader until mounted.
  // This ensures the correct theme is applied before children are visible.
  if (!mounted) {
    return null; // Or return a loading skeleton if you prefer
  }

  return <>{children}</>;
}
