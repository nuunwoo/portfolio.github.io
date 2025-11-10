import type {SVGProps} from 'react';
const TypeResizeSingleUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_d_121_11588)">
      <path d="M20.793 15.5H17.5V22.5H14.5V15.5H11.207L16 10.707L20.793 15.5Z" fill="black" stroke="white" />
    </g>
    <defs>
      <filter id="filter0_d_121_11588" x={-2} y={-1} width={36} height={36} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4049 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_121_11588" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_121_11588" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default TypeResizeSingleUp;
