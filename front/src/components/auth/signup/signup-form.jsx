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
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userSchema } from '@/utils/zod/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { SignUpProvider } from '@/pages/auth/Signup';

const signupSchema = userSchema.pick({
  fullName: true,
  email: true,
});

export default function SignupForm() {
  const navigate = useNavigate();
  const { postData, setPostData } = useContext(SignUpProvider);

  const { fullName, email } = postData;

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: fullName,
      email: email,
    },
  });

  const onSubmit = data => {
    setPostData(prev => ({ ...prev, ...data }));
    navigate('/auth/sign-up/password');
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
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Signup
        </Button>
      </form>
    </Form>
  );
}
