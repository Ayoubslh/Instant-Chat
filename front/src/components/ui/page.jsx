import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

function Page({ children, className }) {
  return (
    <div className={cn(className, 'max-w-7xl md:px-10 h-dvh px-5 mx-auto')}>
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Page };
