/**
 * ProjectForm Component
 *
 * @fileoverview Form component for creating and editing projects with validation.
 *
 * @module features/clients-projects/components/projects/ProjectForm
 */

'use client';

import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useClients } from '../../hooks/use-clients';
import { useProjectMutations } from '../../hooks/use-project-mutations';
import { createProjectInputSchema } from '../../schemas/project.schema';
import { ProjectStatus } from '../../types/project.types';
import { Project } from '../../types/project.types';
import { CreateProjectInput } from '../../schemas/project.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectFormProps {
  /** Form mode - create new or edit existing project */
  mode: 'create' | 'edit';
  /** Initial data for edit mode */
  initialData?: Project;
  /** Optional callback when form is submitted successfully */
  onSuccess?: () => void;
}

/**
 * ProjectForm component for creating and editing projects.
 *
 * @param props - Component props
 * @returns Form for project creation or editing with validation
 *
 * @example
 * ```tsx
 * // Create mode
 * <ProjectForm mode="create" onSuccess={() => router.push('/projects')} />
 *
 * // Edit mode
 * <ProjectForm
 *   mode="edit"
 *   initialData={project}
 *   onSuccess={() => router.push(`/projects/${project.id}`)}
 * />
 * ```
 */
export function ProjectForm({
  mode,
  initialData,
  onSuccess,
}: ProjectFormProps): ReactElement {
  const router = useRouter();
  const { data: clients } = useClients({ includeDeleted: false });
  const { createMutation, updateMutation } = useProjectMutations();

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectInputSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      clientId: initialData?.clientId || null,
      status: initialData?.status || ProjectStatus.Planning,
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || null,
      budget: initialData?.budget || undefined,
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        clientId: initialData.clientId,
        status: initialData.status,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        budget: initialData.budget,
        notes: initialData.notes || '',
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: CreateProjectInput): Promise<void> => {
    try {
      if (mode === 'create') {
        const result = await createMutation.mutateAsync(data);
        if (result.success) {
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/projects');
          }
        } else {
          form.setError('root', {
            type: 'manual',
            message: result.error.message,
          });
        }
      } else if (initialData) {
        const result = await updateMutation.mutateAsync({
          id: initialData.id,
          data,
        });
        if (result.success) {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(`/projects/${initialData.id}`);
          }
        } else {
          form.setError('root', {
            type: 'manual',
            message: result.error.message,
          });
        }
      }
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name *</FormLabel>
              <FormControl>
                <Input placeholder="Website Redesign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project description..."
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                value={field.value || 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Client</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionally associate this project with a client
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ProjectStatus.Planning}>Planning</SelectItem>
                  <SelectItem value={ProjectStatus.Active}>Active</SelectItem>
                  <SelectItem value={ProjectStatus.OnHold}>On Hold</SelectItem>
                  <SelectItem value={ProjectStatus.Completed}>Completed</SelectItem>
                  <SelectItem value={ProjectStatus.Cancelled}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      field.onChange(e.target.value ? new Date(e.target.value) : null)
                    }
                  />
                </FormControl>
                <FormDescription>Must be after start date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="10000"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
              </FormControl>
              <FormDescription>Project budget in dollars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes..."
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            {mode === 'create' ? 'Create Project' : 'Update Project'}
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
