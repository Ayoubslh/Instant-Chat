import { useEffect, useState } from 'react';

export function useIsLarge() {
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth > 720);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 720;
      setIsLargeScreen(isLarge);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isLargeScreen;
}
