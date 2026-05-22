"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, RouteSuggestion, IncidentReport, ResourceSuggestion } from "@/lib/types";
import { AlertCircle, Route, FileText, Package } from "lucide-react";

interface SearchResult {
  type: "alert" | "route" | "report" | "resource";
  id: string;
  title: string;
  description: string;
  metadata?: string;
  severity?: string;
  icon: React.ReactNode;
}

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  results: SearchResult[];
  isLoading?: boolean;
}

export function SearchResultsModal({
  isOpen,
  onClose,
  query,
  results,
  isLoading = false,
}: SearchResultsModalProps) {
  const resultsByType = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const typeLabels: Record<string, string> = {
    alert: "Alerts",
    route: "Evacuation Routes",
    report: "Reports",
    resource: "Resource Allocations",
  };

  const typeColors: Record<string, string> = {
    alert: "bg-red-500/10 text-red-700",
    route: "bg-blue-500/10 text-blue-700",
    report: "bg-purple-500/10 text-purple-700",
    resource: "bg-green-500/10 text-green-700",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Search Results for "{query}"</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No results found for "{query}"</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(resultsByType).map(([type, typeResults]) => (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {typeLabels[type]} ({typeResults.length})
                  </h3>
                  <div className="space-y-2">
                    {typeResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">{result.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm text-foreground">
                                {result.title}
                              </p>
                              {result.severity && (
                                <Badge variant="outline" className={typeColors[type]}>
                                  {result.severity}
                                </Badge>
                              )}
                              <Badge variant="outline" className={typeColors[type]}>
                                {typeLabels[type]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {result.description}
                            </p>
                            {result.metadata && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {result.metadata}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
