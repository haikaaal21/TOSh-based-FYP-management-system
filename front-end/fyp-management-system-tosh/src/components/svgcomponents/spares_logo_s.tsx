import React, { SVGProps } from 'react';

interface SparesLogoSProps extends SVGProps<SVGSVGElement> {
  fill?: string;
  fill2?: string;
}

const SparesLogoS: React.FC<SparesLogoSProps> = ({
  fill2 = ' #9f71b1',
  fill = '#6ac8e5',
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164.18 229.06">
      <defs>
        <style>
          {`.cls-1 {
                    isolation: 'isolate';
                }
    
                .cls-2,
                .cls-5 {
                    fill: '${fill}';
                }
    
                .cls-3,
                .cls-4 {
                    fill: '${fill2}';
                }
    
                .cls-4,
                .cls-5 {
                    mix-blend-mode: 'multiply';
                }`}
        </style>
      </defs>
      <g className="cls-1">
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path
              className="cls-2"
              d="M91,135.15l.11.08c8.92,6.24,4.6,20.28-6.29,20.41A77.85,77.85,0,1,1,157.39,52c3.58,10.24-8.17,19-17,12.8l-.2-.13a11,11,0,0,1-4-5.39,55.33,55.33,0,1,0-51.71,73.82A11.31,11.31,0,0,1,91,135.15Z"
            />
            <path
              className="cls-3"
              d="M73.22,93.91l-.1-.08c-8.93-6.24-4.61-20.28,6.28-20.41A77.85,77.85,0,1,1,6.79,177c-3.58-10.24,8.17-19,17.05-12.8l.19.13a11.06,11.06,0,0,1,4.06,5.39A55.33,55.33,0,1,0,79.8,95.93,11.36,11.36,0,0,1,73.22,93.91Z"
            />
            <circle className="cls-4" cx="36.69" cy="44.73" r="36.69" />
            <circle className="cls-5" cx="127.48" cy="184.33" r="36.69" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default SparesLogoS;
