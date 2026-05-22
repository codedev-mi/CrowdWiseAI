
"use client";

import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SocialMediaAnalysis } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";

interface SocialMonitoringSectionProps {
  form: UseFormReturn<any>;
  onAnalyzeSocialMediaSubmit: (values: any) => void;
  isAnalyzingSocialMedia: boolean;
  socialMediaAnalysis: SocialMediaAnalysis | null;
  className?: string;
}

export function SocialMonitoringSection({
  form,
  onAnalyzeSocialMediaSubmit,
  isAnalyzingSocialMedia,
  socialMediaAnalysis,
  className
}: SocialMonitoringSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Social Media Monitoring</CardTitle>
        <CardDescription>Analyze a simulated social media post for potential issues.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAnalyzeSocialMediaSubmit)} className="space-y-4">
            <FormField control={form.control} name="postText" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="e.g., It's getting really crowded near the main stage, can't move!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isAnalyzingSocialMedia} className="w-full">
              {isAnalyzingSocialMedia ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Analyze Post
            </Button>
          </form>
        </Form>
        {socialMediaAnalysis && (
          <Card className="bg-background/70 mt-4">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 p-4 pt-0">
              <p>Issue Detected: <span className="font-bold">{socialMediaAnalysis.issueDetected ? 'Yes' : 'No'}</span></p>
              {socialMediaAnalysis.issueDetected && <>
                <p>Issue Type: <span className="font-bold">{socialMediaAnalysis.issueType}</span></p>
                <p>Location: <span className="font-bold">{socialMediaAnalysis.location || 'N/A'}</span></p>
                <p>Severity: <span className="font-bold capitalize">{socialMediaAnalysis.severity}</span></p>
              </>}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
