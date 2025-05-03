// route protection
import RouteProtection from '@/authentication/route-protection';
import Email from '@/pages/dashboard/Email';
import FullPage from '@/pages/dashboard/FullPage';
import Inbox from '@/pages/dashboard/Inbox';
// route components
import DashboardLayout from '@/pages/DashboardLayout';

const dashboard = {
  element: (
    <RouteProtection permission="client">
      <DashboardLayout />
    </RouteProtection>
  ),
  // errorElement: <Error />,
  children: [
    {
      path: '/dashboard',
      element: <FullPage />,
      // errorElement: <ErrorElement />,
    },
    {
      path: '/dashboard/:emailId',
      element: <FullPage />,
      // errorElement: <ErrorElement />,
    },
    {
      path: '/dashboard/inbox',
      element: <Inbox />,
      // errorElement: <ErrorElement />,
    },
    {
      path: '/dashboard/email/:emailId',
      element: <Email />,
      // errorElement: <ErrorElement />,
    },
  ],
};

export { dashboard };
