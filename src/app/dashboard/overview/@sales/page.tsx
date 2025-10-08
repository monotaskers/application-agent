import { delay } from '@/constants/mock-api';
import { RecentSales } from '@/features/overview/components/recent-sales';
import { ReactElement } from 'react';

export default async function Sales(): Promise<ReactElement> {
  await delay(3000);
  return <RecentSales />;
}
