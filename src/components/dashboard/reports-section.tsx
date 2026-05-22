
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentReport } from "@/lib/types";
import { FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsSectionProps {
  incidentReports: IncidentReport[];
  className?: string;
  h?: string;
}


export function ReportsSection({ incidentReports, className, h = "h-[28vh]" }: ReportsSectionProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Official Incident Logs
          </CardTitle>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted px-2 py-1 rounded">
            Secured AI Archive
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={h}>
          <div className="p-6 space-y-6">
            {incidentReports.length > 0 ? (
              incidentReports.map((report) => (
                <div key={report.reportId} className="relative group">
                  <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-full" />
                  <div className="bg-background rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm text-foreground tracking-tight">{report.summary}</h4>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        report.priority === 'critical' ? "bg-red-500/10 text-red-600" : "bg-orange-500/10 text-orange-600"
                      )}>
                        {report.priority}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 text-[10px] text-muted-foreground mb-4 border-b border-dashed pb-3">
                      <span className="flex items-center gap-1">
                        <span className="font-bold">ID:</span> {report.reportId}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-bold">TIMESTAMP:</span> {new Date().toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Suggested Operational Actions:</p>
                      <ul className="grid grid-cols-1 gap-2">
                        {report.suggestedActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs bg-muted/40 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-all">
                            <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 opacity-40">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-sm font-medium">No official reports documented.</p>
                <p className="text-xs">Generated reports will appear here as formal logs.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
