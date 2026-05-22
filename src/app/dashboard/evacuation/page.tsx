
"use client";

import { EvacuationSection } from "@/components/dashboard/evacuation-section";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { suggestEvacuationRoutesAction } from "@/app/actions";
import { RouteSuggestion } from "@/lib/types";

const routeSchema = z.object({
  currentLocation: z.string().min(3, "Current location is required."),
  destination: z.string().min(3, "Destination is required."),
});

export default function EvacuationPage() {
  const [routeSuggestion, setRouteSuggestion] = React.useState<RouteSuggestion | null>(null);
  const [isSuggestingRoute, setIsSuggestingRoute] = React.useState(false);
  const { toast } = useToast();

  const routeForm = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
    defaultValues: { currentLocation: "Ram Ghat", destination: "Panchavati" },
  });

  const onSuggestRouteSubmit = async (values: z.infer<typeof routeSchema>) => {
    setIsSuggestingRoute(true);
    setRouteSuggestion(null);
    const { success, error } = await suggestEvacuationRoutesAction(values);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error });
    }
    if (success) {
      setRouteSuggestion(success);
    }
    setIsSuggestingRoute(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Evacuation Suggestion</h1>
        <p className="text-muted-foreground">Get AI-powered evacuation route recommendations based on current crowd density.</p>
      </div>

      <div className="max-w-2xl">
        <EvacuationSection 
          form={routeForm}
          onSuggestRouteSubmit={onSuggestRouteSubmit}
          isSuggestingRoute={isSuggestingRoute}
          routeSuggestion={routeSuggestion}
          h="h-[40vh]"
        />
      </div>
    </div>
  );
}
