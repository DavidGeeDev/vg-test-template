import React from 'react';

const Icon = ({ path, size = 24, className = "", strokeWidth = 2, ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		{...rest}
	>
		{path}
	</svg>
);

export const Shield = (p) => <Icon {...p} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>} />;
export const CheckCircle = (p) => <Icon {...p} path={<><path d="M12 22a10 10 0 1 1 10-10" /><path d="M22 12A10 10 0 0 1 12 22" /><path d="m9 12 2 2 4-4" /></>} />;
export const AlertTriangle = (p) => <Icon {...p} path={<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />;
export const Clock = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />;
export const Play = (p) => <Icon {...p} path={<><polygon points="5 3 19 12 5 21 5 3" /></>} />;
export const Printer = (p) => <Icon {...p} path={<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>} />;
export const Brain = (p) => <Icon {...p} path={<><path d="M12 5.5a2.5 2.5 0 0 1-2.5-2.5" /><path d="M9.5 3A2.5 2.5 0 0 0 7 5.5V11" /><path d="M15.5 3A2.5 2.5 0 0 1 18 5.5V11" /><path d="M18 11a2.5 2.5 0 0 1 0 5" /><path d="M7 11a2.5 2.5 0 0 0 0 5" /><path d="M12 22V5.5" /><path d="M12 5.5a2.5 2.5 0 0 0 2.5-2.5" /><path d="M9.5 3A2.5 2.5 0 0 1 12 5.5" /><path d="M15.5 3A2.5 2.5 0 0 0 12 5.5" /><path d="M12 13a2.5 2.5 0 0 0-2.5 2.5V17" /><path d="M14.5 17a2.5 2.5 0 0 0-2.5-2.5" /><path d="M12 13a2.5 2.5 0 0 1 2.5-2.5H15" /><path d="M9 10.5A2.5 2.5 0 0 1 11.5 8H12" /></>} />;
export const AlertOctagon = (p) => <Icon {...p} path={<><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>} />;
export const Sparkles = (p) => <Icon {...p} path={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></>} />;
export const Check = (p) => <Icon {...p} path={<><polyline points="20 6 9 17 4 12" /></>} />;
export const X = (p) => <Icon {...p} path={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />;
export const Send = (p) => <Icon {...p} path={<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>} />;
