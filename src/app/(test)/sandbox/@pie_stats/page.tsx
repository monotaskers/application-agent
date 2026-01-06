import { delay } from "@/constants/mock-api";
import { PieGraph } from "@/features/overview/components/pie-graph";
import { ReactElement } from "react";

export default async function Stats(): Promise<ReactElement> {
  await delay(1000);
  return <PieGraph />;
}
