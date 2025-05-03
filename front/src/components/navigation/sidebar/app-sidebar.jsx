import { NavField } from './nav-field';
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar';

export function AppSidebar({ ...props }) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavField />
      </SidebarHeader>
    </Sidebar>
  );
}
