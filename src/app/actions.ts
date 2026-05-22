
"use server";

import { analyzeCrowd } from "@/ai/flows/analyze-crowd";
import { generatePredictiveAlerts } from "@/ai/flows/generate-predictive-alerts";
import { suggestEvacuationRoutes } from "@/ai/flows/suggest-evacuation-routes";
import { generateIncidentReport } from "@/ai/flows/generate-incident-report";
import { analyzeSocialMediaPost } from "@/ai/flows/analyze-social-media";
import { suggestResourceAllocation } from "@/ai/flows/suggest-resource-allocation";
import { generateAudioAnnouncement } from "@/ai/flows/generate-audio-announcement";
import { generateRouteVisualization } from "@/ai/flows/generate-route-visualization";
import type { Alert, Hotspot } from "@/lib/types";

import { z } from "zod";

function formatAiError(error: unknown, fallbackMessage: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes("429") || normalizedMessage.includes("too many requests") || normalizedMessage.includes("quota")) {
    return "AI API quota reached (429). Update GEMINI_API_KEY with an active key or try again later.";
  }

  if (
    normalizedMessage.includes("api key") ||
    normalizedMessage.includes("permission denied") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("403")
  ) {
    return "Gemini API key is missing or invalid. Check GEMINI_API_KEY in .env.";
  }

  if (normalizedMessage.includes("model") && (normalizedMessage.includes("not found") || normalizedMessage.includes("unsupported"))) {
    return "Configured model is unavailable for this key. Keep model as googleai/gemini-2.5-flash and enable access for Gemini 2.5 Flash in your Google AI project.";
  }

  if (normalizedMessage.includes("503") || normalizedMessage.includes("service unavailable") || normalizedMessage.includes("high demand")) {
    return "The AI model is currently experiencing high demand (503). Please wait a few seconds and try again.";
  }

  return fallbackMessage;
}


const routeSchema = z.object({
  currentLocation: z.string().min(3, { message: "Location is required" }),
  destination: z.string().min(3, { message: "Destination is required" }),
});

export async function suggestEvacuationRoutesAction(values: z.infer<typeof routeSchema>) {
  const validatedFields = routeSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  const { currentLocation, destination } = validatedFields.data;

  try {
    const routeResult = await suggestEvacuationRoutes({
      currentLocation,
      destination,
    });
    
    return { success: routeResult };
  } catch (error) {
    console.error(error);
    return { error: formatAiError(error, "Failed to generate routes. Please try again.") };
  }
}

export async function generatePredictiveAlertsAction() {
  // Mock data for hackathon demo
  const historicalData = JSON.stringify({
    "10:00": { density: 520, checkpoint: "Checkpoint 3" },
    "11:00": { density: 650, checkpoint: "Checkpoint 3" },
  });
  const realtimeData = JSON.stringify({
    "12:00": { density: 810, checkpoint: "Checkpoint 3" },
  });
  const sensorData = JSON.stringify({
    temperature: 32,
    humidity: 75,
    air_quality: "moderate",
  });
  const thresholds = JSON.stringify({
    high_density: 750,
    critical_density: 900,
  });

  try {
    const result = await generatePredictiveAlerts({
      historicalData,
      realtimeData,
      sensorData,
      thresholds,
    });
    return { success: result };
  } catch (error) {
    console.error(error);
    return { error: formatAiError(error, "Failed to generate predictive alert.") };
  }
}

const crowdAnalysisSchema = z.object({
  checkpointId: z.string(),
  photoDataUri: z.string(),
});

export async function analyzeCrowdAction(values: z.infer<typeof crowdAnalysisSchema>) {
    const validatedFields = crowdAnalysisSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }
    const { photoDataUri } = validatedFields.data;
    try {
        const result = await analyzeCrowd({ photoDataUri });
        return { success: result };
    } catch (error) {
      console.error(error);
      return { error: formatAiError(error, 'Failed to analyze crowd. Please try again.') };
    }
}

const generateReportSchema = z.object({
  alert: z.any(),
});

export async function generateIncidentReportAction(values: z.infer<typeof generateReportSchema>) {
    const validatedFields = generateReportSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }
    const { alert } = validatedFields.data;
    try {
        const result = await generateIncidentReport({ alert });
        return { success: result };
    } catch (error) {
      console.error(error);
      return { error: formatAiError(error, 'Failed to generate incident report. Please try again.') };
    }
}

const analyzeSocialMediaSchema = z.object({
  postText: z.string().min(10, { message: "Post text must be at least 10 characters." }),
});

export async function analyzeSocialMediaAction(values: z.infer<typeof analyzeSocialMediaSchema>) {
    const validatedFields = analyzeSocialMediaSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }
    const { postText } = validatedFields.data;
    try {
        const result = await analyzeSocialMediaPost({ postText });
        return { success: result };
    } catch (error) {
      console.error(error);
      return { error: formatAiError(error, 'Failed to analyze post. Please try again.') };
    }
}

const suggestResourceAllocationSchema = z.object({
    hotspots: z.any(),
});

export async function suggestResourceAllocationAction(values: z.infer<typeof suggestResourceAllocationSchema>) {
    const validatedFields = suggestResourceAllocationSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }
    const { hotspots } = validatedFields.data;
    const hotspotsJson = JSON.stringify(hotspots);
    try {
        const result = await suggestResourceAllocation({ hotspots: hotspotsJson });
        return { success: result };
    } catch (error) {
      console.error(error);
      return { error: formatAiError(error, 'Failed to suggest resource allocation. Please try again.') };
    }
}

const generateAudioSchema = z.object({
  text: z.string(),
});

export async function generateAudioAction(values: z.infer<typeof generateAudioSchema>) {
    const validatedFields = generateAudioSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }
    const { text } = validatedFields.data;
    try {
        const result = await generateAudioAnnouncement({ text });
        return { success: result };
    } catch (error) {
      console.error(error);
      return { error: formatAiError(error, 'Failed to generate audio. Please try again.') };
    }
}
