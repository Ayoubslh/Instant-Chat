'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import showToast from '@/services/toast';
import { useUser } from '@/hooks/redux/use-user';
import { buttonLoader } from '@/components/ui/button-label';
import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';

// Zod schema
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

export default function EmailManagement() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState();
  const { data: user } = useUser();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { data: emails, isLoading } = useQuery({
    queryKey: ['team-emails'],
    queryFn: async () => {
      const res = await customFetch.get(`/gmail/${user._id}/linkedEmails`);
      return res.data.linkedEmails;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async data => {
      await customFetch.post(`/gmail/addEmail/${user._id}`, data);
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries(['team-emails']);
      showToast('The email address was added successfully');
    },
    onError: () => {
      showToast('Error adding the email');
    },
    enabled: !!user?._id,
  });

  const onSubmit = values => {
    mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Management
        </CardTitle>
        <CardDescription>
          Add, edit, or remove email addresses associated with your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <Dialog open={open} setOpen={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Email</DialogTitle>
                <DialogDescription>
                  Add a new email address to your account
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild className="max-md:w-full">
                      <Button
                        type="button"
                        disabled={isPending}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {buttonLoader(isPending, 'Add Email')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* You can hook up your dynamic table here */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              ) : emails && emails.length > 0 ? (
                emails.map((email, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    No emails to show.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
