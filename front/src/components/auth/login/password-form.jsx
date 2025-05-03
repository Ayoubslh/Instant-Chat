import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/utils/zod/user-schema';
import { useContext } from 'react';
import { ForgetPasswordProvider } from '@/pages/auth/ForgetPassword';
import { useMutation } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import { useNavigate } from 'react-router-dom';
import showToast from '@/services/toast';
import { buttonLoader } from '@/components/ui/button-label';
import { useDispatch } from 'react-redux';
import { login } from '@/utils/redux/user';

// Define the password validation schema using Zod
const passwordSchema = userSchema.pick({
  password: true,
  confirmPassword: true,
});

function ChangePasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postData } = useContext(ForgetPasswordProvider);
  const { password, confirmPassword, email } = postData;
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: password,
      confirmPassword: confirmPassword,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async data => {
      const res = await customFetch.post('/auth/reset-password', data);
      return res.data.user;
    },
    onSuccess: data => {
      dispatch(login({ data: data }));
      showToast('Your password changed sucessfully');
      navigate('/');
    },
    onError: () => {
      showToast('An error occurred', 'error');
    },
  });

  const onSubmit = data => {
    mutate({ email: email, newPassword: data.password });
  };

  const onError = errors => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Next Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {buttonLoader(isPending, 'Change Password')}
        </Button>
      </form>
    </Form>
  );
}

export default ChangePasswordForm;
