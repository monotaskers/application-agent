import { type ReactElement, type ReactNode } from "react";
import PageContainer from "@/components/layout/page-container";

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
}: {
  sales: ReactNode;
  pie_stats: ReactNode;
  bar_stats: ReactNode;
  area_stats: ReactNode;
}): Promise<ReactElement> {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Quick Test 👋</h2>
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          {/* TODO: Add static cards here */}
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">{bar_stats}</div>
          <div className="col-span-1 md:col-span-3">{sales}</div>
          <div className="col-span-1">{area_stats}</div>
          <div className="col-span-1 md:col-span-3">{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
