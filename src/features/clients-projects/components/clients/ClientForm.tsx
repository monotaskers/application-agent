/**
 * ClientForm Component
 *
 * @fileoverview Form component for creating and editing clients.
 *
 * @module features/clients-projects/components/clients/ClientForm
 */

'use client';

import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createClientInputSchema } from '../../schemas/client.schema';
import { useClientMutations } from '../../hooks/use-client-mutations';
import type { CreateClientInput, Client } from '../../types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ClientFormProps {
  /** Form mode: create or edit */
  mode: 'create' | 'edit';
  /** Initial data for edit mode */
  initialData?: Client;
}

/**
 * ClientForm component for creating and editing clients.
 *
 * @param props - Component props
 * @returns Client form with validation and submission
 *
 * @example
 * ```tsx
 * // Create mode
 * <ClientForm mode="create" />
 *
 * // Edit mode
 * <ClientForm mode="edit" initialData={client} />
 * ```
 */
export function ClientForm({ mode, initialData }: ClientFormProps): ReactElement {
  const router = useRouter();
  const { createMutation, updateMutation } = useClientMutations();

  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientInputSchema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      contactPerson: initialData?.contactPerson || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data: CreateClientInput): Promise<void> => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
        router.push('/clients');
      } else if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data,
        });
        router.push(`/clients/${initialData.id}`);
      }
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corporation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@acme.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this client..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Client' : 'Update Client'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
