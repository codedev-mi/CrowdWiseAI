'use server';
/**
 * @fileOverview An AI agent for analyzing crowd density in an image.
 *
 * - analyzeCrowd - A function that handles the crowd analysis process.
 * - AnalyzeCrowdInput - The input type for the analyzeCrowd function.
 * - AnalyzeCrowdOutput - The return type for the analyzeCrowd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {withRetry} from '@/ai/utils';

const AnalyzeCrowdInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crowd, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCrowdInput = z.infer<typeof AnalyzeCrowdInputSchema>;

const AnalyzeCrowdOutputSchema = z.object({
  peopleCount: z.number().describe('The estimated number of people in the image.'),
  density: z.enum(['low', 'medium', 'high', 'critical']).describe('The estimated crowd density.'),
});
export type AnalyzeCrowdOutput = z.infer<typeof AnalyzeCrowdOutputSchema>;

export async function analyzeCrowd(input: AnalyzeCrowdInput): Promise<AnalyzeCrowdOutput> {
  return analyzeCrowdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCrowdPrompt',
  input: {schema: AnalyzeCrowdInputSchema},
  output: {schema: AnalyzeCrowdOutputSchema},
  prompt: `You are a high-precision tactical AI specialized in crowd monitoring for security and safety. 
Your task is to analyze the provided image and perform a detailed count of every person visible.

Counting Instructions:
1.  **Count every individual**: Include people in the foreground, background, and those partially obscured.
2.  **Accuracy is critical**: Provide your best numerical estimate of the total head count.
3.  **Density Classification**: Based on the total count, classify the density:
    - low: 1-20 people (Manageable)
    - medium: 21-50 people (Monitor closely)
    - high: 51-100 people (Crowded / Action required)
    - critical: 101+ people (Dangerous / Emergency level)

Return the results in the required JSON schema.

Photo: {{media url=photoDataUri}}`,
});

const analyzeCrowdFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdFlow',
    inputSchema: AnalyzeCrowdInputSchema,
    outputSchema: AnalyzeCrowdOutputSchema,
  },
  async input => {
    const {output} = await withRetry(() => prompt(input));
    return output!;
  }
);
