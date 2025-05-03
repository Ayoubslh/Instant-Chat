/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { FaPen } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { buttonLoader } from '@/components/ui/button-label';
import { userSchema } from '@/utils/zod/user-schema';
import { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import showToast from '@/services/toast';
import { customFetch } from '@/utils/fetch/axios';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login } from '@/utils/redux/user';

const imageSchema = userSchema.pick({
  image: true,
});

const AvatarForm = ({ data }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { image, fullName, _id } = data;

  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async formData => {
      const response = await customFetch.patch(`/user/${_id}`, formData);
      return response.data.updatedUser;
    },
    onSuccess: data => {
      dispatch(login({ data: data }));
      showToast('image changed');
      setOpen(false);
    },
    onError: () => {
      showToast('error', 'error');
    },
  });

  const fallback =
    fullName?.split('')[0]?.toUpperCase() +
    (fullName?.split('')[1]?.toUpperCase() || '');

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('image', data.image);
    mutate(formData);
  };

  const onError = errors => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3">
        <div className="relative rounded-full overflow-hidden group">
          <DialogTrigger asChild>
            <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-black/20 cursor-pointer">
              <FaPen className="absolute size-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </DialogTrigger>
          <Avatar className="size-18">
            <AvatarImage src={image} alt={`@${fullName}`} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-semibold">{fullName}</h2>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Image</DialogTitle>
          <DialogDescription>Upload a new profile picture</DialogDescription>
        </DialogHeader>

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
                            className="w-32 h-32 object-cover rounded-xl"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="p-4 bg-accent rounded-full my-auto">
                            <Upload className="size-10 text-muted-foreground" />
                          </div>
                          <h1>Drag and drop or click to upload an image</h1>
                        </>
                      )}
                      <Input
                        className="absolute h-full w-full opacity-0 cursor-pointer"
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

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {buttonLoader(isPending, 'Save Image')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarForm;
