// Returns true if current viewport width is below or equal to the breakpoint
export const isBelowBreakpoint = (breakpoint) => {
	if (typeof window === "undefined") return false;
	return window.innerWidth <= breakpoint;
};

// Returns responsive image depending on viewport width
export const getResponsiveImage = (desktopImg, tabletImg, breakpoint = 768) => {
	if (typeof window === "undefined") return desktopImg;
	return isBelowBreakpoint(breakpoint) ? tabletImg : desktopImg;
};
