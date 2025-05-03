import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import { Menu } from 'lucide-react';

HomeSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function HomeSidebar({ children, className }) {
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(
    window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = e => setIsMediumOrLarger(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (isMediumOrLarger) {
    return <>{children}</>;
  }

  return (
    <Sheet>
      <SheetTrigger className="size-6 cursor-pointer">
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Side Bar</SheetTitle>
          <SheetDescription />
          <Separator />
        </SheetHeader>
        <div className={className}>{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export default HomeSidebar;
