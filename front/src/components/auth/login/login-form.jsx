import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/utils/zod/user-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthMutation } from '@/hooks/mutation/use-auth-mutation';
import { buttonLoader } from '@/components/ui/button-label';

const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'djalil.meskali@gmail.com',
      password: 'djalilmsk',
    },
  });

  const { mutate, isPending } = useAuthMutation('login', 'welcome back');

  const onSubmit = data => {
    mutate(data);
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
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/auth/forget-password"
                  className="text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button disabled={isPending} type="submit" className="w-full">
          {buttonLoader(isPending, 'Login')}
        </Button>
      </form>
    </Form>
  );
}
