import { ReactElement } from 'react';
import ProfileViewPage from '@/features/profile/components/profile-view-page';

export const metadata = {
  title: 'Dashboard : Profile'
};

export default async function Page(): Promise<ReactElement> {
  return <ProfileViewPage />;
}
