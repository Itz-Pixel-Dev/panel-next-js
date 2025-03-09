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
import { useRouter, usePathname, useParams } from "next/navigation";

const ServerSidebar: FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const user = useAuth((state: any) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const features = ["players"];  // For testing purposes, can be dynamic

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

  // Navigation handler
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const serverUUID = useParams().id

  return (
    <div className="mt-6 mb-8">
      <div>
        <div className="hidden relative sm:block">
          <nav className="flex relative">
            <ul role="list" className="flex min-w-full mt-1.5 flex-none gap-x-2 text-sm font-normal leading-6 text-neutral-400">
              {/* Console Button */}
              <li className="transition">
                <Button
                  onClick={() => handleNavigation(`/server/${serverUUID}`)}
                  variant={isActive("/server") ? "secondary" : "ghost"}
                  className="nav-link2 py-2 px-3 transition border hover:bg-white/5 border-transparent hover:text-white hover:shadow rounded-xl"
                >
                  <Monitor className="size-5 mb-0.5 inline-flex mr-1" />
                  Console
                </Button>
              </li>

              {/* Files Button */}
              <li className="transition">
                <Button
                  onClick={() => handleNavigation(`/server/${serverUUID}/files`)}
                  variant={isActive("/files") ? "secondary" : "ghost"}
                  className="nav-link2 py-2 px-3 transition border hover:bg-white/5 border-transparent hover:text-white hover:shadow rounded-xl"
                >
                  <Database className="size-5 mb-0.5 inline-flex mr-1" />
                  Files
                </Button>
              </li>

              {/* Players Button (Conditional rendering based on 'players' feature) */}
              {features.includes("players") && (
                <li className="transition">
                  <Button
                    onClick={() => handleNavigation(`/server/${serverUUID}/players`)}
                    variant={isActive("/players") ? "secondary" : "ghost"}
                    className="w-full justify-start nav-link2 py-2 px-3 transition border hover:bg-white/5 border-transparent hover:text-white hover:shadow rounded-xl"
                  >
                    <Users className="size-5 mb-0.5 inline-flex mr-1" />
                    Players
                  </Button>
                </li>
              )}

              {/* Worlds Button (Conditional rendering based on 'worlds' feature) */}
              {features.includes("worlds") && (
                <li className="transition">
                  <Button
                    onClick={() => handleNavigation(`/server/${serverUUID}/worlds`)}
                    variant={isActive("/worlds") ? "secondary" : "ghost"}
                    className="nav-link2 py-2 px-3 transition border hover:bg-white/5 border-transparent hover:text-white hover:shadow rounded-xl"
                  >
                    <Puzzle className="size-5 mb-0.5 inline-flex mr-1" />
                    Worlds
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;