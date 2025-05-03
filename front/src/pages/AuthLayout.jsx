import AuthHeader from '@/components/navigation/auth-header';
import { Page } from '@/components/ui/page';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <Page>
      <AuthHeader />
      <Outlet />
    </Page>
  );
}

export default AuthLayout;
