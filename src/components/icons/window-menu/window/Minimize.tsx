import type {SVGProps} from 'react';
const Minimize = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width={14} height={14} rx={7} fill="#FEBC2E" />
    <rect x={0.25} y={0.25} width={13.5} height={13.5} rx={6.75} stroke="black" strokeOpacity={0.1} strokeWidth={0.5} />
  </svg>
);
export default Minimize;
