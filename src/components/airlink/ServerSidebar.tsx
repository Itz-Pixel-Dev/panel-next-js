"use client";

import { useEffect, FC } from "react";
import { 
  Box, 
  User2, 
  Settings, 
  Users, 
  Database, 
  ImageIcon, 
  LogOut, 
  Server, 
  Computer, 
  LayoutGrid,
  Monitor,        // New icon for Console
  Puzzle,         // New icon for Plugins
  Shield,         // New icon for Overview
  DownloadCloud,  // New icon for Backups
  Power           // New icon for Startup
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ServerSidebar: FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const user = useAuth((state: any) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        useAuth.getState().setUser(null);
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile, setIsSidebarOpen]);

  return (
    <aside
      className={cn(
        "h-screen top-0 fixed left-0 pt-14 w-60 border-r bg-background transition-transform duration-300 ease-in-out sm:w-48 md:w-60",
        !isSidebarOpen && "-translate-x-full z-40"
      )}
    >
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.username || 'guest'}`} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'G'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.username || 'Unknown'}</div>
              <div className="text-sm text-muted-foreground">{user?.description || 'No description'}</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-2 space-y-1">
          <Button 
            variant={isActive('/dashboard') ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => router.push('/dashboard')}
          >
            <Server className="mr-2 h-4 w-4" />
            Servers
          </Button>
          <Button 
            variant={isActive('/account') ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => router.push('/account')}
          >
            <User2 className="mr-2 h-4 w-4" />
            Account
          </Button>
        </nav>

        {/* Admin Panel */}
        <div className="p-2 border-t mt-4">
          <div className="text-sm font-medium text-muted-foreground px-2 py-1.5">Server Navigation</div>
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Shield className="mr-2 h-4 w-4" /> {/* Changed from LayoutGrid */}
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Monitor className="mr-2 h-4 w-4" /> {/* Changed from Settings */}
              Console
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Puzzle className="mr-2 h-4 w-4" /> {/* Changed from Server */}
              Plugins
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Users className="mr-2 h-4 w-4" />   {/* Unchanged */}
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <DownloadCloud className="mr-2 h-4 w-4" /> {/* Changed from Computer */}
              Backups
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Settings className="mr-2 h-4 w-4" /> {/* Unchanged */}
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-foreground">
              <Power className="mr-2 h-4 w-4" /> {/* Changed from Computer */}
              Startup
            </Button>
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto p-2 border-t">
          <Button 
            variant="destructiveSecondary" 
            className="w-full justify-start text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ServerSidebar;