import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakPoint) {
  const mobileBreakPoint = breakPoint || MOBILE_BREAKPOINT;
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakPoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < mobileBreakPoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < mobileBreakPoint);
    return () => mql.removeEventListener('change', onChange);
  }, [mobileBreakPoint]);

  return !!isMobile;
}
