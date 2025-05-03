import RouteProtection from '@/authentication/route-protection';
import Landing from '@/pages/home/Landing';
import HomeLayout from '@/pages/HomeLayout';

const home = {
  path: '/',
  element: (
    <RouteProtection permission="guest" redirect='/dashboard'>
      <HomeLayout />
    </RouteProtection>
  ),
  // errorElement: <Error />,
  children: [
    {
      index: true,
      element: <Landing />,
      // errorElement: <ErrorElement />,
    },
  ],
};

export { home };
