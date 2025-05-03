'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useForm, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const items = [
  {
    title: 'Business',
    value: 'business',
    description: 'Used for professional or work-related communication.',
  },
  {
    title: 'Personal',
    value: 'personal',
    description: 'Used for private and everyday personal correspondence.',
  },
  {
    title: 'Gaming',
    value: 'gaming',
    description: 'Dedicated to gaming accounts, platforms, and subscriptions.',
  },
  {
    title: 'School',
    value: 'school',
    description:
      'Used for educational purposes, typically provided by an institution.',
  },
  {
    title: 'Newsletter',
    value: 'newsletter',
    description: 'Used to subscribe to newsletters and promotional content.',
  },
];

export function NavField() {
  const queryClient = useQueryClient();
  const categories = queryClient.getQueryData(['email-categories']) || [];
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      category: '',
    },
  });

  console.log(categories);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory && items.some(item => item.value === initialCategory)) {
      setValue('category', initialCategory);
    }
  }, [searchParams, setValue]);

  const onSubmit = data => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label>Email Categories</Label>

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            className="grid grid-cols-1 gap-2 max-h-[80dvh] overflow-auto scrollbar-hide w-full"
            value={field.value}
            onValueChange={val => {
              field.onChange(val);
              const params = new URLSearchParams(searchParams);
              if (val) {
                params.set('category', val);
              } else {
                params.delete('category');
              }
              navigate(`?${params.toString()}`, { replace: true });
            }}
          >
            {categories.map((item, index) => (
              <ToggleGroupItem
                key={index}
                value={item}
                className="text-left h-full p-3 py-2 bg-muted-foreground/5 rounded-md transition-colors data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary w-full"
              >
                <div className="flex flex-wrap flex-col gap-1 w-full">
                  <span className="font-semibold text-base w-full">{item}</span>
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      />
    </form>
  );
}
