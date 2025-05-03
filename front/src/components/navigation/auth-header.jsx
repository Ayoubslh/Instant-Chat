import { Logo } from '@/components/ui/logo';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

function AuthHeader() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2];

  const linkBaseClasses = 'flex gap-1 items-center justify-between font-medium';
  const authLinkClasses = 'rounded-md max-lg:w-full  cursor-pointer';

  const authLinks = {
    'sign-up': {
      label: 'Log In',
      to: '/auth/log-in',
    },
    'log-in': {
      label: 'Sign Up',
      to: '/auth/sign-up',
    },
  };

  const { label, to } = authLinks[currentPath] || {
    label: 'Log In',
    to: '/auth/log-in',
  };

  return (
    <div className="flex justify-between py-4 md:py-5">
      <Logo />

      <ul className={linkBaseClasses}>
        <li className={authLinkClasses}>
          <Link to={to}>
            <Button variant="link" className="w-full">
              {label}
            </Button>
          </Link>
        </li>

        <li className={authLinkClasses}>
          <Link to={-1}>
            <Button className="w-full">Go Back</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AuthHeader;
