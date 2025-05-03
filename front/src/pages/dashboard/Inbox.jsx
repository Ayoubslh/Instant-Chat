/* eslint-disable react/prop-types */
import Filters from '@/components/dashboard/inbox/filters';
import { useUser } from '@/hooks/redux/use-user';
import { useIsLarge } from '@/hooks/use-large';
import { cn } from '@/lib/utils';
import InboxLoader from '@/services/inbox-loader';
import { customFetch } from '@/utils/fetch/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Inbox({ className }) {
  const queryClient = useQueryClient();

  const { data: user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isLargeScreen = useIsLarge();

  const queryParams = new URLSearchParams(location.search);

  const filters = [
    queryParams.get('priority')?.split(',') || [],
    queryParams.get('category') || [],
    queryParams.get('search') || '',
  ];

  useEffect(() => {
    if (
      (isLargeScreen && location.pathname.startsWith('/dashboard/inbox')) ||
      location.pathname.startsWith('/dashboard/email')
    ) {
      navigate('/dashboard');
    }
  }, [isLargeScreen, navigate, location.pathname]);

  const { data, isLoading } = useQuery({
    queryKey: ['inbox-emails', filters],
    queryFn: async () => {
      console.log(`/agent/process-emails/${user._id}?${queryParams}`);
      const res = await customFetch.post(
        `/agent/process-emails/${user._id}?${queryParams}`
      );
      queryClient.setQueryData(['email-categories'], res.data.metadata);
      return res.data.Emails;
    },
  });

  return (
    <div className={cn('flex flex-col h-full py-4', className)}>
      <div className="px-3">
        <Filters />
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        {isLoading && <InboxLoader />}
        {isLoading || data?.length !== 0 ? (
          data?.map((message, index) => (
            <div
              key={index}
              className="space-x-1 cursor-pointer border-b-1 py-3 hover:bg-muted-foreground/10 px-3 transition-all duration-300"
              onClick={() => {
                if (!isLargeScreen)
                  return navigate(`/dashboard/email/${message._id}`);
                else return navigate(`/dashboard/${message._id}`);
              }}
            >
              <div className="flex gap-3">
                <div className="size-8 flex justify-center items-center">
                  <Mail className="size-4" />
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="w-55 text-nowrap truncate">
                        {message.subject}
                      </h4>
                      <p className="text-sm max-w-60 truncate">
                        {message.from}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate w-55">
                    {message.plainText}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto">no email found.</div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
