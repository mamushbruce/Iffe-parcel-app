
'use client';

import { useEffect } from 'react';

export function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else { // System preference if no stored theme
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return <>{children}</>;
}
