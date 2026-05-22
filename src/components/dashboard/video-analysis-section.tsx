
"use client";

import React from "react";
import { Camera, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface GateAnalysis {
  gateId: string;
  location: string;
  videoSrc?: string;
  peopleCount?: number;
  density?: 'low' | 'medium' | 'high' | 'critical';
  isLoading: boolean;
  isAutoAnalyzing: boolean;
}

interface VideoAnalysisSectionProps {
  gateAnalyses: GateAnalysis[];
  videoRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLVideoElement>>>;
  onVideoSourceChange: (gateId: string, source: string, type: 'file' | 'url') => void;
  onLocationChange: (gateId: string, newLocation: string) => void;
  onAnalyzeFrame: (gateId: string, location: string) => void;
  onToggleAutoAnalysis: (gateId: string, location: string, checked: boolean) => void;
  className?: string;
}


export function VideoAnalysisSection({
  gateAnalyses,
  videoRefs,
  onVideoSourceChange,
  onLocationChange,
  onAnalyzeFrame,
  onToggleAutoAnalysis,
  className
}: VideoAnalysisSectionProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Tactical Video Intelligence
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Multi-Source AI Crowd Monitoring
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            STREAMS ONLINE
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gateAnalyses.map((gate) => (
            <div key={gate.gateId} className="group relative rounded-2xl border bg-background/50 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video relative bg-slate-950 overflow-hidden">
                <video
                  ref={videoRefs.current[gate.gateId]}
                  src={gate.videoSrc || undefined}
                  autoPlay
                  controls
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-primary/5 transition-all duration-500" />
                
                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-tighter border border-white/10">
                    {gate.gateId}
                  </div>
                  {gate.isAutoAnalyzing && (
                    <div className="bg-red-600 px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-tighter animate-pulse shadow-lg">
                      REC // AI ACTIVE
                    </div>
                  )}
                </div>

                {!gate.videoSrc && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500 space-y-3 bg-slate-950">
                    <Camera className="h-10 w-10 opacity-20" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-40">No Signal Input</p>
                      <p className="text-[10px] opacity-30">Waiting for source link or file upload...</p>
                    </div>
                  </div>
                )}
                
                {gate.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Processing Frames...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1.5 flex-1">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Signal Source</Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="IP Camera / URL"
                          onChange={(e) => onVideoSourceChange(gate.gateId, e.target.value, 'url')}
                          className="h-9 text-xs bg-muted/30 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40 flex-1"
                          disabled={gate.isAutoAnalyzing}
                        />
                        <div className="relative">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                onVideoSourceChange(gate.gateId, url, 'file');
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-9"
                            disabled={gate.isAutoAnalyzing}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 bg-muted/30 border-none rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Geofence (Lat/Lon)</Label>
                      <Input 
                        type="text"
                        placeholder="20.0, 73.0"
                        value={gate.location}
                        onChange={(e) => onLocationChange(gate.gateId, e.target.value)}
                        disabled={gate.isLoading || gate.isAutoAnalyzing}
                        className="h-9 text-xs bg-muted/30 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dashed">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`auto-analyze-${gate.gateId}`}
                        checked={gate.isAutoAnalyzing}
                        onCheckedChange={(checked) => onToggleAutoAnalysis(gate.gateId, gate.location, checked)}
                        disabled={!gate.videoSrc}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor={`auto-analyze-${gate.gateId}`} className="text-[10px] font-black uppercase tracking-widest">Auto AI</Label>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAnalyzeFrame(gate.gateId, gate.location)}
                      disabled={gate.isLoading || !gate.videoSrc || gate.isAutoAnalyzing}
                      className="h-9 px-4 text-xs font-bold uppercase rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      {gate.isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Search className="mr-2 h-3.5 w-3.5" />}
                      Manual Scan
                    </Button>
                  </div>

                  {gate.peopleCount !== undefined && (
                    <div className="flex gap-4 items-center bg-slate-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5 shadow-2xl">
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-0.5">Live Count</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{gate.peopleCount}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Units</span>
                        </div>
                      </div>
                      
                      <div className="h-10 w-[1px] bg-white/10" />
                      
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-0.5">Tactical Risk</span>
                        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-lg border", {
                          'bg-green-500/10 text-green-500 border-green-500/20': gate.density === 'low',
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': gate.density === 'medium',
                          'bg-orange-500/10 text-orange-500 border-orange-500/20': gate.density === 'high',
                          'bg-red-500/10 text-red-500 border-red-500/20': gate.density === 'critical',
                        })}>
                          <span className={cn("h-2 w-2 rounded-full animate-pulse", {
                            'bg-green-500': gate.density === 'low',
                            'bg-yellow-500': gate.density === 'medium',
                            'bg-orange-500': gate.density === 'high',
                            'bg-red-500': gate.density === 'critical',
                          })} />
                          <span className="text-xs font-black uppercase tracking-widest">{gate.density}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
