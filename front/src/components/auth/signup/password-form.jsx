import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { userSchema } from '@/utils/zod/user-schema';
import { useContext, useEffect } from 'react';
import { SignUpProvider } from '@/pages/auth/Signup';
import { useNavigate } from 'react-router-dom';

const passwordSchema = userSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function PasswordForm() {
  const navigate = useNavigate();
  const { postData, setPostData } = useContext(SignUpProvider);
  const { fullName, email, password, confirmPassword } = postData;

  useEffect(() => {
    if (!fullName && !email) navigate('/auth/sign-up');
  }, [fullName, email, navigate]);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: password,
      confirmPassword: confirmPassword,
    },
  });

  const onSubmit = data => {
    setPostData(prev => ({ ...prev, ...data }));
    navigate('/auth/sign-up/image');
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
                  type="password"
                  placeholder="Enter password"
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
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </Form>
  );
}

export default PasswordForm;
