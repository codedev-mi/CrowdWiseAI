
import { GenerateResponse } from 'genkit';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      return await fn();
    } catch (error: any) {
      const is503 = error.status === 503 || error.message?.includes('503') || error.message?.includes('Service Unavailable');
      if (is503 && retries > 1) {
        retries--;
        console.warn(`AI model busy (503). Retrying in ${delayMs}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed after multiple retries');
}
