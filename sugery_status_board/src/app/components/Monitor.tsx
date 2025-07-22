import * as React from "react";
import { SVGProps } from "react";
const Monitor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-monitor-icon lucide-monitor"
    {...props}
  >
    <rect width={20} height={14} x={2} y={3} rx={2} />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
export default Monitor;
