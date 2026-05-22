
"use client";

import { ResourceAllocationSection } from "@/components/dashboard/resource-allocation-section";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { suggestResourceAllocationAction } from "@/app/actions";
import { ResourceSuggestion, Hotspot } from "@/lib/types";

const initialHotspots: Hotspot[] = [
    { id: 1, name: "Main Stage", density: 95, position: [20.006, 73.791], size: 500, severity: "critical" },
    { id: 2, name: "Food Court", density: 78, position: [20.009, 73.795], size: 350, severity: "high" },
    { id: 3, name: "Gate 3 Entrance", density: 85, position: [20.003, 73.788], size: 400, severity: "high" },
];

export default function ResourcesPage() {
  const [resourceSuggestion, setResourceSuggestion] = React.useState<ResourceSuggestion | null>(null);
  const [isSuggestingResources, setIsSuggestingResources] = React.useState(false);
  const { toast } = useToast();

  const handleSuggestResources = async () => {
    setIsSuggestingResources(true);
    setResourceSuggestion(null);
    const { success, error } = await suggestResourceAllocationAction({ hotspots: initialHotspots });
    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
        setResourceSuggestion(success);
        toast({ title: 'Resource Allocation Suggested', description: 'Optimal placements for teams calculated.' });
    }
    setIsSuggestingResources(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Resource Allocation</h1>
        <p className="text-muted-foreground">Optimize the placement of security and medical teams using AI insights.</p>
      </div>

      <div className="max-w-2xl">
        <ResourceAllocationSection 
          onSuggestResources={handleSuggestResources}
          isSuggestingResources={isSuggestingResources}
          resourceSuggestion={resourceSuggestion}
        />
      </div>
    </div>
  );
}
