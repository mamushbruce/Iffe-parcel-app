
'use client'; // Make it a client component

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LineCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RotaryWheelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const RotaryWheelIcon: React.FC<RotaryWheelIconProps> = ({ className, size, ...props }) => {
  const iconSize = size || 24;
  // State to hold JSX for dynamically generated SVG elements
  const [dynamicElements, setDynamicElements] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Calculations are done on the client after mount
    const calculatedSpokes = [0, 60, 120, 180, 240, 300].map((angle) => {
      const rad = angle * Math.PI / 180;
      return {
        x1: 12,
        y1: 12,
        x2: 12 + 7 * Math.cos(rad),
        y2: 12 + 7 * Math.sin(rad),
      };
    });

    const calculatedTeeth = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = angle * Math.PI / 180;
      return {
        x1: 12 + 10 * Math.cos(rad),
        y1: 12 + 10 * Math.sin(rad),
        x2: 12 + 11.5 * Math.cos(rad),
        y2: 12 + 11.5 * Math.sin(rad),
      };
    });

    // Set the state with the JSX for all dynamic elements
    setDynamicElements(
      <>
        {/* 6 Spokes */}
        {calculatedSpokes.map((spoke, index) => (
          <line
            key={`spoke-${index}`}
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            strokeWidth="1.5"
          />
        ))}

        {/* Central Hub - Part 2 (inner circle that uses CSS var) */}
        <circle cx="12" cy="12" r="1.5" fill="var(--background, white)" stroke="currentColor" strokeWidth="0.5"/>

        {/* "Teeth" */}
        {calculatedTeeth.map((tooth, index) => (
          <line
            key={`tooth-${index}`}
            x1={tooth.x1}
            y1={tooth.y1}
            x2={tooth.x2}
            y2={tooth.y2}
            strokeWidth="2.5"
          />
        ))}
      </>
    );
  }, []); // Empty dependency array ensures this runs once on mount, on the client

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5" // Base strokeWidth, can be overridden by individual elements
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      {...props}
    >
      {/* Static elements rendered on both server and initial client render */}
      {/* Outer rim of the gear */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
      {/* Central Hub - Part 1 (solid fill, static) */}
      <circle cx="12" cy="12" r="3" fill="currentColor" strokeWidth="1"/>
      
      {/* Dynamically added elements, only rendered on client after useEffect has run */}
      {dynamicElements}
    </svg>
  );
};

export default RotaryWheelIcon;
