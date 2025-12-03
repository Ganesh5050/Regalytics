import { Bell, Search, Settings, User, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { APIStatusIndicator } from "@/components/common/APIStatusIndicator";
import { WebSocketIndicator } from "@/components/common/WebSocketIndicator";
import { RealTimeIndicator } from "@/components/common/RealTimeIndicator";

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <SidebarTrigger className="hover:bg-accent/50 transition-micro flex-shrink-0" />
          
          {/* Global Search - Hidden on mobile, visible on tablet+ */}
          <div className="relative hidden md:block md:w-64 lg:w-96 max-w-sm">
<<<<<<< HEAD
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search clients, transactions, reports..."
              className="pl-9 bg-[rgb(245,245,245)] text-blue-600 placeholder:text-gray-400 border-0 rounded-[10px] shadow-[rgba(158,158,158,0.69)_0px_0.706592px_0.706592px_-0.583333px,rgba(158,158,158,0.68)_0px_1.80656px_1.80656px_-1.16667px,rgba(158,158,158,0.65)_0px_3.62176px_3.62176px_-1.75px,rgba(158,158,158,0.61)_0px_6.8656px_6.8656px_-2.33333px,rgba(158,158,158,0.52)_0px_13.6468px_13.6468px_-2.91667px,rgba(158,158,158,0.3)_0px_30px_30px_-3.5px,rgb(255,255,255)_0px_3px_1px_0px_inset] focus:shadow-[rgba(158,158,158,0.69)_0px_0.706592px_0.706592px_-0.583333px,rgba(158,158,158,0.68)_0px_1.80656px_1.80656px_-1.16667px,rgba(158,158,158,0.65)_0px_3.62176px_3.62176px_-1.75px,rgba(158,158,158,0.61)_0px_6.8656px_6.8656px_-2.33333px,rgba(158,158,158,0.52)_0px_13.6468px_13.6468px_-2.91667px,rgba(158,158,158,0.3)_0px_30px_30px_-3.5px,rgb(255,255,255)_0px_2px_0.5px_0px_inset] transition-all"
=======
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search clients, transactions, reports..."
              className="pl-9 bg-muted/50 border-border/50 focus:bg-background transition-micro"
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Status Indicators - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2">
            <APIStatusIndicator />
            <WebSocketIndicator />
            <RealTimeIndicator />
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 p-0 border-border/50 hover:bg-accent/50"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative h-9 w-9 p-0 border-border/50 hover:bg-accent/50">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground border-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* Settings - Hidden on mobile */}
          <Button variant="outline" size="sm" className="hidden sm:flex h-9 w-9 p-0 border-border/50 hover:bg-accent/50">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 sm:gap-2 px-2 sm:px-3 border-border/50 hover:bg-accent/50">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card">
              <DropdownMenuLabel className="pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-accent/50 transition-micro">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent/50 transition-micro">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="hover:bg-accent/50 transition-micro text-destructive focus:text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}