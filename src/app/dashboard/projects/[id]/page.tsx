/**
 * Project Details Page
 *
 * @fileoverview Server Component page for displaying individual project details.
 *
 * @module app/dashboard/projects/[id]/page
 */

import { ReactElement } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/features/clients-projects/actions/project.actions';
import { ProjectDetails } from '@/features/clients-projects/components/projects/ProjectDetails';
import { createProjectId } from '@/features/clients-projects/types/project.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the project details page.
 *
 * @param props - Page props containing project ID
 * @returns Metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getProjectById(createProjectId(id));

  if (!result.success) {
    return {
      title: 'Project Not Found | Dashboard',
    };
  }

  return {
    title: `${result.data.name} | Projects`,
    description: `View details for ${result.data.name}`,
  };
}

/**
 * Project details page component.
 *
 * Server Component that fetches and displays details for a specific project.
 *
 * @param props - Page props containing project ID
 * @returns Project details page
 */
export default async function ProjectDetailsPage({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  const result = await getProjectById(createProjectId(id));

  if (!result.success) {
    notFound();
  }

  return <ProjectDetails project={result.data} />;
}
