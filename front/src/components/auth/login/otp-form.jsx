import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
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
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ForgetPasswordProvider } from '@/pages/auth/ForgetPassword';
import { userSchema } from '@/utils/zod/user-schema';
import { useMutation } from '@tanstack/react-query';
import { customFetch } from '@/utils/fetch/axios';
import showToast from '@/services/toast';
import { buttonLoader } from '@/components/ui/button-label';

const otpSchema = userSchema.pick({
  otp: true,
});

function OtpForm() {
  const navigate = useNavigate();
  const { postData, setPostData } = useContext(ForgetPasswordProvider);
  const { otp, email } = postData;

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: otp,
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: async data => {
      await customFetch.post('/auth/forgot-password', data);
    },
    onSuccess: () => {
      showToast('Check your email');
    },
    onError: () => {
      showToast('An error occurred', 'error');
    },
  });
  const { mutate: check, isPending: isChecking } = useMutation({
    mutationFn: async data => {
      await customFetch.post('/auth/verify-reset-code', data);
    },
    onSuccess: () => {
      navigate('/auth/forget-password/change-password');
    },
    onError: () => {
      showToast('An error occurred', 'error');
    },
  });

  const onSubmit = data => {
    setPostData(prev => ({ ...prev, otp: data.otp }));
    check({ email: email, code: +data.otp });
  };

  const onError = errors => {
    console.log(errors);
  };

  const handleResend = () => {
    resend({ email: email });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        {/* OTP Field */}
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                >
                  <InputOTPGroup className="flex w-full justify-center gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot
                          className="h-12 w-11"
                          index={index}
                          type='number'
                          value={field.value[index] || ''}
                          onChange={e => {
                            const newOtp = [...field.value];
                            newOtp[index] = e.target.value;
                            field.onChange(newOtp);
                          }}
                        />
                      </InputOTPGroup>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Next Button */}
        <div className="space-y-1">
          <Button
            type="submit"
            disabled={isResending || isChecking}
            className="w-full"
          >
            {buttonLoader(isChecking, 'Next')}
          </Button>
          <div className="flex items-center gap-2 justify-center">
            didn`t receive the code?{' '}
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              className="px-0 h-fit"
              disabled={isResending || isChecking}
            >
              {buttonLoader(isResending, 'resend')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default OtpForm;
