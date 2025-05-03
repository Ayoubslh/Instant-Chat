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
import { useContext, useEffect, useState } from 'react';
import { SignUpProvider } from '@/pages/auth/Signup';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthMutation } from '@/hooks/mutation/use-auth-mutation';
import { buttonLoader } from '@/components/ui/button-label';

// Schema: assuming 'image' field validation inside userSchema
const imageSchema = userSchema.pick({
  image: true,
});

function ImageForm() {
  const navigate = useNavigate();
  const { postData, setPostData } = useContext(SignUpProvider);
  const { fullName, email, password, confirmPassword, image } = postData;

  const { mutate, isPending } = useAuthMutation('signup');

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!fullName || !email || !password || !confirmPassword) {
      navigate('/auth/sign-up');
    }
  }, [fullName, email, password, confirmPassword, navigate]);

  const form = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: image,
    },
  });

  const onSubmit = data => {
    const formData = new FormData();
    setPostData(prev => ({ ...prev, ...data }));

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    if (data.image) {
      formData.append('image', data.image);
    }

    mutate(formData);
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
        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'min-h-40 relative flex flex-col justify-between p-5 items-center rounded-xl w-full text-muted-foreground cursor-pointer border-2 border-dashed'
                  )}
                >
                  {preview ? (
                    <div className="flex justify-center">
                      <img
                        src={preview}
                        alt="Selected"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-accent rounded-full my-auto">
                        <Upload className="size-10 text-muted-foreground  " />
                      </div>
                      <h1>drag and drop or click to upload an image</h1>
                    </>
                  )}
                  <Input
                    className="absolute h-full w-full opacity-0"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {buttonLoader(isPending, 'Create Account')}
        </Button>
      </form>
    </Form>
  );
}

export default ImageForm;
