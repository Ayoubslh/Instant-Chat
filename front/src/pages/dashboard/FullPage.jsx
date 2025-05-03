import { useIsLarge } from '@/hooks/use-large';
import { useEffect } from 'react';
import Inbox from './Inbox';
import Email from './Email';
import { useNavigate } from 'react-router-dom';

function FullPage() {
  const navigate = useNavigate();
  const isLargeScreen = useIsLarge();

  useEffect(() => {
    if (!isLargeScreen) {
      navigate('/dashboard/inbox', { replace: true });
    }
  }, [isLargeScreen, navigate]);

  return (
    <div className="flex">
      <Inbox className="h-[calc(100vh-68px)] col-span-2 border-r-1 w-90" />
      <Email className="" />
    </div>
  );
}

export default FullPage;
