
'use client';

import { useRef, useState, type MouseEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DockTextEffectProps {
  text: string;
  className?: string;
  scrollProgress?: number;
}

export default function DockTextEffect({ text, className, scrollProgress = 0 }: DockTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transforms, setTransforms] = useState<number[]>(Array(text.length).fill(1));
  const [isInitialAnimationActive, setIsInitialAnimationActive] = useState(true);

  // Function to calculate transformations based on a mouse X position
  const calculateTransforms = (mouseX: number) => {
    if (!containerRef.current) return Array(text.length).fill(1);
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    return text.split('').map((_, i) => {
      const charElement = containerRef.current?.children[i] as HTMLElement;
      if (!charElement) return 1;
      
      const charRect = charElement.getBoundingClientRect();
      const charCenterX = charRect.left - containerRect.left + charRect.width / 2;
      
      const distance = Math.abs(mouseX - charCenterX);
      const maxDistance = containerRect.width / 3; 
      
      if (distance > maxDistance) {
        return 1;
      }
      
      const scale = 1 + (1 - distance / maxDistance) * 0.8;
      return Math.max(1, scale);
    });
  };
  
  // Effect for initial animation and scroll-based animation
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    let virtualMouseX: number;

    if (scrollProgress > 0 && scrollProgress < 1) {
      // If actively scrolling within the progress range, use scroll progress
      if(isInitialAnimationActive) setIsInitialAnimationActive(false); // Disable initial animation if scrolling starts
      virtualMouseX = scrollProgress * containerWidth;
      setTransforms(calculateTransforms(virtualMouseX));
    } else if (isInitialAnimationActive) {
      // Run initial animation only if not scrolling
      let animationFrameId: number;
      const duration = 1500; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        virtualMouseX = progress * containerWidth;
        setTransforms(calculateTransforms(virtualMouseX));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
              if (containerRef.current) {
                 setTransforms(Array(text.length).fill(1));
                 setIsInitialAnimationActive(false);
              }
          }, 200);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, isInitialAnimationActive, text.length]);


  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isInitialAnimationActive || (scrollProgress > 0 && scrollProgress < 1)) return; // Disable manual hover during animations
    const virtualMouseX = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
    setTransforms(calculateTransforms(virtualMouseX));
  };

  const handleMouseLeave = () => {
    if (isInitialAnimationActive || (scrollProgress > 0 && scrollProgress < 1)) return;
    setTransforms(Array(text.length).fill(1));
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{ 
              transform: `scale(${transforms[i]})`, 
              transformOrigin: 'bottom',
              transition: (isInitialAnimationActive || (scrollProgress > 0 && scrollProgress < 1)) ? 'none' : 'transform 0.1s ease-out',
           }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
