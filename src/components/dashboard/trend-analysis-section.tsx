
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

interface TrendAnalysisSectionProps {
  trendData: any[];
  className?: string;
  h?: string;
}

export function TrendAnalysisSection({ trendData, className, h = "h-[200px]" }: TrendAnalysisSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription>Crowd density over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(h, "w-full")}>
          <ResponsiveContainer>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: "hsl(var(--primary) / 0.1)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              <Bar dataKey="density" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
