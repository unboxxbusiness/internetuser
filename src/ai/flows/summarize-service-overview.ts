'use server';
/**
 * @fileOverview Summarizes key service metrics and prioritizes at-risk users for payment reminders.
 *
 * - summarizeServiceOverview - A function that summarizes service overview data and prioritizes payment reminders.
 * - SummarizeServiceOverviewInput - The input type for the summarizeServiceOverview function.
 * - SummarizeServiceOverviewOutput - The return type for the summarizeServiceOverview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeServiceOverviewInputSchema = z.object({
  activeSubscriptions: z
    .number()
    .describe('The number of active subscriptions.'),
  pendingPayments: z.number().describe('The total amount of pending payments.'),
  serviceUtilization: z
    .number()
    .describe('The overall service utilization percentage.'),
  usersAtRisk: z
    .array(z.object({userId: z.string(), overdueBalance: z.number()}))
    .describe('List of users at risk of non-payment.'),
});
export type SummarizeServiceOverviewInput = z.infer<
  typeof SummarizeServiceOverviewInputSchema
>;

const SummarizeServiceOverviewOutputSchema = z.object({
  summary: z.string().describe('A summary of the service overview metrics.'),
  priorityUsersForReminder: z
    .array(z.string())
    .describe('A list of user IDs to prioritize for payment reminders.'),
});
export type SummarizeServiceOverviewOutput = z.infer<
  typeof SummarizeServiceOverviewOutputSchema
>;

export async function summarizeServiceOverview(
  input: SummarizeServiceOverviewInput
): Promise<SummarizeServiceOverviewOutput> {
  return summarizeServiceOverviewFlow(input);
}

const summarizeServiceOverviewPrompt = ai.definePrompt({
  name: 'summarizeServiceOverviewPrompt',
  input: {schema: SummarizeServiceOverviewInputSchema},
  output: {schema: SummarizeServiceOverviewOutputSchema},
  prompt: `You are a network service administrator. Summarize the key metrics of the service overview dashboard, including active subscriptions ({{{activeSubscriptions}}}), pending payments ({{{pendingPayments}}}), and service utilization ({{{serviceUtilization}}}). Also, prioritize a list of user IDs ({{{usersAtRisk}}}) for payment reminders based on their overdue balance. Return a summary of the service performance and a list of user IDs to prioritize for payment reminders.

Summary:
Priority Users:
`,
});

const summarizeServiceOverviewFlow = ai.defineFlow(
  {
    name: 'summarizeServiceOverviewFlow',
    inputSchema: SummarizeServiceOverviewInputSchema,
    outputSchema: SummarizeServiceOverviewOutputSchema,
  },
  async input => {
    const {output} = await summarizeServiceOverviewPrompt(input);
    return output!;
  }
);
