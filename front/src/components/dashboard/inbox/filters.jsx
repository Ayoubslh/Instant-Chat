'use client';

import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  priority: z.array(z.string()).optional(),
  search: z.string().optional(),
});

function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: [],
      search: '',
    },
  });

  const { control, setValue } = form;

  // Sync form with URL params on mount
  useEffect(() => {
    const priority = searchParams.get('priority')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search') || '';
    if (priority.length) {
      setValue('priority', priority);
    }
    if (search) {
      setValue('search', search);
    }
  }, [searchParams, setValue]);

  const formValues = useWatch({ control });

  // Update URL with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams); // Start with current params

      // Update priority
      if (formValues.priority?.length) {
        params.set('priority', formValues.priority.join(','));
      } else {
        params.delete('priority');
      }

      // Update search
      if (formValues.search) {
        params.set('search', formValues.search);
      } else {
        params.delete('search');
      }

      setSearchParams(params, { replace: true }); // Use replace to avoid history stack issues
    }, 300);

    return () => clearTimeout(handler);
  }, [formValues, searchParams, setSearchParams]);

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  const onError = (errors) => {
    console.error('Form errors:', errors);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-3 mb-5"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  className="flex gap-1"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem
                    value="high"
                    className="border rounded-md data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary"
                  >
                    high
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="medium"
                    className="border rounded-md px-5 data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary"
                  >
                    medium
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="low"
                    className="border rounded-md data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary"
                  >
                    low
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input
                  placeholder="search"
                  className="dark:border-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default Filters;