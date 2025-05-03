import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/hooks/redux/use-user';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';

AuthLinks.propTypes = {
  className: PropTypes.string,
  linkClassName: PropTypes.string,
};

function AuthLinks({ className = '', linkClassName = '' }) {
  const { data } = useUser();
  const { image, fullName } = data || {};
  const fallback =
    fullName?.split('')[0]?.toUpperCase() +
    fullName?.split('')[1]?.toUpperCase();

  const ReturnData = () => {
    if (data)
      return (
        <>
          <li className={cn(linkClassName, 'max-lg:px-4')}>
            <ModeToggle />
          </li>

          <li className={cn(linkClassName, 'max-lg:px-4')}>
            <Link to="/dashboard/" className="flex max-lg:py-2 gap-2">
              <Avatar className="size-7 cursor-pointer">
                <AvatarImage src={image} />
                <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
              </Avatar>
              <h4 className="text-sm my-auto lg:hidden">{fullName}</h4>
            </Link>
          </li>
        </>
      );

    if (!data)
      return (
        <>
          <li className={linkClassName}>
            <NavLink to={'/auth/log-in'}>
              <Button variant="link" className="w-full">
                Log In
              </Button>
            </NavLink>
          </li>
          <li className={linkClassName}>
            <NavLink to={'/auth/sign-up'}>
              <Button className="w-full">Sign Up</Button>
            </NavLink>
          </li>
        </>
      );
  };

  return (
    <ul className={className}>
      <ReturnData />
    </ul>
  );
}

export default AuthLinks;
