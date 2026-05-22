
import { Sidebar } from "@/components/sidebar";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeaderInteractive } from "@/components/header-interactive";
import { DashboardProvider } from "@/contexts/dashboard-context";
import Link from "next/link";

import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  let user = { name: "Guest", email: "guest@example.com" };
  if (session) {
    if (session === "mock-session-token") {
      // Handle legacy session token silently
      user = { name: "Guest", email: "guest@example.com" };
    } else {
      try {
        user = JSON.parse(session);
      } catch (e) {
        // Silently fall back for any other malformed session data
      }
    }
  }
  
  const initials = user.name?.substring(0, 2).toUpperCase() || "GU";

  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-full bg-background font-sans antialiased">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center gap-4 border-b bg-card px-8 shadow-sm z-30">
            <div className="flex-1">
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  System Live
                </span>
                <span className="h-4 w-[1px] bg-border" />
                <span className="text-foreground/60">Sector 7: Normal</span>
                <span className="h-4 w-[1px] bg-border" />
                <span className="text-foreground/60">Personnel: 124 Active</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <HeaderInteractive alerts={[]} />
              
              <div className="h-8 w-[1px] bg-border" />
              
              <Link href="/dashboard/profile">
                  <div className="flex items-center gap-3 cursor-pointer group">
                      <div className="text-right hidden md:block">
                          <p className="text-xs font-black text-foreground uppercase tracking-tight">{user.name}</p>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Administrator</p>
                      </div>
                      <Avatar className="h-10 w-10 rounded-xl border-2 border-transparent group-hover:border-primary transition-all shadow-md">
                          <AvatarImage src="/avatars/01.png" alt="Avatar" />
                          <AvatarFallback className="bg-primary text-white font-bold">{initials}</AvatarFallback>
                      </Avatar>
                  </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
