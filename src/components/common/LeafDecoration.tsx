import React from 'react';

interface LeafDecorationProps {
  className?: string;
  size?: number;
  color?: string;
  variant?: 'single' | 'branch' | 'cluster';
}

export const LeafDecoration: React.FC<LeafDecorationProps> = ({
  className = '',
  size = 48,
  color = '#8CCB55',
  variant = 'single',
}) => {
  if (variant === 'branch') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none opacity-25 ${className}`}
      >
        <path
          d="M10 90 Q40 50 80 15"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M35 60 C30 45 45 40 55 50 C45 65 35 60 35 60 Z"
          fill={color}
        />
        <path
          d="M55 40 C65 25 80 30 75 45 C60 45 55 40 55 40 Z"
          fill={color}
        />
        <path
          d="M70 25 C75 10 90 15 85 28 C75 30 70 25 70 25 Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none opacity-25 ${className}`}
    >
      <path
        d="M8 56 C20 40 30 20 56 8 C44 24 36 44 8 56 Z"
        fill={color}
      />
      <path
        d="M16 48 C28 36 38 24 50 14"
        stroke="#075B2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
};
