import { delay } from '@/constants/mock-api';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { ReactElement } from 'react';

export default async function BarStats(): Promise<ReactElement> {
  await await delay(1000);

  return <BarGraph />;
}
