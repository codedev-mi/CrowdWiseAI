
"use client";

import {
  Activity,
  Bell,
  Bot,
  Camera,
  ChevronRight,
  FileText,
  Flame,
  Globe,
  HeartPulse,
  Loader2,
  LogOut,
  Map,
  Route,
  Search,
  Send,
  Siren,
  Shield,
  User,
  Users,
  Volume2,
} from "lucide-react";
import * as React from "react";
import dynamic from 'next/dynamic';

import { analyzeCrowdAction, generateAudioAction, generateIncidentReportAction, generatePredictiveAlertsAction, suggestEvacuationRoutesAction, analyzeSocialMediaAction, suggestResourceAllocationAction } from "@/app/actions";
import { logout } from "@/app/auth-actions";
import { CrowdWiseLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { Alert, EmergencyService, EvacuationRoute, Hotspot, IncidentReport, ResourceSuggestion, RouteSuggestion, RouteDetail, SocialMediaAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { README } from "@/components/readme";
import Link from "next/link";
import { HeatmapSection } from "./dashboard/heatmap-section";
import { AlertsSection } from "./dashboard/alerts-section";
import { ReportsSection } from "./dashboard/reports-section";
import { VideoAnalysisSection } from "./dashboard/video-analysis-section";
import { EvacuationSection } from "./dashboard/evacuation-section";
import { TrendAnalysisSection } from "./dashboard/trend-analysis-section";
import { SocialMonitoringSection } from "./dashboard/social-monitoring-section";
import { ResourceAllocationSection } from "./dashboard/resource-allocation-section";
import { EmergencyServicesSection } from "./dashboard/emergency-services-section";
import { ReportGenerationModal } from "./dashboard/report-generation-modal";
import { HeaderInteractive } from "@/components/header-interactive";
import { SearchResultsModal } from "@/components/search-results-modal";
import { DashboardSearchBar } from "@/components/dashboard-search-bar";
import { AlertCircle, FileText as FileTextIcon, Package } from "lucide-react";
import { useDashboardContext } from "@/contexts/dashboard-context";

const Heatmap = dynamic(() => import('@/components/heatmap').then(mod => mod.Heatmap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

const initialAlerts: Alert[] = [
  { id: '1', type: 'emergency', title: 'Medical Emergency', message: 'Assistance required at Sector 4.', location: 'Sector 4', severity: 'critical', timestamp: '1 min ago' },
  { id: '2', type: 'predictive', title: 'High Congestion Alert', message: 'Crowd at Gate 3 nearing unsafe levels. Rerouting suggested.', location: 'Gate 3', severity: 'high', timestamp: '3 mins ago' },
  { id: '3', type: 'info', title: 'Weather Update', message: 'Light showers expected in 30 mins.', location: 'All Zones', severity: 'low', timestamp: '10 mins ago' },
];

const initialHotspots: Hotspot[] = [
    { id: 1, name: "Main Stage", density: 95, position: [20.006, 73.791], size: 500, severity: "critical" },
    { id: 2, name: "Food Court", density: 78, position: [20.009, 73.795], size: 350, severity: "high" },
    { id: 3, name: "Gate 3 Entrance", density: 85, position: [20.003, 73.788], size: 400, severity: "high" },
    { id: 4, name: "Merch Tent", density: 60, position: [20.004, 73.796], size: 250, severity: "medium" },
    { id: 5, name: "Restrooms", density: 45, position: [20.008, 73.787], size: 200, severity: "low" },
];

const emergencyServicesData: EmergencyService[] = [
    { id: 'h1', type: 'hospital', name: 'Wockhardt Hospital', position: [20.008, 73.766] },
    { id: 'h2', type: 'hospital', name: 'Apollo Hospital', position: [19.996, 73.784] },
    { id: 'h3', type: 'hospital', name: 'Six Sigma Medicare', position: [19.992, 73.765] },
    { id: 'p1', type: 'police', name: 'Bhadrakali Police Station', position: [19.993, 73.789] },
    { id: 'p2', type: 'police', name: 'Gangapur Police Station', position: [20.009, 73.753] },
    { id: 'p3', type: 'police', name: 'Sarkarwada Police Station', position: [19.999, 73.781] },
    { id: 'f1', type: 'fire', name: 'Panchavati Fire Station', position: [20.007, 73.795] },
    { id: 'f2', type: 'fire', name: 'CIDCO Fire Station', position: [19.969, 73.757] },
    { id: 'f3', type: 'fire', name: 'Nashik Road Fire Station', position: [19.957, 73.834] },
];

const trendData = [
  { time: "8 AM", density: 1200, "last-year": 900 },
  { time: "10 AM", density: 3400, "last-year": 2800 },
  { time: "12 PM", density: 7800, "last-year": 6500 },
  { time: "2 PM", density: 6500, "last-year": 6100 },
  { time: "4 PM", density: 8200, "last-year": 7800 },
  { time: "6 PM", density: 9500, "last-year": 9100 },
];

const routeSchema = z.object({
  currentLocation: z.string().min(3, "Current location is required."),
  destination: z.string().min(3, "Destination is required."),
});

const socialMediaSchema = z.object({
    postText: z.string().min(10, "Post must be at least 10 characters."),
});

const alertIcons = {
  emergency: <Siren className="h-5 w-5" />,
  predictive: <Users className="h-5 w-5" />,
  info: <Bell className="h-5 w-5" />,
  social: <Globe className="h-5 w-5" />,
};

const alertColors = {
  low: "border-blue-500/80 bg-blue-500/10",
  medium: "border-yellow-500/80 bg-yellow-500/10",
  high: "border-orange-500/80 bg-orange-500/10",
  critical: "border-red-500/80 bg-red-500/10",
};

const marqueeAlertColors: {[key: string]: string} = {
    low: "text-blue-400",
    medium: "text-yellow-400",
    high: "text-orange-400",
    critical: "text-red-400",
}

type GateAnalysis = {
  gateId: string;
  location: string;
  videoSrc?: string;
  peopleCount?: number;
  density?: 'low' | 'medium' | 'high' | 'critical';
  isLoading: boolean;
  isAutoAnalyzing: boolean;
};

const densityMap = {
  low: { size: 200, severity: "low" as const },
  medium: { size: 350, severity: "medium" as const },
  high: { size: 400, severity: "high" as const },
  critical: { size: 500, severity: "critical" as const },
};

const initialGates: GateAnalysis[] = [
  { gateId: 'Checkpoint 1', location: '20.012085516682763, 73.76271362476956', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 2', location: '20.01402106323487, 73.82142181452639', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 3', location: '19.994503211817726, 73.81069297867901', isLoading: false, isAutoAnalyzing: false },
  { gateId: 'Checkpoint 4', location: '19.993535321495504, 73.75825042905704', isLoading: false, isAutoAnalyzing: false },
];

function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function Dashboard() {
  const { setAlerts: setContextAlerts } = useDashboardContext();
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);
  
  // Update context whenever alerts change
  React.useEffect(() => {
    setContextAlerts(alerts);
  }, [alerts, setContextAlerts]);
  const [routeSuggestion, setRouteSuggestion] = React.useState<RouteSuggestion | null>(null);
  const [isSuggestingRoute, setIsSuggestingRoute] = React.useState(false);
  const [gateAnalyses, setGateAnalyses] = React.useState<GateAnalysis[]>(initialGates);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const videoRefs = React.useRef<{[key: string]: React.RefObject<HTMLVideoElement>}>({});
  gateAnalyses.forEach(gate => {
    if (!videoRefs.current[gate.gateId]) {
      videoRefs.current[gate.gateId] = React.createRef<HTMLVideoElement>();
    }
  });

  const [hotspots, setHotspots] = React.useState<Hotspot[]>(initialHotspots);
  const [incidentReports, setIncidentReports] = React.useState<IncidentReport[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(false);
  const [socialMediaAnalysis, setSocialMediaAnalysis] = React.useState<SocialMediaAnalysis | null>(null);
  const [isAnalyzingSocialMedia, setIsAnalyzingSocialMedia] = React.useState(false);
  const [resourceSuggestion, setResourceSuggestion] = React.useState<ResourceSuggestion | null>(null);
  const [isSuggestingResources, setIsSuggestingResources] = React.useState(false);
  const [evacuationRoutes, setEvacuationRoutes] = React.useState<EvacuationRoute[]>([]);
  const [visibleServices, setVisibleServices] = React.useState<EmergencyService[]>([]);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = React.useState(false);
  const [resultTimestamps, setResultTimestamps] = React.useState<{
    route: number;
    report: number;
    resource: number;
    alert: number;
  }>({
    route: 0,
    report: 0,
    resource: 0,
    alert: initialAlerts.length > 0 ? Date.now() : 0,
  });

  const latestDashboardResult = React.useMemo(() => {
    const results: Array<{ timestamp: number; type: string; title: string; details: string; badge: string }> = [];

    if (routeSuggestion?.recommendationReasoning && resultTimestamps.route > 0) {
      results.push({
        timestamp: resultTimestamps.route,
        type: 'route',
        title: "Evacuation Recommendation",
        details: routeSuggestion.recommendationReasoning,
        badge: "Route Analysis",
      });
    }

    if (incidentReports.length > 0 && resultTimestamps.report > 0) {
      results.push({
        timestamp: resultTimestamps.report,
        type: 'report',
        title: "Latest Incident Report",
        details: incidentReports[0].summary,
        badge: "Incident Update",
      });
    }

    if (resourceSuggestion?.reasoning && resultTimestamps.resource > 0) {
      results.push({
        timestamp: resultTimestamps.resource,
        type: 'resource',
        title: "Resource Allocation Insight",
        details: resourceSuggestion.reasoning,
        badge: "Resource Planning",
      });
    }

    if (alerts.length > 0 && resultTimestamps.alert > 0) {
      results.push({
        timestamp: resultTimestamps.alert,
        type: 'alert',
        title: "Recent Alert",
        details: `${alerts[0].title}: ${alerts[0].message}`,
        badge: "Alert Summary",
      });
    }

    if (results.length === 0) {
      return {
        title: "Awaiting dashboard insights",
        details: "Run a route suggestion, generate an alert, or analyze social media to display the latest result here.",
        badge: "Idle",
      };
    }

    // Return the most recent result
    const mostRecent = results.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    );

    return {
      title: mostRecent.title,
      details: mostRecent.details,
      badge: mostRecent.badge,
    };
  }, [routeSuggestion, incidentReports, resourceSuggestion, alerts, resultTimestamps]);
  const { toast } = useToast();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([20.006, 73.792]);
  
  const analysisIntervals = React.useRef<{[key: string]: NodeJS.Timeout}>({});

  React.useEffect(() => {
    setIsMounted(true);
    // Cleanup intervals on component unmount
    return () => {
      Object.values(analysisIntervals.current).forEach(clearInterval);
    };
  }, []);

  // Search functionality
  const handleSearchQuery = React.useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchModalOpen(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const results: any[] = [];

    // Search alerts
    alerts.forEach((alert) => {
      if (
        alert.title.toLowerCase().includes(queryLower) ||
        alert.message.toLowerCase().includes(queryLower) ||
        alert.location.toLowerCase().includes(queryLower)
      ) {
        results.push({
          id: alert.id,
          type: "alert",
          title: alert.title,
          description: alert.message,
          metadata: `Location: ${alert.location} | ${alert.timestamp}`,
          severity: alert.severity,
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    });

    // Search routes
    if (routeSuggestion) {
      if (
        routeSuggestion.recommendationReasoning?.toLowerCase().includes(queryLower) ||
        routeSuggestion.recommendedRoutes?.some((r) =>
          r.name?.toLowerCase().includes(queryLower)
        )
      ) {
        results.push({
          id: `route-${Date.now()}`,
          type: "route",
          title: "Evacuation Route",
          description: routeSuggestion.recommendationReasoning || "Route recommendation",
          metadata: `Safe Routes: ${routeSuggestion.recommendedRoutes?.length || 0}`,
          icon: <Route className="h-4 w-4" />,
        });
      }
    }

    // Search reports
    incidentReports.forEach((report) => {
      if (
        report.summary.toLowerCase().includes(queryLower) ||
        report.location?.toLowerCase().includes(queryLower)
      ) {
        results.push({
          id: report.reportId,
          type: "report",
          title: `Incident Report - ${report.location}`,
          description: report.summary,
          metadata: `Priority: ${report.priority} | ${report.timestamp}`,
          icon: <FileTextIcon className="h-4 w-4" />,
        });
      }
    });

    // Search resources
    if (resourceSuggestion) {
      const allResources = [...(resourceSuggestion.security || []), ...(resourceSuggestion.medical || [])];
      if (
        resourceSuggestion.reasoning?.toLowerCase().includes(queryLower) ||
        allResources.some((r) =>
          r.toLowerCase().includes(queryLower)
        )
      ) {
        results.push({
          id: `resource-${Date.now()}`,
          type: "resource",
          title: "Resource Allocation",
          description: resourceSuggestion.reasoning || "Resource recommendation",
          metadata: `Resources: Security (${resourceSuggestion.security?.length || 0}), Medical (${resourceSuggestion.medical?.length || 0})`,
          icon: <Package className="h-4 w-4" />,
        });
      }
    }

    setSearchResults(results);
    setIsSearchModalOpen(results.length > 0);
  }, [alerts, routeSuggestion, incidentReports, resourceSuggestion]);

  const handleClearSearch = React.useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchModalOpen(false);
  }, []);

  const routeForm = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
    defaultValues: { currentLocation: "Ram Ghat", destination: "Panchavati" },
  });

  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { postText: "" },
  });
  
  const playAnnouncement = async (text: string) => {
    try {
        const { success, error } = await generateAudioAction({ text });
        if (error) {
            toast({ variant: 'destructive', title: 'Audio Error', description: error });
            return;
        }
        if (success && audioRef.current) {
            audioRef.current.src = success.audioDataUri;
            audioRef.current.play();
        }
    } catch (e) {
        toast({ variant: 'destructive', title: 'Audio Error', description: "Failed to generate announcement." });
    }
  }

  const handleGeneratePredictiveAlert = async () => {
    const { success, error } = await generatePredictiveAlertsAction();
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
      const newAlert: Alert = {
        id: generateUniqueId(),
        type: 'predictive',
        title: success.alertType,
        message: success.alertMessage,
        location: success.location,
        severity: success.severity.toLowerCase() as Alert['severity'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAlerts(prev => [newAlert, ...prev]);
      setResultTimestamps(prev => ({ ...prev, alert: Date.now() }));
      toast({ title: 'New Predictive Alert', description: `Severity: ${success.severity} at ${success.location}` });

      if (newAlert.severity === 'critical') {
        playAnnouncement(`Critical Alert: ${newAlert.title}. ${newAlert.message}`);
      }
    }
  };

  const onSuggestRouteSubmit = async (values: z.infer<typeof routeSchema>) => {
    setIsSuggestingRoute(true);
    setRouteSuggestion(null);
    setEvacuationRoutes([]);
    const { success, error } = await suggestEvacuationRoutesAction(values);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
      setRouteSuggestion(success);
      setResultTimestamps(prev => ({ ...prev, route: Date.now() }));
      const allRoutes = [
        ...(success.recommendedRoutes || []).map((r: RouteDetail) => ({ ...r, type: 'safe' as const })),
        ...(success.congestedRoutes || []).map((r: RouteDetail) => ({ ...r, type: 'congested' as const })),
      ];
      setEvacuationRoutes(allRoutes);
    }
    setIsSuggestingRoute(false);
  };

  const analyzeVideoFrame = React.useCallback((gateId: string, location: string) => {
    const videoRef = videoRefs.current[gateId]?.current;
    if (!videoRef || videoRef.paused || videoRef.ended) {
        return;
    }
    
    const latLonStrings = location.split(',').map(s => s.trim());
    if (latLonStrings.length !== 2 || isNaN(parseFloat(latLonStrings[0])) || isNaN(parseFloat(latLonStrings[1]))) {
        // Silently return if location is invalid to prevent spamming toasts in auto-mode
        return;
    }
    const latLon: [number, number] = [parseFloat(latLonStrings[0]), parseFloat(latLonStrings[1])];

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
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
            const density = success.density as 'low' | 'medium' | 'high' | 'critical';
            const densityInfo = densityMap[density];

            setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: false, peopleCount: success.peopleCount, density: density } : g));
            
            const newHotspot: Hotspot = {
                id: `${gateId}-${Date.now()}`,
                name: `${gateId} - Analysis`,
                density: success.peopleCount,
                position: latLon,
                size: densityInfo.size,
                severity: densityInfo.severity,
            };
            
            setHotspots(prev => {
                const existingHotspotIndex = prev.findIndex(h => typeof h.id === 'string' && h.id.startsWith(gateId));
                if (existingHotspotIndex > -1) {
                    const updatedHotspots = [...prev];
                    updatedHotspots[existingHotspotIndex] = newHotspot;
                    return updatedHotspots;
                }
                return [...prev, newHotspot];
            });

            if (success.density === 'high' || success.density === 'critical') {
                const newAlert: Alert = {
                    id: generateUniqueId(),
                    type: 'predictive',
                    title: `High Crowd Density at ${gateId}`,
                    message: `Detected ${success.peopleCount} people. Density is ${success.density}. Proactive measures required.`,
                    location: gateId,
                    severity: success.density as 'high' | 'critical',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setAlerts(prev => [newAlert, ...prev]);
                setResultTimestamps(prev => ({ ...prev, alert: Date.now() }));

                if (newAlert.severity === 'critical') {
                    playAnnouncement(`Critical Alert: ${newAlert.title}. ${newAlert.message}`);
                }
            }
        }
    });
  }, [toast]);

  const toggleAutoAnalysis = (gateId: string, location: string, shouldAutoAnalyze: boolean) => {
    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isAutoAnalyzing: shouldAutoAnalyze } : g));

    if (shouldAutoAnalyze) {
        if (analysisIntervals.current[gateId]) {
            clearInterval(analysisIntervals.current[gateId]);
        }
        analysisIntervals.current[gateId] = setInterval(() => {
            analyzeVideoFrame(gateId, location);
        }, 30000); // Analyze every 30 seconds to respect API quota
    } else {
        if (analysisIntervals.current[gateId]) {
            clearInterval(analysisIntervals.current[gateId]);
            delete analysisIntervals.current[gateId];
        }
        // Set loading to false when toggled off
        setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, isLoading: false } : g));
    }
  };


  const handleVideoSourceChange = (gateId: string, source: string, type: 'file' | 'url') => {
    setGateAnalyses(prev => prev.map(g => g.gateId === gateId ? { ...g, videoSrc: source } : g));
  };
  
  const handleLocationChange = (gateId: string, newLocation: string) => {
    setGateAnalyses(prev =>
      prev.map(g => (g.gateId === gateId ? { ...g, location: newLocation } : g))
    );
  };

  const handleGenerateReport = async (alert: Alert) => {
    setIsGenerationModalOpen(true);
    const { success, error } = await generateIncidentReportAction({ alert });
    
    // The modal will close itself after its animation, but we need to wait for the data
    if (error) {
        toast({ variant: 'destructive', title: 'Report Generation Error', description: error });
        setIsGenerationModalOpen(false);
    }
    if (success) {
        setIncidentReports(prev => [success, ...prev]);
        setResultTimestamps(prev => ({ ...prev, report: Date.now() }));
        // We let the modal finish its animation before showing the toast
        setTimeout(() => {
            toast({ title: 'Incident Report Generated', description: `Report ID: ${success.reportId}` });
        }, 3000);
    }
  }

  const onAnalyzeSocialMediaSubmit = async (values: z.infer<typeof socialMediaSchema>) => {
    setIsAnalyzingSocialMedia(true);
    setSocialMediaAnalysis(null);
    const { success, error } = await analyzeSocialMediaAction(values);

    if(error){
        toast({ variant: 'destructive', title: 'Analysis Error', description: error });
    }
    if(success){
        setSocialMediaAnalysis(success);
        toast({ title: 'Social Media Post Analyzed', description: `Issue Detected: ${success.issueDetected ? 'Yes' : 'No'}` });
        
        if (success.issueDetected) {
            const newAlert: Alert = {
                id: generateUniqueId(),
                type: 'social',
                title: success.issueType,
                message: `Social media post flagged: "${values.postText.substring(0, 50)}..."`,
                location: success.location || "Unknown",
                severity: success.severity,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setAlerts(prev => [newAlert, ...prev]);
            setResultTimestamps(prev => ({ ...prev, alert: Date.now() }));

            if (newAlert.severity === 'critical') {
                playAnnouncement(`Critical Alert from Social Media: ${newAlert.title}. ${newAlert.message}`);
            }
        }
    }
    setIsAnalyzingSocialMedia(false);
  };

  const handleSuggestResources = async () => {
    setIsSuggestingResources(true);
    setResourceSuggestion(null);
    const { success, error } = await suggestResourceAllocationAction({ hotspots });
    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
        setResourceSuggestion(success);
        setResultTimestamps(prev => ({ ...prev, resource: Date.now() }));
        toast({ title: 'Resource Allocation Suggested', description: 'Optimal placements for teams calculated.' });
    }
    setIsSuggestingResources(false);
  }
  
  const toggleServiceVisibility = (type: EmergencyService['type']) => {
    setVisibleServices(prev => {
        const isVisible = prev.some(s => s.type === type);
        if (isVisible) {
            return prev.filter(s => s.type !== type);
        } else {
            const servicesToAdd = emergencyServicesData.filter(s => s.type === type);
            return [...prev, ...servicesToAdd];
        }
    });
  }

  const isServiceVisible = (type: EmergencyService['type']) => {
    return visibleServices.some(s => s.type === type);
  }
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;

    if (!query) return;

    const allLocations = [
        ...hotspots.map(h => ({name: h.name, position: h.position})),
        ...gateAnalyses.map(g => {
            const [lat, lon] = g.location.split(',').map(s => parseFloat(s.trim()));
            return {name: g.gateId, position: [lat, lon] as [number, number]};
        })
    ];

    const found = allLocations.find(loc => loc.name.toLowerCase().includes(query.toLowerCase()));

    if (found && found.position[0] && found.position[1]) {
        setMapCenter(found.position);
        toast({ title: 'Location Found', description: `Moving map to ${found.name}` });
    } else {
        toast({ variant: 'destructive', title: 'Not Found', description: `Could not find location: ${query}` });
    }
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical');


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <audio ref={audioRef} className="sr-only" />
      
      {/* Search Bar */}
      <DashboardSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchQuery}
        onClearSearch={handleClearSearch}
        isSearching={isSearchModalOpen}
      />
      
      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        query={searchQuery}
        results={searchResults}
      />
      
      {criticalAlerts.length > 0 && (
        <div className="relative flex h-10 w-full shrink-0 overflow-hidden rounded-lg bg-gray-900">
          <div className="absolute inset-0 flex items-center animate-marquee whitespace-nowrap">
            {Array.from({ length: 3 }).map((_, i) =>
              criticalAlerts.map((alert, alertIndex) => (
                <span key={`${alert.id}-${i}-${alertIndex}`} className={cn("mx-4 text-sm font-medium", marqueeAlertColors[alert.severity])}>
                  <Siren className="inline-block h-4 w-4 mr-2" /> {alert.title}: {alert.message} at {alert.location}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="lg:col-span-3 rounded-3xl border border-border/20 bg-card/95 p-6 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Latest result</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{latestDashboardResult.title}</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {latestDashboardResult.badge}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{latestDashboardResult.details}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <HeatmapSection 
          className="lg:col-span-2 row-span-2"
          mapCenter={mapCenter}
          hotspots={hotspots}
          evacuationRoutes={evacuationRoutes}
          visibleServices={visibleServices}
        />

        <AlertsSection 
          alerts={alerts}
          onGeneratePredictiveAlert={handleGeneratePredictiveAlert}
          onPlayAnnouncement={playAnnouncement}
          onGenerateReport={handleGenerateReport}
          isGeneratingReport={isGeneratingReport}
          alertIcons={alertIcons}
          alertColors={alertColors}
        />

        <ReportsSection 
          incidentReports={incidentReports}
        />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <VideoAnalysisSection 
          className="xl:col-span-2"
          gateAnalyses={gateAnalyses}
          videoRefs={videoRefs}
          onVideoSourceChange={handleVideoSourceChange}
          onLocationChange={handleLocationChange}
          onAnalyzeFrame={analyzeVideoFrame}
          onToggleAutoAnalysis={toggleAutoAnalysis}
        />

        <EvacuationSection 
          form={routeForm}
          onSuggestRouteSubmit={onSuggestRouteSubmit}
          isSuggestingRoute={isSuggestingRoute}
          routeSuggestion={routeSuggestion}
        />

        <TrendAnalysisSection 
          trendData={trendData}
        />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <SocialMonitoringSection 
          form={socialMediaForm}
          onAnalyzeSocialMediaSubmit={onAnalyzeSocialMediaSubmit}
          isAnalyzingSocialMedia={isAnalyzingSocialMedia}
          socialMediaAnalysis={socialMediaAnalysis}
        />

        <ResourceAllocationSection 
          onSuggestResources={handleSuggestResources}
          isSuggestingResources={isSuggestingResources}
          resourceSuggestion={resourceSuggestion}
        />

        <EmergencyServicesSection 
          onToggleServiceVisibility={toggleServiceVisibility}
          isServiceVisible={isServiceVisible}
        />
      </div>

      <ReportGenerationModal 
        isOpen={isGenerationModalOpen} 
        onClose={() => setIsGenerationModalOpen(false)} 
      />
    </div>
  );
}
