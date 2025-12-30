
'use client';

import { useRef, useState, type MouseEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DockTextEffectProps {
  text: string;
  className?: string;
  animationTrigger?: 'idle' | 'forward' | 'backward';
}

export default function DockTextEffect({ text, className, animationTrigger = 'idle' }: DockTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transforms, setTransforms] = useState<number[]>(Array(text.length).fill(1));
  const [isAnimating, setIsAnimating] = useState(false);

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
  
  useEffect(() => {
    if (!containerRef.current || animationTrigger === 'idle') return;

    let animationFrameId: number;
    const duration = 1500; // ms
    const startTime = performance.now();
    const containerWidth = containerRef.current.offsetWidth;
    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      let progress = Math.min(elapsedTime / duration, 1);
      
      if(animationTrigger === 'backward') {
        progress = 1 - progress;
      }

      const virtualMouseX = progress * containerWidth;
      setTransforms(calculateTransforms(virtualMouseX));

      if ((animationTrigger === 'forward' && progress < 1) || (animationTrigger === 'backward' && progress > 0)) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        // Reset to normal state after animation if not hovering
        setTimeout(() => {
             if (containerRef.current) {
               setTransforms(Array(text.length).fill(1));
             }
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTrigger]);


  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return; // Disable manual hover during animations
    const virtualMouseX = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
    setTransforms(calculateTransforms(virtualMouseX));
  };

  const handleMouseLeave = () => {
    if (isAnimating) return;
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
              transition: isAnimating ? 'none' : 'transform 0.1s ease-out',
           }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
