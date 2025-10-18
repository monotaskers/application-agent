import { Metadata } from 'next';
import { ReactElement } from 'react';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.'
};

export default async function Page(): Promise<ReactElement> {
  let stars = 3000; // Default value

  try {
    const response = await fetch(
      'https://api.github.com/repos/kiranism/next-shadcn-dashboard-starter',
      {
        next: { revalidate: 86400 }
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars; // Update stars if API response is valid
    }
  } catch (error) {
    // Log the error for monitoring but don't break the page
    console.error('Failed to fetch GitHub stars:', error);
  }
  return <SignUpViewPage stars={stars} />;
}
