import RouteProtection from '@/authentication/route-protection';
import DashboardHeader from '@/components/navigation/dashboard-header';
import { Page } from '@/components/ui/page';
import Profile from '@/pages/dashboard/Profile';

const profile = {
  path: '/dashboard/profile',
  element: (
    <RouteProtection>
      <Page>
        <div className="h-20 w-full" />
        <DashboardHeader />
        <Profile />
      </Page>
    </RouteProtection>
  ),
  // errorElement: <ErrorElement />,
};

export { profile };
