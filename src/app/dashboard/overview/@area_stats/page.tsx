import { delay } from '@/constants/mock-api';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { ReactElement } from 'react';

export default async function AreaStats(): Promise<ReactElement> {
  await await delay(2000);
  return <AreaGraph />;
}
