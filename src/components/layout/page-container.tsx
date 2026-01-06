import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function PageContainer({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const content = (
    <div className="flex flex-1 flex-col space-y-2 p-4 md:px-6 min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
      {children}
    </div>
  );

  if (!scrollable) {
    return (
      <div className="flex flex-1 overflow-y-auto md:overflow-visible">
        {content}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 md:h-[calc(100dvh-52px)] md:max-h-[calc(100dvh-52px)]">
      {content}
    </ScrollArea>
  );
}
