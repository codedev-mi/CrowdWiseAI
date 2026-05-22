
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, LogOut } from "lucide-react";
import { logout } from "@/app/auth-actions";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  let user = { name: "Aditya Kumar", email: "aditya.k@crowdwise.com" };
  if (session) {
    if (session === "mock-session-token") {
      // Handle legacy session token silently
      user = { name: "Aditya Kumar", email: "aditya.k@crowdwise.com" };
    } else {
      try {
        user = JSON.parse(session);
      } catch (e) {
        // Silently fall back for any other malformed session data
      }
    }
  }
  
  const initials = user.name?.substring(0, 2).toUpperCase() || "AD";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your personal information and role.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">Lead Incident Commander</p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Administrator</span>
              </div>
            </div>
            <form action={logout} className="w-full">
              <Button type="submit" variant="destructive" className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Lead Incident Commander" disabled />
            </div>
            <Button className="w-fit">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
