import React from 'react';

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  fillColor?: string;
  className?: string;
  variant?: 'gentle' | 'organic' | 'layered';
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  position = 'bottom',
  fillColor = '#EFF7E9',
  className = '',
  variant = 'gentle',
}) => {
  const isTop = position === 'top';

  if (variant === 'layered') {
    return (
      <div
        className={`w-full overflow-hidden leading-none ${
          isTop ? 'rotate-180 -mb-1' : '-mt-1'
        } ${className}`}
      >
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
            fill={fillColor}
            opacity="0.4"
          ></path>
          <path
            d="M0,20 C200,100 450,10 700,70 C950,130 1100,50 1200,60 L1200,120 L0,120 Z"
            fill={fillColor}
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden leading-none ${
        isTop ? 'rotate-180 -mb-1' : '-mt-1'
      } ${className}`}
    >
      <svg
        className="relative block w-full h-6 sm:h-10 md:h-14"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
          fill={fillColor}
        ></path>
      </svg>
    </div>
  );
};
