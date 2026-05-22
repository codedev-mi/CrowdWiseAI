"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardContext } from "@/contexts/dashboard-context";

interface HeaderInteractiveProps {
  alerts?: Alert[];
}

export function HeaderInteractive({ alerts: propAlerts }: HeaderInteractiveProps) {
  const { alerts: contextAlerts } = useDashboardContext();
  const alerts = propAlerts && propAlerts.length > 0 ? propAlerts : contextAlerts;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadAlerts = alerts.slice(0, 5); // Show 5 most recent alerts
  const hasNotifications = alerts.length > 0;

  return (
    <div className="flex items-center gap-6">
      {/* Notification Bell */}
      <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl hover:bg-primary/5 group"
          >
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {hasNotifications && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border-2 border-card"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {alerts.length > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                {alerts.length}
              </span>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="divide-y">
                {unreadAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          alert.severity === "critical"
                            ? "bg-red-600"
                            : alert.severity === "high"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {alerts.length > 5 && (
                  <div className="p-3 text-center text-xs text-primary hover:bg-muted/50 transition-colors cursor-pointer">
                    View all {alerts.length} notifications
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
