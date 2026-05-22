
"use client";

import React, { useState } from "react";
import { Bell, Flame, Loader2, Volume2, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Alert } from "@/lib/types";

interface AlertsSectionProps {
  alerts: Alert[];
  onGeneratePredictiveAlert: () => void;
  onPlayAnnouncement: (text: string) => void;
  onGenerateReport: (alert: Alert) => void;
  isGeneratingReport: boolean;
  alertIcons: Record<string, React.ReactNode>;
  alertColors: Record<string, string>;
  className?: string;
  h?: string;
}

export function AlertsSection({ 
  alerts, 
  onGeneratePredictiveAlert, 
  onPlayAnnouncement, 
  onGenerateReport, 
  isGeneratingReport,
  alertIcons,
  alertColors,
  className,
  h = "h-[28vh]"
}: AlertsSectionProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <Card className={cn("overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Real-Time Intel
        </CardTitle>
        <Button onClick={onGeneratePredictiveAlert} size="sm" className="gap-2 h-8 text-xs font-bold shadow-lg shadow-primary/20">
          <Flame className="h-3.5 w-3.5" />
          Predictive Alert
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={h}>
          <div className="p-4 space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md",
                  alertColors[alert.severity]
                )}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/50 shadow-sm border">
                      {alertIcons[alert.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-sm truncate uppercase tracking-tight">{alert.title}</p>
                        <span className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{alert.message}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase">
                           <span className="flex items-center gap-1 px-2 py-0.5 bg-background/50 rounded-full border">
                             LOC: {alert.location}
                           </span>
                           <span className={cn(
                             "flex items-center gap-1 px-2 py-0.5 rounded-full border",
                             alert.severity === 'critical' ? "bg-red-500/10 text-red-600 border-red-500/20" : 
                             alert.severity === 'high' ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                             "bg-blue-500/10 text-blue-600 border-blue-500/20"
                           )}>
                             {alert.severity}
                           </span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(alert.severity === 'critical' || alert.severity === 'high') && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background/80" onClick={() => onPlayAnnouncement(`Attention: ${alert.title}. ${alert.message}`)}>
                              <Volume2 className="h-4 w-4 text-primary"/>
                            </Button>
                          )}
                          <Dialog open={isConfirmOpen && selectedAlert?.id === alert.id} onOpenChange={(open) => {
                            if (!open) {
                                setIsConfirmOpen(false);
                                setSelectedAlert(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 hover:bg-background/80" 
                                disabled={isGeneratingReport}
                                onClick={() => {
                                    setSelectedAlert(alert);
                                    setIsConfirmOpen(true);
                                }}
                              >
                                <FileText className="h-4 w-4 text-primary" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Operational Report Generation</DialogTitle>
                                <DialogDescription>
                                  Generate a formal incident report for this alert. This action will be logged in the system.
                                </DialogDescription>
                              </DialogHeader>
                              <Button 
                                onClick={() => {
                                  onGenerateReport(alert);
                                  setIsConfirmOpen(false);
                                  setSelectedAlert(null);
                                }} 
                                disabled={isGeneratingReport} 
                                className="w-full font-bold"
                              >
                                {isGeneratingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                                Confirm & Initialize AI Analysis
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 opacity-30">
                <Bell className="h-10 w-10 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No Active Threats</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
