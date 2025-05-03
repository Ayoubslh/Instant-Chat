import HomeHeader from '@/components/navigation/home-header';
import { Page } from '@/components/ui/page';
import { Outlet } from 'react-router-dom';

function HomeLayout() {
  return (
    <Page>
      <HomeHeader />
      <Outlet />
    </Page>
  );
}

export default HomeLayout;
