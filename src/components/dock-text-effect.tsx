
'use client';

import { useRef, useState, type MouseEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DockTextEffectProps {
  text: string;
  className?: string;
}

export default function DockTextEffect({ text, className }: DockTextEffectProps) {
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
  
  // Effect for initial animation on load
  useEffect(() => {
    let animationFrameId: number;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const virtualMouseX = progress * containerWidth;
        setTransforms(calculateTransforms(virtualMouseX));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // End of animation, reset and enable manual hover
        setTimeout(() => {
            if (containerRef.current) { // Ensure ref is still valid
               setTransforms(Array(text.length).fill(1));
               setIsInitialAnimationActive(false);
            }
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text.length]);


  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isInitialAnimationActive) return; // Disable manual hover during initial animation
    const virtualMouseX = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
    setTransforms(calculateTransforms(virtualMouseX));
  };

  const handleMouseLeave = () => {
    if (isInitialAnimationActive) return;
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
              transition: isInitialAnimationActive ? 'none' : 'transform 0.1s ease-out',
           }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
