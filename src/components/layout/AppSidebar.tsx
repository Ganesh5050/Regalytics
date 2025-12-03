import { useState } from "react";
import { 
  LayoutDashboard,
  Users,
  Receipt,
  AlertTriangle,
  FileText,
  History,
  ChevronRight,
  Building2,
  Workflow,
  Target,
  TrendingUp,
  UserCheck,
  CheckSquare,
  Mail,
  FolderOpen,
  Calendar,
  BarChart3,
  Brain
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/common/GlobalSearch";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    description: "KYC & Customer Management"
  },
  {
    title: "Transactions", 
    url: "/transactions",
    icon: Receipt,
    description: "Transaction Monitoring"
  },
  {
    title: "Alerts",
    url: "/alerts", 
    icon: AlertTriangle,
    description: "Risk & Compliance Alerts"
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    description: "Compliance Reports"
  },
  {
    title: "Audit Logs",
    url: "/audit",
    icon: History,
    description: "System Activity"
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
    description: "N8n Automation"
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Target,
    description: "Lead Management"
  },
  {
    title: "Sales Pipeline",
    url: "/sales-pipeline",
    icon: TrendingUp,
    description: "Deal Tracking"
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: UserCheck,
    description: "Contact Management"
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    description: "Task Management"
  },
  {
    title: "Email",
    url: "/email",
    icon: Mail,
    description: "Email Management"
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FolderOpen,
    description: "Document Management"
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Calendar & Scheduling"
  },
  {
    title: "CRM Analytics",
    url: "/crm-analytics",
    icon: BarChart3,
    description: "Sales & Customer Analytics"
  },
  {
    title: "AI Analytics",
    url: "/ai-analytics",
    icon: Brain,
    description: "AI Risk & Predictive Analytics"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="glass-card border-r border-sidebar-border bg-sidebar/50 backdrop-blur-md">
      <SidebarContent className="p-0">
        {/* Brand Header */}
        <NavLink 
          to="/" 
          className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-6 border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src="/favicon-32x32.png" 
              alt="Regalytics Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-semibold text-sidebar-primary truncate">Regalytics</span>
              <span className="text-xs text-sidebar-foreground/60 truncate">Enterprise Platform</span>
            </div>
          )}
        </NavLink>

        {/* Global Search - Only show when sidebar is expanded */}
        {!isCollapsed && (
          <div className="px-4 sm:px-6 pb-4">
            <GlobalSearch />
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup className="px-2 sm:px-3 py-4">
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide px-3 mb-2">
            {!isCollapsed ? "Platform" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "group relative h-10 sm:h-11 rounded-xl transition-all duration-200",
                      "hover:bg-sidebar-accent/80 hover:shadow-soft",
                      isActive(item.url) && [
                        "bg-primary text-primary-foreground shadow-medium",
                        "hover:bg-primary-hover"
                      ]
                    )}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                      <item.icon className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 transition-colors flex-shrink-0",
                        isActive(item.url) ? "text-primary-foreground" : "text-sidebar-foreground"
                      )} />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-medium text-sm truncate",
                            isActive(item.url) ? "text-primary-foreground" : "text-sidebar-foreground"
                          )}>
                            {item.title}
                          </div>
                          <div className={cn(
                            "text-xs opacity-70 truncate",
                            isActive(item.url) ? "text-primary-foreground" : "text-sidebar-foreground"
                          )}>
                            {item.description}
                          </div>
                        </div>
                      )}
                      {!isCollapsed && isActive(item.url) && (
                        <ChevronRight className="h-4 w-4 text-primary-foreground flex-shrink-0" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}