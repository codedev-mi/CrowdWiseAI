
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Bell, 
  FileText, 
  Camera, 
  Route, 
  Globe, 
  Bot, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Siren
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CrowdWiseLogo } from "@/components/icons";
import { logout } from "@/app/auth-actions";
import * as React from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MapIcon, label: "Heatmap", href: "/dashboard/heatmap" },
  { icon: Bell, label: "Alerts & Reports", href: "/dashboard/reports" },
  { icon: Camera, label: "Video Analysis", href: "/dashboard/video-analysis" },
  { icon: Route, label: "Evacuation", href: "/dashboard/evacuation" },
  { icon: Globe, label: "Social Monitoring", href: "/dashboard/social-monitoring" },
  { icon: Bot, label: "Resource Allocation", href: "/dashboard/resources" },
];


export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col border-r bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 transition-all duration-500 ease-in-out z-40 shadow-2xl",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex h-16 items-center border-b border-slate-800/50 px-6 bg-slate-950/20">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-white tracking-tighter">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <CrowdWiseLogo className="h-6 w-6 shrink-0 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg leading-none">CROWDWISE</span>
              <span className="text-[10px] text-primary font-black tracking-[0.2em] mt-0.5">TACTICAL ENGINE</span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/40 scale-[1.02]" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-50" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300 relative z-10",
                  isActive ? "text-white scale-110" : "group-hover:text-primary group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <span className="relative z-10 tracking-tight">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className={cn(
                    "absolute left-full ml-4 rounded-md bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl z-50 translate-x-[-10px] group-hover:translate-x-0",
                  )}>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-slate-800/50 p-4 space-y-2 bg-slate-950/20">
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-800/50 hover:text-white group",
            pathname === "/dashboard/profile" ? "bg-slate-800 text-white" : "",
            isCollapsed && "justify-center px-0"
          )}
        >
          <User className="h-5 w-5 shrink-0 group-hover:text-primary transition-colors" />
          {!isCollapsed && <span>Profile Settings</span>}
        </Link>
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-500 group",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:rotate-12 transition-transform" />
          {!isCollapsed && <span>System Logout</span>}
        </button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-sm hover:bg-primary hover:text-primary-foreground transition-all z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
  );
}
