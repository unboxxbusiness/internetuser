
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { SubscriptionPlan } from "@/lib/types";

// Data consumption estimates in GB per hour
const DATA_RATES = {
  sdStreaming: 1,
  hdStreaming: 3,
  uhdStreaming: 7,
  gaming: 0.1,
  videoCalls: 0.7,
  music: 0.15,
};

export function DataUsageCalculator({ plans }: { plans: SubscriptionPlan[] }) {
  const [hours, setHours] = useState({
    sdStreaming: 20,
    hdStreaming: 10,
    uhdStreaming: 5,
    gaming: 10,
    videoCalls: 10,
    music: 20,
  });

  const handleSliderChange = (activity: keyof typeof hours, value: number[]) => {
    setHours((prev) => ({ ...prev, [activity]: value[0] }));
  };

  const totalUsage =
    hours.sdStreaming * DATA_RATES.sdStreaming +
    hours.hdStreaming * DATA_RATES.hdStreaming +
    hours.uhdStreaming * DATA_RATES.uhdStreaming +
    hours.gaming * DATA_RATES.gaming +
    hours.videoCalls * DATA_RATES.videoCalls +
    hours.music * DATA_RATES.music;

  const getRecommendedPlan = () => {
    if (!plans || plans.length === 0) return null;
    
    // Sort plans by data limit to find the best fit
    const sortedPlans = [...plans].sort((a, b) => a.dataLimit - b.dataLimit);

    // Find the smallest plan that fits the usage
    let recommended = sortedPlans.find(plan => plan.dataLimit >= totalUsage);
    
    // If no plan is big enough, recommend the largest one
    if (!recommended) {
        recommended = sortedPlans[sortedPlans.length - 1];
    }
    return recommended;
  };
  
  const recommendedPlan = getRecommendedPlan();

  return (
    <section className="py-16 md:py-24 bg-muted dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Not Sure Which Plan to Choose?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Use our calculator to estimate your monthly data needs.
          </p>
        </div>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 border-b md:border-b-0 md:border-r">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Estimate Your Monthly Usage</CardTitle>
                <CardDescription>Adjust the sliders based on your typical weekly activity.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid gap-2">
                  <Label>HD Video Streaming (hours/week)</Label>
                  <div className="flex items-center gap-4">
                    <Slider defaultValue={[10]} max={100} step={1} onValueChange={(v) => handleSliderChange('hdStreaming', v)} />
                    <span className="font-bold w-12 text-right">{hours.hdStreaming}h</span>
                  </div>
                </div>
                 <div className="grid gap-2">
                  <Label>Online Gaming (hours/week)</Label>
                   <div className="flex items-center gap-4">
                    <Slider defaultValue={[10]} max={100} step={1} onValueChange={(v) => handleSliderChange('gaming', v)}/>
                     <span className="font-bold w-12 text-right">{hours.gaming}h</span>
                  </div>
                </div>
                 <div className="grid gap-2">
                  <Label>Video Calls (hours/week)</Label>
                   <div className="flex items-center gap-4">
                    <Slider defaultValue={[10]} max={100} step={1} onValueChange={(v) => handleSliderChange('videoCalls', v)}/>
                     <span className="font-bold w-12 text-right">{hours.videoCalls}h</span>
                  </div>
                </div>
                 <div className="grid gap-2">
                  <Label>4K/UHD Streaming (hours/week)</Label>
                  <div className="flex items-center gap-4">
                    <Slider defaultValue={[5]} max={100} step={1} onValueChange={(v) => handleSliderChange('uhdStreaming', v)}/>
                    <span className="font-bold w-12 text-right">{hours.uhdStreaming}h</span>
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="p-8 bg-primary/5 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground font-semibold">Estimated Monthly Usage</p>
                <p className="text-6xl font-extrabold my-4">
                    {Math.round(totalUsage * 4)} <span className="text-3xl text-muted-foreground">GB</span>
                </p>
                 {recommendedPlan && (
                    <div className="mt-4">
                        <p className="text-muted-foreground">Our Recommendation:</p>
                        <Badge variant="secondary" className="text-lg mt-2 py-1 px-4">{recommendedPlan.name}</Badge>
                        <Button asChild className="mt-6 w-full" size="lg">
                            <a href="#plans">
                                <Zap className="mr-2 h-4 w-4" />
                                View Plans
                            </a>
                        </Button>
                    </div>
                )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
