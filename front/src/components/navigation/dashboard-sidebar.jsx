/* eslint-disable react/prop-types */
import DashboardHeader from './dashboard-header';
import { AppSidebar } from './sidebar/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

function DashboardSidebar({ children }) {
  return (
    <SidebarProvider>
      <DashboardHeader>
        <SidebarTrigger className="lg:hidden mr-9" />
      </DashboardHeader>
      <AppSidebar />
      <SidebarInset className="h-[calc(100vh-68px)] @container">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardSidebar;
