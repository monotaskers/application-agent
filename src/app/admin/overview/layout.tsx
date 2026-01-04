import { type ReactElement, type ReactNode } from "react";

export default function OverViewLayout({
  clients,
  pie_stats,
  bar_stats,
  area_stats,
}: {
  sales: ReactNode;
  pie_stats: ReactNode;
  bar_stats: ReactNode;
  area_stats: ReactNode;
}): ReactElement {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, Welcome back 👋
        </h2>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        {/* TODO: Add static cards here */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">{bar_stats}</div>
        <div className="col-span-4 md:col-span-3">{clients}</div>
        <div className="col-span-4">{area_stats}</div>
        <div className="col-span-4 md:col-span-3">{pie_stats}</div>
      </div>
    </>
  );
}
