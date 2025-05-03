// route protection
import RouteProtection from '@/authentication/route-protection';
// route components
import AuthLayout from '@/pages/AuthLayout';
// children
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import SignupForm from '@/components/auth/signup/signup-form';
import PasswordForm from '@/components/auth/signup/password-form';
import ForgetPassword from '@/pages/auth/ForgetPassword';
import EmailFrom from '@/components/auth/login/email-from';
import OtpForm from '@/components/auth/login/otp-form';
import ImageForm from '@/components/auth/signup/image-form';
import ChangePasswordForm from '@/components/auth/login/password-form';
import OAuth from '@/pages/auth/OAuth';

const auth = {
  element: (
    <RouteProtection permission="guest" redirect='/dashboard'>
      <AuthLayout />
    </RouteProtection>
  ),
  // errorElement: <Error />,
  children: [
    {
      path: '/auth/sign-up',
      element: <Signup />,
      // errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: <SignupForm />,
          // errorElement: <ErrorElement />,
        },
        {
          path: '/auth/sign-up/password',
          element: <PasswordForm />,
          // errorElement: <ErrorElement />,
        },
        {
          path: '/auth/sign-up/image',
          element: <ImageForm />,
          // errorElement: <ErrorElement />,
        },
      ],
    },
    {
      path: '/auth/log-in',
      element: <Login />,
      // errorElement: <ErrorElement />,
    },
    {
      path: '/auth/login/continue-with-google',
      element: <OAuth />,
      // errorElement: <ErrorElement />,
    },
    {
      path: '/auth/forget-password',
      element: <ForgetPassword />,
      // errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: <EmailFrom />,
        },
        {
          path: '/auth/forget-password/otp-confirmation',
          element: <OtpForm />,
        },
        {
          path: '/auth/forget-password/change-password',
          element: <ChangePasswordForm />,
        },
      ],
    },
  ],
};

export { auth };
