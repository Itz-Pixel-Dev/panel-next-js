"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/card"
import { cn, Server } from "@/lib/utils";
import Header from "@/components/airlink/Header";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/utils/authenticated";
import ServerSidebar from "@/components/airlink/ServerSidebar";

const Overview: React.FC = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [servers, setServers] = useState<Server[]>([
    { name: "Server1", uuid: "123e4567", ram: "8GB", cpu: "400%", disk: "50GB", memoryUsage: "8/16GB", cpuUsage: "50%", diskUsage: "25/50GB", status: 'Online' },
    { name: "Server2", uuid: "223e4567", ram: "6GB", cpu: "800%", disk: "100GB", memoryUsage: "16/32GB", cpuUsage: "70%", diskUsage: "50/100GB", status: 'Starting' },
    { name: "Server3", uuid: "323e4567", ram: "12GB", cpu: "1600%", disk: "200GB", memoryUsage: "32/64GB", cpuUsage: "90%", diskUsage: "100/200GB", status: 'Stopped' }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prevServers => prevServers.map(server => {
        if (server.status !== 'Stopped') {
          return {
            ...server,
            memoryUsage: `${Math.floor(Math.random() * parseInt(server.ram))}/${server.ram}`,
            cpuUsage: `${(Math.random() * 100).toFixed(1)}%`,
            diskUsage: `${Math.floor(Math.random() * parseInt(server.disk))}/${server.disk}`
          };
        }
        return {
          ...server,
          memoryUsage: `0/${server.ram}`,
          cpuUsage: `0%`,
          diskUsage: `0/${server.disk}`
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="min-h-screen dark bg-background text-foreground">
            <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <ServerSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className={cn("pt-14 transition-all duration-300 ease-in-out", isSidebarOpen ? "pl-60" : "pl-0")}>
              <div className="p-6 sm:p-4 md:p-6">
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold">Overview</h1>
                  <p className="text-muted-foreground">Summary of your server is shown here.</p>
                </div>

                <div className="">
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                        <CardHeader>
                          <CardTitle>Server Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Version</div>
                              <div className="text-lg font-medium">1.19.2</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Players</div>
                              <div className="text-lg font-medium">12/100</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Uptime</div>
                              <div className="text-lg font-medium">3 days</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">IP Address</div>
                              <div className="text-lg font-medium">mc.acme.com</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                        <CardHeader>
                          <CardTitle>Server Controls</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Button>Start</Button>
                            <Button variant="secondary">Restart</Button>
                            <Button variant="outline">Hibernate</Button>
                            <Button variant="destructive">Stop</Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                    </main>
                  </div>
                </div>
              </div>
            </main>
    </div>
  );
};

export default Overview;

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function GlobeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}


function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}


function PlugIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  )
}


function ServerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UserMinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}


function UserXIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </svg>
  )
}
