'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { recommendPlan } from '@/ai/flows/plan-recommender';
import type { RecommendPlanOutput } from '@/ai/flows/plan-recommender';
import type { Customer, Plan } from '@/lib/types';
import { Bot, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PlanRecommenderProps {
  customer: Customer;
  availablePlans: Plan[];
}

export function PlanRecommender({ customer, availablePlans }: PlanRecommenderProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRecommendation = async () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await recommendPlan({
        usageHistory: customer.usageHistory,
        typicalUseCases: customer.typicalUseCases,
        availablePlans: availablePlans.map(p => ({
          planName: p.planName,
          bandwidth: p.bandwidth,
          cost: p.cost,
          description: p.description
        }))
      });
      setRecommendation(result);
    } catch (e) {
      setError('Failed to get recommendation. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const recommendedPlanDetails = recommendation ? availablePlans.find(p => p.planName === recommendation.recommendedPlan) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Bot className="h-4 w-4" />
          Suggest a Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Plan Recommender</DialogTitle>
          <DialogDescription>
            Get an AI-powered plan suggestion based on customer's usage.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recommendation ? (
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>{recommendation.recommendedPlan}</AlertTitle>
              <AlertDescription>
                <p className="mb-2">{recommendation.reason}</p>
                {recommendedPlanDetails && (
                  <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    <p><strong>Bandwidth:</strong> {recommendedPlanDetails.bandwidth}</p>
                    <p><strong>Cost:</strong> ${recommendedPlanDetails.cost.toFixed(2)}/mo</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              Click the button below to generate a plan recommendation.
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive mt-2 text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={getRecommendation} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Get Recommendation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
