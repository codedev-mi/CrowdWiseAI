
"use client";

import { VideoAnalysisSection } from "@/components/dashboard/video-analysis-section";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeCrowdAction, generateAudioAction, generateIncidentReportAction } from "@/app/actions";
import { AlertsSection } from "@/components/dashboard/alerts-section";
import { Alert } from "@/lib/types";
import { Siren, Users, Bell, Globe, Camera } from "lucide-react";
import { ReportGenerationModal } from "@/components/dashboard/report-generation-modal";

interface GateAnalysis {
  gateId: string;
  location: string;
  videoSrc?: string;
  peopleCount?: number;
  density?: 'low' | 'medium' | 'high' | 'critical';
  isLoading: boolean;
  isAutoAnalyzing: boolean;
}

const initialGates: GateAnalysis[] = [
  { gateId: 'Checkpoint 1', location: '20.012085516682763, 73.76271362476956', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 2', location: '20.01402106323487, 73.82142181452639', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 3', location: '19.994503211817726, 73.81069297867901', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 4', location: '19.993535321495504, 73.75825042905704', isLoading: false, isAutoAnalyzing: false },
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
  critical: "border-red-500/20 bg-red-500/5",
};

export default function VideoAnalysisPage() {
  const [gateAnalyses, setGateAnalyses] = React.useState<GateAnalysis[]>(initialGates);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = React.useState(false);
  const videoRefs = React.useRef<Record<string, React.RefObject<HTMLVideoElement>>>({});
  const analysisIntervals = React.useRef<Record<string, NodeJS.Timeout>>({});
  const { toast } = useToast();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  gateAnalyses.forEach(gate => {
    if (!videoRefs.current[gate.gateId]) {
      videoRefs.current[gate.gateId] = React.createRef<HTMLVideoElement>();
    }
  });

  React.useEffect(() => {
    return () => {
      Object.values(analysisIntervals.current).forEach(clearInterval);
    };
  }, []);

  const playAnnouncement = async (text: string) => {
    const { success, error } = await generateAudioAction({ text });
    if (success && audioRef.current) {
        audioRef.current.src = success.audioDataUri;
        audioRef.current.play();
    }
  }

  const analyzeVideoFrame = React.useCallback((gateId: string, location: string) => {
    const videoRef = videoRefs.current[gateId]?.current;
    if (!videoRef || videoRef.paused || videoRef.ended) {
        if (!videoRef) return;
        toast({ 
            variant: "destructive", 
            title: "Analysis Suspended", 
            description: "Please start the video stream before attempting an AI scan." 
        });
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: true } : g));

    analyzeCrowdAction({ checkpointId: gateId, photoDataUri }).then(({ success, error }) => {
        if (error) {
            toast({ variant: 'destructive', title: 'Analysis Error', description: error });
            setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: false } : g));
            return;
        }
        if (success) {
            setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: false, peopleCount: success.peopleCount, density: success.density as any } : g));
            
            // Restore Original Functionality: Auto-generate Alerts for High/Critical density
            if (success.density === 'high' || success.density === 'critical') {
                const newAlert: Alert = {
                    id: `${Date.now()}`,
                    type: 'predictive',
                    title: `High Crowd Density at ${gateId}`,
                    message: `Detected ${success.peopleCount} people. Density is ${success.density}. Proactive measures required.`,
                    location: gateId,
                    severity: success.density as 'high' | 'critical',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setAlerts(prev => [newAlert, ...prev]);
                toast({ title: 'Alert Generated', description: `High density detected at ${gateId}` });

                if (newAlert.severity === 'critical') {
                    playAnnouncement(`Critical Alert: ${newAlert.title}. ${newAlert.message}`);
                }
            }
        }
    });
  }, [toast]);

  const handleGenerateReport = async (alert: Alert) => {
    setIsGenerationModalOpen(true);
    const { success, error } = await generateIncidentReportAction({ alert });
    if (error) {
        toast({ variant: 'destructive', title: 'Report Generation Error', description: error });
        setIsGenerationModalOpen(false);
    }
    if (success) {
        setTimeout(() => {
            toast({ title: 'Incident Report Generated', description: `Report ID: ${success.reportId}` });
        }, 3000);
    }
  }

  const toggleAutoAnalysis = (gateId: string, location: string, shouldAutoAnalyze: boolean) => {
    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isAutoAnalyzing: shouldAutoAnalyze } : g));
    if (shouldAutoAnalyze) {
        // Trigger immediate scan
        analyzeVideoFrame(gateId, location);
        
        analysisIntervals.current[gateId] = setInterval(() => {
            analyzeVideoFrame(gateId, location);
        }, 15000);
    } else {
        if (analysisIntervals.current[gateId]) {
            clearInterval(analysisIntervals.current[gateId]);
            delete analysisIntervals.current[gateId];
        }
        setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: false } : g));
    }
  };

  const handleVideoSourceChange = (gateId: string, source: string, type: 'file' | 'url') => {
    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, videoSrc: source } : g));
  };
  
  const handleLocationChange = (gateId: string, newLocation: string) => {
    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, location: newLocation } : g));
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 overflow-auto bg-muted/30">
      <audio ref={audioRef} className="sr-only" />
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Camera className="h-10 w-10 text-primary" />
          Tactical Video Intelligence
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Real-time AI crowd monitoring and predictive density analysis across multiple checkpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <VideoAnalysisSection 
            gateAnalyses={gateAnalyses}
            videoRefs={videoRefs}
            onVideoSourceChange={handleVideoSourceChange}
            onLocationChange={handleLocationChange}
            onAnalyzeFrame={analyzeVideoFrame}
            onToggleAutoAnalysis={toggleAutoAnalysis}
          />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <AlertsSection 
            alerts={alerts}
            onGeneratePredictiveAlert={() => {}}
            onPlayAnnouncement={playAnnouncement}
            onGenerateReport={handleGenerateReport}
            isGeneratingReport={isGenerationModalOpen}
            alertIcons={alertIcons}
            alertColors={alertColors}
            h="h-[60vh]"
            className="shadow-xl border-none ring-1 ring-border/50"
          />
        </div>
      </div>

      <ReportGenerationModal 
        isOpen={isGenerationModalOpen} 
        onClose={() => setIsGenerationModalOpen(false)} 
      />
    </div>
  );
}
