/**
 * Projects List Page
 *
 * @fileoverview Server Component page for displaying the list of projects.
 *
 * @module app/dashboard/projects/page
 */

import { ReactElement } from 'react';
import { Metadata } from 'next';
import { ProjectList } from '@/features/clients-projects/components/projects/ProjectList';

/**
 * Metadata for the projects list page.
 */
export const metadata: Metadata = {
  title: 'Projects | Dashboard',
  description: 'View and manage your projects',
};

/**
 * Projects list page component.
 *
 * Server Component that renders the ProjectList component for displaying
 * and managing projects.
 *
 * @returns Projects list page
 */
export default function ProjectsPage(): ReactElement {
  return <ProjectList />;
}
