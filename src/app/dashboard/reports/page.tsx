
"use client";

import { ReportsSection } from "@/components/dashboard/reports-section";
import { AlertsSection } from "@/components/dashboard/alerts-section";
import { ReportGenerationModal } from "@/components/dashboard/report-generation-modal";
import { IncidentReport, Alert } from "@/lib/types";
import * as React from "react";
import { FileText, Bell, Users, Siren, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generatePredictiveAlertsAction, generateAudioAction, generateIncidentReportAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";


const initialAlerts: Alert[] = [
  { id: '1', type: 'emergency', title: 'Medical Emergency', message: 'Assistance required at Sector 4.', location: 'Sector 4', severity: 'critical', timestamp: '1 min ago' },
  { id: '2', type: 'predictive', title: 'High Congestion Alert', message: 'Crowd at Gate 3 nearing unsafe levels. Rerouting suggested.', location: 'Gate 3', severity: 'high', timestamp: '3 mins ago' },
];

const alertIcons = {
  emergency: <Siren className="h-5 w-5" />,
  predictive: <Users className="h-5 w-5" />,
  info: <Bell className="h-5 w-5" />,
  social: <Globe className="h-5 w-5" />,
};

const alertColors = {
  low: "border-blue-500/20 bg-blue-500/5",
  medium: "border-yellow-500/20 bg-yellow-500/5",
  high: "border-orange-500/20 bg-orange-500/5",
  critical: "border-red-500/20 bg-red-500/5 text-red-900",
};

export default function ReportsPage() {
  const [incidentReports, setIncidentReports] = React.useState<IncidentReport[]>([]);
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = React.useState(false);
  const { toast } = useToast();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const playAnnouncement = async (text: string) => {
    const { success, error } = await generateAudioAction({ text });
    if (success && audioRef.current) {
        audioRef.current.src = success.audioDataUri;
        audioRef.current.play();
    }
  }

  const handleGeneratePredictiveAlert = async () => {
    const { success, error } = await generatePredictiveAlertsAction();
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
      const newAlert: Alert = {
        id: `${Date.now()}`,
        type: 'predictive',
        title: success.alertType,
        message: success.alertMessage,
        location: success.location,
        severity: success.severity.toLowerCase() as Alert['severity'],
        timestamp: 'Just now',
      };
      setAlerts(prev => [newAlert, ...prev]);
      toast({ title: 'New Predictive Alert', description: `Severity: ${success.severity} at ${success.location}` });

      if (newAlert.severity === 'critical') {
        playAnnouncement(`Critical Alert: ${newAlert.title}. ${newAlert.message}`);
      }
    }
  };

  const handleGenerateReport = async (alert: Alert) => {
    setIsGenerationModalOpen(true);
    const { success, error } = await generateIncidentReportAction({ alert });
    if (error) {
        toast({ variant: 'destructive', title: 'Report Generation Error', description: error });
        setIsGenerationModalOpen(false);
    }
    if (success) {
        setIncidentReports(prev => [success, ...prev]);
        setTimeout(() => {
            toast({ title: 'Incident Report Generated', description: `Report ID: ${success.reportId}` });
        }, 3000);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 overflow-auto bg-muted/30">
      <audio ref={audioRef} className="sr-only" />
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Bell className="h-10 w-10 text-primary" />
          Alerts & Incident Reports
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Unified command center for real-time tactical alerts and historical incident documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ReportsSection 
            incidentReports={incidentReports}
            h="h-[calc(100vh-320px)]"
            className="shadow-2xl border-none ring-1 ring-border/50"
          />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <AlertsSection 
            alerts={alerts}
            onGeneratePredictiveAlert={handleGeneratePredictiveAlert}
            onPlayAnnouncement={playAnnouncement}
            onGenerateReport={handleGenerateReport}
            isGeneratingReport={isGenerationModalOpen}
            alertIcons={alertIcons}
            alertColors={alertColors}
            h="h-[45vh]"
            className="shadow-xl border-none ring-1 ring-border/50"
          />

          <Card className="bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl shadow-primary/20 border-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Siren className="h-20 w-20" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Tactical Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">OPERATIONAL</div>
              <p className="text-[10px] mt-2 font-bold opacity-70 uppercase tracking-widest leading-relaxed">
                AI Engine: Active <br/>
                Sector Integrity: 100%
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b bg-muted/30">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Intelligence Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center bg-muted/40 p-3 rounded-xl border border-dashed">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Reports</span>
                  <span className="text-lg font-black">{incidentReports.length}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex justify-between items-center bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Critical Threats</span>
                  <span className="text-lg font-black text-red-600">{incidentReports.filter(r => r.priority === 'critical').length}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Siren className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ReportGenerationModal 
        isOpen={isGenerationModalOpen} 
        onClose={() => setIsGenerationModalOpen(false)} 
      />
    </div>
  );
}
