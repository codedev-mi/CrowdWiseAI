
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Hotspot, EvacuationRoute, EmergencyService } from "@/lib/types";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";

const Heatmap = dynamic(() => import('@/components/heatmap').then(mod => mod.Heatmap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

interface HeatmapSectionProps {
  mapCenter: [number, number];
  hotspots: Hotspot[];
  evacuationRoutes: EvacuationRoute[];
  visibleServices: EmergencyService[];
  className?: string;
  h?: string;
}


export function HeatmapSection({ mapCenter, hotspots, evacuationRoutes, visibleServices, className, h = "h-[60vh]" }: HeatmapSectionProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Tactical Situation Map
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
              <span className="h-2 w-2 rounded-full bg-orange-500" /> High
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Normal
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("p-0 relative", h)}>
        <Heatmap 
          center={mapCenter} 
          hotspots={hotspots} 
          evacuationRoutes={evacuationRoutes} 
          emergencyServices={visibleServices} 
        />
        <div className="absolute bottom-4 right-4 z-[1000] bg-background/80 backdrop-blur-md p-3 rounded-lg border shadow-xl text-[10px] font-bold uppercase tracking-widest pointer-events-none">
          Live Satellite Feed Active
        </div>
      </CardContent>
    </Card>
  );
}
