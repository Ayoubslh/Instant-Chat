/* eslint-disable react/prop-types */
import { useUser } from '@/hooks/redux/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from '@/components/ui/logo';
import { ModeToggle } from '../ui/mode-toggle';
import { Link } from 'react-router-dom';

function DashboardHeader({ children }) {
  const { data } = useUser();
  const { image, fullName } = data || {};
  const fallback =
    fullName?.split('')[0]?.toUpperCase() +
    fullName?.split('')[1]?.toUpperCase();

  return (
    <div className="relative">
      <div className="border-b-1 fixed top-17 left-1/2 -translate-x-1/2 w-full z-11" />
      <div className="fixed bg-background md:w-[calc(100dvw-6rem)] w-full xl:w-[calc(80rem-6rem)] top-0 left-1/2 -translate-x-1/2 z-10">
        <div className="flex justify-between items-center max-md:px-5 py-5">
          {children}

          <Logo to="/dashboard" />

          <div className="flex gap-2">
            <ModeToggle />

            <Link to="/dashboard/profile">
              <Avatar className="size-7 cursor-pointer">
                <AvatarImage src={image} />
                <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
