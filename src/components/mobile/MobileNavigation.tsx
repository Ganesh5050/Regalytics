import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  LayoutDashboard,
  Users,
  Receipt,
  AlertTriangle,
  FileText,
  History,
  Building2,
  Workflow,
  Target,
  TrendingUp,
  UserCheck,
  CheckSquare,
  Mail,
  FolderOpen,
  Calendar,
  BarChart3
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    title: "Audit",
    url: "/audit",
    icon: History,
    description: "Audit Trail & Logs"
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
];

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={`lg:hidden ${className}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-6 border-b">
            <NavLink 
              to="/" 
              onClick={handleNavClick}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/favicon-32x32.png" 
                  alt="Regalytics Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold">Regalytics</SheetTitle>
                <SheetDescription className="text-sm">
                  Compliance & CRM Platform
                </SheetDescription>
              </div>
            </NavLink>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    onClick={handleNavClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {active && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              Regalytics CRM Platform
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
