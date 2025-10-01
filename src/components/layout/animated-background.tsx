
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageObject {
  src: string;
  hint?: string;
}

interface AnimatedBackgroundProps {
  images: ImageObject[];
  onIndexChange?: (index: number) => void;
}

export default function AnimatedBackground({ images, onIndexChange }: AnimatedBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      if (onIndexChange) {
        onIndexChange(nextIndex);
      }
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, [currentIndex, images.length, onIndexChange]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt="Travel background"
          layout="fill"
          objectFit="cover"
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-20' : 'opacity-0'
          )}
          data-ai-hint={image.hint}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm pointer-events-none"></div>
    </div>
  );
}
