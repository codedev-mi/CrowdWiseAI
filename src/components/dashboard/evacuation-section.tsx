
"use client";

import { Route, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteSuggestion } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface EvacuationSectionProps {
  form: UseFormReturn<any>;
  onSuggestRouteSubmit: (values: any) => void;
  isSuggestingRoute: boolean;
  routeSuggestion: RouteSuggestion | null;
  className?: string;
  h?: string;
}


export function EvacuationSection({
  form,
  onSuggestRouteSubmit,
  isSuggestingRoute,
  routeSuggestion,
  className,
  h = "h-[20vh]"
}: EvacuationSectionProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Evacuation Logic Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSuggestRouteSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="currentLocation" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Sector</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ram Ghat" {...field} className="bg-muted/30 border-none h-10 rounded-xl" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Safe Extraction Point</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Panchavati" {...field} className="bg-muted/30 border-none h-10 rounded-xl" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
            <Button type="submit" disabled={isSuggestingRoute} className="w-full h-11 font-bold shadow-lg shadow-primary/20">
              {isSuggestingRoute ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Route className="mr-2 h-5 w-5" />}
              Execute Route Calculation
            </Button>
          </form>
        </Form>
        
        {routeSuggestion && (
          <div className="mt-8 space-y-4 pt-6 border-t border-dashed">
            <div className="flex items-center gap-3">
               <div className="h-8 w-1 bg-primary rounded-full" />
               <h4 className="font-bold text-sm uppercase tracking-tight">AI Strategy Recommendations:</h4>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border border-muted text-xs leading-relaxed italic text-muted-foreground">
              "{routeSuggestion.recommendationReasoning}"
            </div>
            <ScrollArea className={h}>
              <ul className="space-y-3 pr-4">
                {routeSuggestion.recommendedRoutes.map((route, i) => (
                  <li key={route.name} className="group bg-background rounded-xl border p-3 flex items-center justify-between hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{route.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Verified Extraction Path</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-black text-primary">{route.travelTime}</span>
                       <p className="text-[8px] font-bold text-muted-foreground uppercase">Est. Time</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
