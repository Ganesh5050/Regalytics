import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNavigation } from "./MobileNavigation";
import { useAuth } from "@/contexts/AuthContext";

interface MobileResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  className?: string;
}

export function MobileResponsiveLayout({ 
  children, 
  title, 
  description, 
  showSearch = true, 
  showNotifications = true,
  className = "" 
}: MobileResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!isMobile) {
    // Return children as-is for desktop
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MobileNavigation />
            <div>
              {title && (
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="text-xs text-gray-500">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {showSearch && (
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">D</span>
            </div>
            <span className="text-xs">Dashboard</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">L</span>
            </div>
            <span className="text-xs">Leads</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">S</span>
            </div>
            <span className="text-xs">Sales</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">C</span>
            </div>
            <span className="text-xs">Contacts</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">T</span>
            </div>
            <span className="text-xs">Tasks</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
