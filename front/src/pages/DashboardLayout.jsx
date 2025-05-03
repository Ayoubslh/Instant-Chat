import DashboardSidebar from '@/components/navigation/dashboard-sidebar';
import { Page } from '@/components/ui/page';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <Page>
      <div className="h-17 w-full" />
      <DashboardSidebar >
        <Outlet />
      </DashboardSidebar>
    </Page>
  );
}

export default DashboardLayout;
