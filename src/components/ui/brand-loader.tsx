
'use client';

import { cn } from '@/lib/utils';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center md:flex-col bg-background z-[100] p-4 relative">
      {/* Spinner */}
      <div
        className={cn(
          "animate-spin rounded-full border-primary",
          // Mobile: Full-size, behind, blurred, semi-transparent
          "absolute inset-0 m-auto h-48 w-48 border-t-8 blur-md z-10 opacity-40", 
          // Tablet/Small Desktop: Relative, above text, standard size
          "md:relative md:inset-auto md:m-0 md:h-32 md:w-32 md:border-t-[6px] md:blur-none md:z-auto md:opacity-100 md:mb-6",
          // Large Desktop: Larger spinner
          "lg:h-40 lg:w-40 lg:border-t-[8px]"
        )}
        aria-label="Loading..."
      />
      
      {/* Text Container */}
      <div className={cn(
        "text-center animate-fade-in animate-pulse-slow",
        // Mobile: Relative to stack above spinner
        "relative z-20",
        // Desktop: Static flow
        "md:static" 
      )}>
        <div className="font-black uppercase text-foreground text-4xl sm:text-5xl md:text-6xl tracking-wider">
          ROTARACT
        </div>
        <div className="font-black uppercase text-foreground text-4xl sm:text-5xl md:text-6xl tracking-[0.23em] xxs:tracking-[0.25em] xs:tracking-[0.28em] sm:tracking-[0.31em] md:tracking-[0.33em] lg:tracking-[0.35em] xl:tracking-[0.37em] 2xl:tracking-[0.39em]">
          E HUB
        </div>
      </div>
    </div>
  );
}
