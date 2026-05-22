
"use client";

import { HeatmapSection } from "@/components/dashboard/heatmap-section";
import { EmergencyServicesSection } from "@/components/dashboard/emergency-services-section";
import { Hotspot, EvacuationRoute, EmergencyService } from "@/lib/types";
import * as React from "react";

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

export default function HeatmapPage() {
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([20.006, 73.792]);
  const [hotspots, setHotspots] = React.useState<Hotspot[]>(initialHotspots);
  const [evacuationRoutes, setEvacuationRoutes] = React.useState<EvacuationRoute[]>([]);
  const [visibleServices, setVisibleServices] = React.useState<EmergencyService[]>([]);

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Live Crowd Heatmap</h1>
        <p className="text-muted-foreground">Monitor real-time crowd density and emergency services across the event area.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <HeatmapSection 
          className="md:col-span-3 lg:col-span-3"
          mapCenter={mapCenter}
          hotspots={hotspots}
          evacuationRoutes={evacuationRoutes}
          visibleServices={visibleServices}
          h="h-[75vh]"
        />
        <EmergencyServicesSection 
          onToggleServiceVisibility={toggleServiceVisibility}
          isServiceVisible={isServiceVisible}
        />
      </div>
    </div>
  );
}
