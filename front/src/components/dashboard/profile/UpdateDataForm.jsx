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
import { useDispatch } from 'react-redux';
import showToast from '@/services/toast';
import { login } from '@/utils/redux/user';
import { useState } from 'react';

const dataSchema = userSchema.pick({
  fullName: true,
  email: true,
  phone: true,
});

function UpdateDataForm({ data }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { fullName, email, phone, _id } = data;

  const form = useForm({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      fullName: fullName,
      email: email,
      phone: phone || '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async formData => {
      const response = await customFetch.patch(`/user/${_id}`, formData);
      return response.data.updatedUser;
    },
    onSuccess: data => {
      setOpen(false)
      dispatch(login({ data: data }));
      showToast('profile updated');
    },
    onError: () => {
      showToast('error', 'error');
    },
  });

  const onSubmit = values => {
    const formData = new FormData();

    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('phone', values.phone);

    mutate(formData);
  };

  const onError = errors => {
    console.log(errors);
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>Change your profile data</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="-mb-4">
              <DialogClose asChild>
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

export default UpdateDataForm;
