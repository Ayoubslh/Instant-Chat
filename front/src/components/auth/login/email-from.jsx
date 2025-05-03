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
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ForgetPasswordProvider } from '@/pages/auth/ForgetPassword';
import { useMutation } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import showToast from '@/services/toast';
import { buttonLoader } from '@/components/ui/button-label';

const emailSchema = userSchema.pick({
  email: true,
});

function EmailForm() {
  const navigate = useNavigate();
  const { postData, setPostData } = useContext(ForgetPasswordProvider);
  const { email } = postData;
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: email,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async data => {
      await customFetch.post('/auth/forgot-password', data);
    },
    onSuccess: () => {
      navigate('/auth/forget-password/otp-confirmation');
    },
    onError: () => {
      showToast('An error occurred', 'error');
    },
  });

  const onSubmit = data => {
    setPostData(prev => ({ ...prev, ...data }));
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

        {/* Next Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {buttonLoader(isPending, 'Next')}
        </Button>
      </form>
    </Form>
  );
}

export default EmailForm;
