'use server';

/**
 * @fileOverview A plan recommendation AI agent.
 *
 * - recommendPlan - A function that handles the plan recommendation process.
 * - RecommendPlanInput - The input type for the recommendPlan function.
 * - RecommendPlanOutput - The return type for the recommendPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AvailablePlansSchema = z.array(
  z.object({
    planName: z.string().describe('The name of the plan.'),
    bandwidth: z.string().describe('The bandwidth offered by the plan.'),
    cost: z.number().describe('The monthly cost of the plan.'),
    description: z.string().describe('A description of the plan.'),
  })
);

const RecommendPlanInputSchema = z.object({
  usageHistory: z
    .string()
    .describe('The customer\'s usage history, including data consumption and typical online activities.'),
  typicalUseCases: z
    .string()
    .describe('The customer\'s typical use cases, such as streaming, gaming, or browsing.'),
  availablePlans: AvailablePlansSchema.describe('The available subscription plans.'),
});
export type RecommendPlanInput = z.infer<typeof RecommendPlanInputSchema>;

const RecommendPlanOutputSchema = z.object({
  recommendedPlan: z.string().describe('The name of the recommended plan.'),
  reason: z.string().describe('The reason for recommending this plan.'),
});
export type RecommendPlanOutput = z.infer<typeof RecommendPlanOutputSchema>;

export async function recommendPlan(input: RecommendPlanInput): Promise<RecommendPlanOutput> {
  return recommendPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPlanPrompt',
  input: {schema: RecommendPlanInputSchema},
  output: {schema: RecommendPlanOutputSchema},
  prompt: `You are an expert in recommending internet service plans based on customer needs.\n\nGiven the customer's usage history, typical use cases, and the available plans, recommend the most suitable plan for the customer.\n\nUsage History: {{{usageHistory}}}\nTypical Use Cases: {{{typicalUseCases}}}\nAvailable Plans: {{#each availablePlans}}\n- Plan Name: {{{this.planName}}}, Bandwidth: {{{this.bandwidth}}}, Cost: {{{this.cost}}}, Description: {{{this.description}}}{{#unless @last}}\n{{/unless}}{{#else}}{{/each}}\n\nBased on this information, which plan do you recommend and why?  Please output your answer as a JSON object.  The recommendedPlan field should be the planName of the plan that you are recommending.\n`,
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
