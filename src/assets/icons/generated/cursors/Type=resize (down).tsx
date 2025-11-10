import type {SVGProps} from 'react';
const TypeResizeDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_d_121_11656)">
      <path
        d="M23.4805 11.52V14.48H17.4805V16.52H20.416L19.5928 17.3687L16.3701 20.688L16.0127 21.0562L15.6533 20.6899L12.4023 17.3696L11.5703 16.52H14.5V14.48H8.5V11.52H23.4805Z"
        fill="black"
        stroke="white"
      />
    </g>
    <defs>
      <filter id="filter0_d_121_11656" x={-2} y={-1} width={36} height={36} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4049 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_121_11656" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_121_11656" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default TypeResizeDown;
