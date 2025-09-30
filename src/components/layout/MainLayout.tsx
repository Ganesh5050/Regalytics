import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Initialize real-time updates
  useRealTimeUpdates({
    enableNotifications: true,
    enableSound: false,
    enableDesktopNotifications: true
  });

  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNavbar />
            <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
        <NotificationCenter />
      </SidebarProvider>
    </ThemeProvider>
  );
}