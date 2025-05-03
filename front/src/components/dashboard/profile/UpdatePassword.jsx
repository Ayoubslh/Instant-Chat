/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { buttonLoader } from '@/components/ui/button-label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userSchema } from '@/utils/zod/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import showToast from '@/services/toast';
import * as z from 'zod';
import { useRef, useState } from 'react';

const passwordSchema = z
  .object({
    password: userSchema.shape.password,
    newPassword: z.string().min(1, { message: 'New Password is required' }),
    confirmPassword: userSchema.shape.confirmPassword,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function UpdatePasswordForm({ data }) {
  const [open, setOpen] = useState(false);
  const { _id } = data;
  const closeRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async data => {
      await customFetch.patch(`/user/${_id}/password`, data);
    },
    onSuccess: () => {
      setOpen(false);
      showToast('Password updated');
    },
    onError: () => {
      showToast('Failed to update password', 'error');
    },
  });

  const onSubmit = values => {
    const data = {
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmPassword,
      currentPassword: values.password,
    };
    mutate(data);
  };

  const onError = errors => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Your Password</DialogTitle>
          <DialogDescription>Change your password securely</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="-mb-4">
              <DialogClose ref={closeRef} asChild>
                <Button disabled={isPending} type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {buttonLoader(isPending, 'Save Changes')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePasswordForm;
