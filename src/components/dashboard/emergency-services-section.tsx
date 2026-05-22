
"use client";

import { HeartPulse, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmergencyService } from "@/lib/types";

interface EmergencyServicesSectionProps {
  onToggleServiceVisibility: (type: EmergencyService['type']) => void;
  isServiceVisible: (type: EmergencyService['type']) => boolean;
  className?: string;
}

export function EmergencyServicesSection({
  onToggleServiceVisibility,
  isServiceVisible,
  className
}: EmergencyServicesSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Emergency Services</CardTitle>
        <CardDescription>Toggle visibility of emergency services on the map.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button onClick={() => onToggleServiceVisibility('hospital')} variant={isServiceVisible('hospital') ? 'secondary' : 'outline'} className="justify-start">
          <HeartPulse className="mr-2 h-4 w-4" /> Hospitals
        </Button>
        <Button onClick={() => onToggleServiceVisibility('police')} variant={isServiceVisible('police') ? 'secondary' : 'outline'} className="justify-start">
          <Shield className="mr-2 h-4 w-4" /> Police
        </Button>
        <Button onClick={() => onToggleServiceVisibility('fire')} variant={isServiceVisible('fire') ? 'secondary' : 'outline'} className="justify-start">
          <Flame className="mr-2 h-4 w-4" /> Fire Stations
        </Button>
      </CardContent>
    </Card>
  );
}
