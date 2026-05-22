
"use client";

import { SocialMonitoringSection } from "@/components/dashboard/social-monitoring-section";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { analyzeSocialMediaAction } from "@/app/actions";
import { SocialMediaAnalysis } from "@/lib/types";

const socialMediaSchema = z.object({
    postText: z.string().min(10, "Post must be at least 10 characters."),
});

export default function SocialMonitoringPage() {
  const [socialMediaAnalysis, setSocialMediaAnalysis] = React.useState<SocialMediaAnalysis | null>(null);
  const [isAnalyzingSocialMedia, setIsAnalyzingSocialMedia] = React.useState(false);
  const { toast } = useToast();

  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { postText: "" },
  });

  const onAnalyzeSocialMediaSubmit = async (values: z.infer<typeof socialMediaSchema>) => {
    setIsAnalyzingSocialMedia(true);
    setSocialMediaAnalysis(null);
    const { success, error } = await analyzeSocialMediaAction(values);
    if(error){
        toast({ variant: 'destructive', title: 'Analysis Error', description: error });
    }
    if(success){
        setSocialMediaAnalysis(success);
        toast({ title: 'Social Media Post Analyzed', description: `Issue Detected: ${success.issueDetected ? 'Yes' : 'No'}` });
    }
    setIsAnalyzingSocialMedia(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Monitoring</h1>
        <p className="text-muted-foreground">Monitor and analyze social media sentiment and reports from the field.</p>
      </div>

      <div className="max-w-2xl">
        <SocialMonitoringSection 
          form={socialMediaForm}
          onAnalyzeSocialMediaSubmit={onAnalyzeSocialMediaSubmit}
          isAnalyzingSocialMedia={isAnalyzingSocialMedia}
          socialMediaAnalysis={socialMediaAnalysis}
        />
      </div>
    </div>
  );
}
