import type {SVGProps} from 'react';
const TypeResizeSingleTopLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_d_121_11616)">
      <path
        d="M18.2783 11.4995L17.4248 12.353L15.9492 13.8276L20.5469 18.4243L20.9004 18.7778L18.7793 20.8989L18.4258 20.5454L13.8281 15.9487L12.3535 17.4243L11.5 18.2778V11.4995H18.2783Z"
        fill="black"
        stroke="white"
      />
    </g>
    <defs>
      <filter id="filter0_d_121_11616" x={-2} y={-1} width={36} height={36} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4049 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_121_11616" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_121_11616" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default TypeResizeSingleTopLeft;
