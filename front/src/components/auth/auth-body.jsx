/* eslint-disable react/prop-types */
import { Card, CardContent } from '@/components/ui/card';
import { useDragAnimation } from '@/hooks/animation/use-drag-animation';
import { cn } from '@/lib/utils';
import img from '@/../public/bg.jpg';

// import app from '@/assets/app.jpg';

function AuthBody({ children, className, ...props }) {
  const { ref, prev } = useDragAnimation(children);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="p-0 max-md:border-0 max-md:shadow-none">
        <CardContent className="grid p-0 md:grid-cols-2 md:overflow-hidden">
          <div ref={ref}>{prev}</div>
          <div className="bg-muted relative hidden md:block">
            <img
              src={img}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover rounded-r-lg"
            />
            {/* <img
            src={app}
            alt=""
            className="absolute w-8/10 rounded-md top-1/2 left-1/2 -translate-1/2"
          /> */}
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

export default AuthBody;
