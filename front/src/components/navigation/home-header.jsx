import { cn } from '@/lib/utils';
import HomeSidebar from './home-sidebar';
import AuthLinks from './links/auth-links';
import NavLinks from './links/nav-links';
import { Logo } from '@/components/ui/logo';

function HomeHeader() {
  const linkBaseClasses =
    'flex max-lg:flex-col max-lg:px-4 gap-1 items-center justify-between lg:gap-15 font-medium';
  const navLinkClasses =
    'hover:text-primary duration-300 rounded-md max-lg:px-5 max-lg:w-full max-lg:py-2 cursor-pointer max-lg:hover:bg-secondary';
  const authLinkClasses =
    'hover:text-primary duration-300 rounded-md max-lg:w-full  cursor-pointer max-lg:hover:bg-secondary';

  return (
    <div className="flex justify-between py-5">
      <Logo />

      <HomeSidebar className="h-full flex flex-col justify-between pb-4">
        <NavLinks className={linkBaseClasses} linkClassName={navLinkClasses} />
        <AuthLinks
          className={cn(linkBaseClasses, 'max-lg:flex-col lg:gap-2')}
          linkClassName={authLinkClasses}
        />
      </HomeSidebar>
    </div>
  );
}

export default HomeHeader;
