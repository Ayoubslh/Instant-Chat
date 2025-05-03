/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ReplyAll } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUser } from '@/hooks/redux/use-user';
import showToast from '@/services/toast';
import { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

function Email({ className }) {
  const { emailId } = useParams();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [Replay, setReplay] = useState();

  const { data, isLoading } = useQuery({
    queryKey: ['email', emailId],
    queryFn: async () => {
      const res = await customFetch.get(`/gmail/${emailId}`);
      return res.data.email;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      await customFetch.post(`/gmail/${user._id}/update`, {
        query: `from:${data.from} subject:${data.subject}`,
        markAs: 'read',
      });
    },
    onSuccess: () => {
      queryClient.removeQueries(['email', emailId]);
      queryClient.invalidateQueries(['inbox-emails']);

      showToast('Email marked as read successfully.');
      navigate('/');
    },
    onError: () => {
      showToast('Failed to mark email as read.', 'error');
    },
  });

  const { mutate: getMail, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await customFetch.post(`/agent/write-email/${user._id}`, {
        input: JSON.stringify(data),
      });
      return res.data.result;
    },
    onSuccess: data => {
      console.log(data);
      setReplay(data);
    },
  });

  if (isLoading && emailId) {
    return (
      <p className="text-center mx-auto w-full text-muted-foreground py-8">
        Loading email...
      </p>
    );
  }

  if (!data)
    return (
      <p className="text-center mx-auto text-muted-foreground w-full py-8">
        no email exist.
      </p>
    );

  const {
    from,
    subject,
    plainText,
    createdAt,
    summary,
    actionItems,
    priority,
    category,
  } = data;

  const formatDate = dateStr =>
    new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div
      className={cn(
        'text-muted-foreground group transition-colors p-6 space-y-4 max-w-2xl mx-auto',
        className
      )}
    >
      <Tabs defaultValue="email" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger className="rounded-md" value="email">
              Email
            </TabsTrigger>
            <TabsTrigger className="rounded-md" value="summary">
              Summary
            </TabsTrigger>
          </TabsList>

          <Button className="px-3 h-8" onClick={mutate}>
            Mark as
          </Button>
        </div>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {from?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{from}</p>
                <p className="text-xs text-muted-foreground">
                  Sent:{' '}
                  <span className="text-foreground">
                    {formatDate(createdAt)}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </span>
          </div>

          <h2 className="text-xl font-bold text-foreground">
            {subject || 'No Subject'}
          </h2>

          <div className="text-sm text-muted-foreground space-y-4">
            <p>{plainText || 'No content available.'}</p>
          </div>

          <Dialog>
            <DialogTrigger>
              <Button
                onClick={getMail}
                className="mt-4 group-hover:bg-primary/90 transition"
              >
                <ReplyAll /> AI generated Reply
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Replay Suggestion</DialogTitle>
                <DialogDescription />
              </DialogHeader>

              <div className="w-full">
                {isGenerating ? (
                  <p className="w-full mx-auto text-accent-foreground">
                    Loading...
                  </p>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-foreground">
                      {Replay?.to || ''}
                    </h2>

                    <h2 className="text-xl font-bold text-foreground">
                      {Replay?.subject || 'No Subject'}
                    </h2>

                    <div className="text-sm text-muted-foreground space-y-4">
                      <p>{Replay?.body || 'No content available.'}</p>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4 text-sm">
          <p>
            <strong>Summary:</strong> {summary || 'No summary available.'}
          </p>
          <p>
            <strong>Action Items:</strong> {actionItems?.join(', ') || 'None'}
          </p>
          <p>
            <strong>Priority:</strong> {priority?.level || 'N/A'} —{' '}
            <em>{priority?.justification}</em>
          </p>
          <p>
            <strong>Category:</strong> {category?.type} —{' '}
            {category?.description}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Email;
