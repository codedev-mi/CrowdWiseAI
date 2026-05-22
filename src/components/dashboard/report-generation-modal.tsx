
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, FileText, Activity, Shield, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, label: "Analyzing Incident Context", icon: Activity },
  { id: 2, label: "Gathering Environmental Data", icon: AlertTriangle },
  { id: 3, label: "Formulating Strategic Actions", icon: Shield },
  { id: 4, label: "Finalizing Official Report", icon: FileText },
];

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGenerationModal({ isOpen, onClose }: ReportGenerationModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onClose, 1000);
            return 100;
          }
          const next = prev + (Math.random() * 15);
          
          return Math.min(next, 100);
        });
      }, 400);

      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
      setProgress(0);
    }
  }, [isOpen, onClose]);

  // Update step based on progress
  React.useEffect(() => {
    if (progress > 75) setCurrentStep(4);
    else if (progress > 50) setCurrentStep(3);
    else if (progress > 25) setCurrentStep(2);
    else if (progress > 0) setCurrentStep(1);
  }, [progress]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            AI Report Generation
          </DialogTitle>
          <DialogDescription>
            Our AI is processing the incident data to generate a comprehensive report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-4">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className={cn(
                  "flex items-center gap-3 transition-all duration-300",
                  isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted ? "border-primary bg-primary/10" : isCurrent ? "border-primary animate-pulse" : "border-muted"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent && "font-bold"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
