
"use client";

import { Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceSuggestion } from "@/lib/types";

interface ResourceAllocationSectionProps {
  onSuggestResources: () => void;
  isSuggestingResources: boolean;
  resourceSuggestion: ResourceSuggestion | null;
  className?: string;
}

export function ResourceAllocationSection({
  onSuggestResources,
  isSuggestingResources,
  resourceSuggestion,
  className
}: ResourceAllocationSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Resource Allocation</CardTitle>
        <CardDescription>Get AI-powered suggestions for security and medical team placements based on live hotspots.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onSuggestResources} className="w-full" disabled={isSuggestingResources}>
          {isSuggestingResources ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
          Suggest Resource Placements
        </Button>
        {resourceSuggestion && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Reasoning:</h4>
            <p className="text-xs text-muted-foreground mb-4">{resourceSuggestion.reasoning}</p>
            
            <h4 className="font-semibold text-sm mb-2">Security Teams</h4>
            <ul className="space-y-1 list-disc pl-5 text-sm mb-4">
              {resourceSuggestion.security.map((suggestion, i) => <li key={`sec-${i}`}>{suggestion}</li>)}
            </ul>
           
            <h4 className="font-semibold text-sm mb-2">Medical Teams</h4>
            <ul className="space-y-1 list-disc pl-5 text-sm">
              {resourceSuggestion.medical.map((suggestion, i) => <li key={`med-${i}`}>{suggestion}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
