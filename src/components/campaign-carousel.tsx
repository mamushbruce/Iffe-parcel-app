'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  shortDescription: string;
}

interface CampaignCarouselProps {
  campaigns: Campaign[];
}

const CampaignCarousel: React.FC<CampaignCarouselProps> = ({ campaigns }) => {
  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center text-muted-foreground">
          No featured tours at the moment.
        </CardContent>
      </Card>
    );
  }

  // To create a seamless infinite loop, we duplicate the list
  const fullSet = [...campaigns, ...campaigns];

  return (
    <div className="w-full space-y-6">
      <div className="px-2">
        <div>
            <h3 className="font-headline text-2xl font-bold text-primary">From the Lens</h3>
            <p className="text-sm text-muted-foreground">Visual highlights from our top destinations.</p>
        </div>
      </div>
      
      {/* Film Strip Container */}
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-stone-950">
        {/* Top Perforation Strip */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-stone-950 z-20 flex items-center justify-around overflow-hidden border-b border-white/5">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-stone-900 rounded-sm border border-stone-800 flex-shrink-0" />
            ))}
        </div>

        {/* Marquee Wrapper */}
        <div className="overflow-hidden p-6 pt-12 pb-12 relative">
          <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] w-max">
            {/* Render the double set for infinite effect */}
            <div className="flex gap-4 pr-4">
              {campaigns.map((campaign, idx) => (
                <div key={`set1-${campaign.id}-${idx}`} className="relative w-[280px] md:w-[400px] shrink-0 group/strip border-x-8 border-stone-900 bg-stone-900 overflow-hidden shadow-inner transition-all duration-500 hover:brightness-110">
                  <div className="aspect-[16/10] relative rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 ease-in-out group-hover/strip:scale-110"
                      data-ai-hint={campaign.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full">
                      <h4 className="text-white font-headline text-lg font-bold truncate leading-none mb-1 whitespace-normal">{campaign.title}</h4>
                      <p className="text-white/60 text-[10px] line-clamp-1 mb-3 whitespace-normal">{campaign.shortDescription}</p>
                      <Button variant="secondary" size="sm" asChild className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 h-7 text-[9px] font-black uppercase tracking-widest self-start rounded-full">
                        <Link href={`/campaigns/${campaign.id}`}>Explore Tour</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pr-4">
              {campaigns.map((campaign, idx) => (
                <div key={`set2-${campaign.id}-${idx}`} className="relative w-[280px] md:w-[400px] shrink-0 group/strip border-x-8 border-stone-900 bg-stone-900 overflow-hidden shadow-inner transition-all duration-500 hover:brightness-110">
                  <div className="aspect-[16/10] relative rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 ease-in-out group-hover/strip:scale-110"
                      data-ai-hint={campaign.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full">
                      <h4 className="text-white font-headline text-lg font-bold truncate leading-none mb-1 whitespace-normal">{campaign.title}</h4>
                      <p className="text-white/60 text-[10px] line-clamp-1 mb-3 whitespace-normal">{campaign.shortDescription}</p>
                      <Button variant="secondary" size="sm" asChild className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 h-7 text-[9px] font-black uppercase tracking-widest self-start rounded-full">
                        <Link href={`/campaigns/${campaign.id}`}>Explore Tour</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Perforation Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-stone-950 z-20 flex items-center justify-around overflow-hidden border-t border-white/5">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-stone-900 rounded-sm border border-stone-800 flex-shrink-0" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignCarousel;