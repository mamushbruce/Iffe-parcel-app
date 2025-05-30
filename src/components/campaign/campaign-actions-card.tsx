
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, HeartHandshake } from 'lucide-react';

interface CampaignActionsCardProps {
  campaignTitle: string;
  currentAmount: number;
  goal: number;
  endDate: string;
  volunteersSignedUp: number;
  volunteersNeeded: number;
}

export default function CampaignActionsCard({
  campaignTitle,
  currentAmount,
  goal,
  endDate,
  volunteersSignedUp,
  volunteersNeeded,
}: CampaignActionsCardProps) {
  const { toast } = useToast();

  const progressPercentage = goal > 0 ? (currentAmount / goal) * 100 : 0;

  const handleDonate = () => {
    toast({
      title: "Donation Submitted (Simulated)",
      description: `Thank you for your interest in donating to "${campaignTitle}"! This feature is currently in development.`,
      variant: "default",
    });
  };

  const handleVolunteer = () => {
    toast({
      title: "Volunteer Sign-up (Simulated)",
      description: `Thank you for your interest in volunteering for "${campaignTitle}"! Your interest has been noted.`,
      variant: "default",
    });
  };

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Campaign Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary">${currentAmount.toLocaleString()}</span>
          <span className="text-muted-foreground">raised of ${goal.toLocaleString()} goal</span>
        </div>
        <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% funded`} />
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-accent" />
          <span>Ends: {new Date(endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-accent" />
          <span>{volunteersSignedUp} / {volunteersNeeded} Volunteers</span>
        </div>
        <Button 
          className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleDonate}
        >
          <HeartHandshake className="mr-2 h-5 w-5" /> Donate Now
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleVolunteer}
        >
          <Users className="mr-2 h-5 w-5" /> Volunteer
        </Button>
      </CardContent>
    </Card>
  );
}
