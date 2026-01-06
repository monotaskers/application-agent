import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import PageContainer from "@/components/layout/page-container";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CopilotSidebar } from "@/features/copilotkit";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Admin | AppName",
  description: "Sustainable supply chain management platform",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="flex h-screen flex-col overflow-hidden w-full max-w-full min-w-0">
          <Header />
          {/* page main content */}
          <PageContainer>{children}</PageContainer>
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
      <CopilotSidebar />
    </KBar>
  );
}
