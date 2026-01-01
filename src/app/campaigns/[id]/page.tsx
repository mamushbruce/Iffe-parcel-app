
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Mock data - replace with actual data fetching logic
interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  storyline: string;
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: string[];
  accommodation: string;
  meals: string;
}

const mockCampaignsData: Campaign[] = [
  {
    id: '1',
    title: 'Serengeti Great Migration',
    imageUrl: placeholderImages.campaignDetailWildebeest.src,
    imageWidth: placeholderImages.campaignDetailWildebeest.width,
    imageHeight: placeholderImages.campaignDetailWildebeest.height,
    dataAiHint: placeholderImages.campaignDetailWildebeest.hint,
    description: 'This 7-day safari places you in the heart of the action during the Great Migration. You will stay in luxury tented camps, strategically located to maximize wildlife viewing. Daily game drives with expert guides will bring you close to vast herds of wildebeest, zebras, and the predators that follow them. This all-inclusive package covers meals, accommodation, park fees, and guided activities. It is a photographer\'s dream and an unforgettable life experience. This long description serves as a good test for the AI summarizer feature, which will provide a concise overview of these key points.',
    storyline: 'From the moment you land, every detail is handled. Our expert guides share deep knowledge of the ecosystem, ensuring a rich and immersive experience. We partner with local communities to ensure tourism benefits the region.',
    budget: 15000,
    goal: 100,
    currentAmount: 92,
    organizer: 'iffe-travels',
    tags: ['#GreatMigration', '#Tanzania', '#BigFive', '#LuxuryCamping'],
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    volunteersNeeded: 12,
    volunteersSignedUp: 8,
    activities: ['Daily Game Drives', 'Cultural Village Visit', 'Bush Dinners', 'Sundowner Cocktails'],
    accommodation: 'Luxury ensuite tented camps with comfortable beds and private verandas overlooking the plains.',
    meals: 'All-inclusive. Gourmet breakfast, lunch, and dinner with a mix of international and local cuisine. All drinks included.',
  },
   { 
    id: '2', 
    title: 'Gorilla Trekking Adventure', 
    imageUrl: placeholderImages.campaignDetailGorilla.src, 
    imageWidth: placeholderImages.campaignDetailGorilla.width,
    imageHeight: placeholderImages.campaignDetailGorilla.height,
    dataAiHint: placeholderImages.campaignDetailGorilla.hint, 
    description: 'A once-in-a-lifetime opportunity to trek through the Bwindi Impenetrable Forest and spend time with a family of mountain gorillas. This 3-day package includes permits, expert local trackers, and comfortable lodging near the park. The trek can be challenging, but the reward is an unparalleled wildlife encounter that directly supports conservation efforts. We are committed to responsible tourism.', 
    storyline: 'Our local guides have generations of experience in this forest. Your journey supports their families and the vital work of the park rangers protecting these magnificent creatures.', 
    budget: 20000, 
    goal: 100, 
    currentAmount: 98, 
    organizer: 'iffe-travels', 
    tags: ['#GorillaTrekking', '#Uganda', '#Conservation', '#Primates'], 
    startDate: '2024-09-01', 
    endDate: '2024-09-04', 
    volunteersNeeded: 8, 
    volunteersSignedUp: 6,
    activities: ['Gorilla Trekking (permit included)', 'Community Walk', 'Bird Watching Tour'],
    accommodation: 'Comfortable eco-lodges with stunning forest views. Options range from budget to luxury.',
    meals: 'Full board. Includes breakfast, packed lunch for the trek, and dinner. Locally sourced ingredients.',
  },
  { 
    id: '3', 
    title: 'Okavango Delta Mokoro Trip', 
    imageUrl: placeholderImages.campaignDetailMokoro.src,
    imageWidth: placeholderImages.campaignDetailMokoro.width,
    imageHeight: placeholderImages.campaignDetailMokoro.height,
    dataAiHint: placeholderImages.campaignDetailMokoro.hint, 
    description: 'Silently glide through the crystal-clear waterways of the Okavango Delta in a traditional mokoro (dugout canoe). This 5-day tour offers a unique perspective on wildlife, from elephants drinking at the water\'s edge to vibrant birdlife. You will camp on remote islands under the stars, guided by experienced local polers. This is an immersive, eco-friendly way to experience one of Africa\'s last great wildernesses.', 
    storyline: 'Disconnect from the world and reconnect with nature. Our guides share their deep understanding of this unique ecosystem, passed down through generations. This is a low-impact, high-immersion adventure.', 
    budget: 8000, 
    goal: 100, 
    currentAmount: 95, 
    organizer: 'iffe-travels', 
    tags: ['#OkavangoDelta', '#Botswana', '#Mokoro', '#EcoTourism'], 
    startDate: '2024-10-05', 
    endDate: '2024-10-10', 
    volunteersNeeded: 10, 
    volunteersSignedUp: 10, 
    activities: ['Mokoro Excursions', 'Guided Bush Walks on Islands', 'Stargazing', 'Wild Camping'],
    accommodation: 'Mobile camping on remote islands in serviced dome tents with cot beds and shared ablutions.',
    meals: 'All meals prepared by a dedicated camp chef over an open fire. Includes tea, coffee, and filtered water.',
  },
  {
    id: 'nile-cruise',
    title: 'Luxury Nile Cruise',
    imageUrl: placeholderImages.campaignNileCruise.src,
    imageWidth: placeholderImages.campaignNileCruise.width,
    imageHeight: placeholderImages.campaignNileCruise.height,
    dataAiHint: placeholderImages.campaignNileCruise.hint,
    description: 'Embark on a majestic 10-day luxury cruise down the historic River Nile. Discover ancient temples, and bustling cities from the comfort of a 5-star vessel. This package includes guided tours to iconic landmarks, all meals, and onboard entertainment, offering a seamless blend of relaxation and discovery.',
    storyline: 'Sail through millennia of history. Wake up to stunning river views, explore ancient wonders by day, and dine under the stars by night. Our Egyptologist guides bring the stories of the past to life.',
    budget: 25000,
    goal: 100,
    currentAmount: 89,
    organizer: 'iffe-travels',
    tags: ['#NileCruise', '#Egypt', '#History', '#Luxury'],
    startDate: '2024-11-01',
    endDate: '2024-11-10',
    volunteersNeeded: 20,
    volunteersSignedUp: 15,
    activities: ['Guided Temple Tours (Karnak, Luxor, Edfu)', 'Valley of the Kings Visit', 'Onboard Galabeya Party', 'Sailing'],
    accommodation: '5-star Nile cruise ship with air-conditioned cabins, private bathrooms, swimming pool, and sundeck.',
    meals: 'Full board buffet-style breakfast, lunch, and dinner. Afternoon tea served daily. Excludes drinks.',
  },
  {
    id: 'kilimanjaro-hike',
    title: 'Kilimanjaro Summit Hike',
    imageUrl: placeholderImages.campaignKilimanjaro.src,
    imageWidth: placeholderImages.campaignKilimanjaro.width,
    imageHeight: placeholderImages.campaignKilimanjaro.height,
    dataAiHint: placeholderImages.campaignKilimanjaro.hint,
    description: 'Conquer the roof of Africa on this challenging but rewarding 12-day trek to the summit of Mount Kilimanjaro. This expedition is fully supported by our expert mountain crew, including guides, porters, and a cook. We prioritize safety and acclimatization, giving you the best possible chance of reaching Uhuru Peak. No technical climbing skills are required, just a strong will and a good level of fitness.',
    storyline: 'From lush rainforests to alpine deserts and glacial peaks, the journey up Kilimanjaro is a world tour in one climb. Experience the triumph of reaching the summit as the sun rises over the African plains.',
    budget: 30000,
    goal: 100,
    currentAmount: 94,
    organizer: 'iffe-travels',
    tags: ['#Kilimanjaro', '#Tanzania', '#Hiking', '#Adventure'],
    startDate: '2025-01-15',
    endDate: '2025-01-27',
    volunteersNeeded: 10,
    volunteersSignedUp: 7,
    activities: ['Multi-day Mountain Trekking', 'Acclimatization Hikes', 'Summit Attempt', 'Camping'],
    accommodation: 'High-quality mountain tents during the hike and comfortable hotel accommodation before and after the climb.',
    meals: 'All meals and purified water provided on the mountain, prepared by a dedicated mountain cook.',
  },
];

async function getCampaign(id: string): Promise<Campaign | undefined> {
  // Simulate API call
  return mockCampaignsData.find(campaign => campaign.id === id);
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [ref, isVisible] = useScrollAnimation();
  const [formattedEndDate, setFormattedEndDate] = useState('');

  useEffect(() => {
    getCampaign(params.id).then(data => {
        if(data) {
            setCampaign(data);
        } else {
            notFound();
        }
    });
  }, [params.id]);

  useEffect(() => {
    if (campaign?.endDate) {
      // This runs only on the client, after hydration
      setFormattedEndDate(new Date(campaign.endDate).toLocaleDateString())
    }
  }, [campaign?.endDate]);

  if (!campaign) {
    // You might want to show a loader here
    return null;
  }

  return (
    <div ref={ref} className={cn('space-y-8 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image 
            src={campaign.imageUrl} 
            alt={campaign.title} 
            fill 
            className="object-cover" 
            data-ai-hint={campaign.dataAiHint}
            priority 
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
           <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10">{campaign.title}</CardTitle>
        </div>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </section>
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">The Experience</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.storyline}</p>
              </section>

              <div className="grid sm:grid-cols-2 gap-6">
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><Activity className="mr-2 h-5 w-5"/>Activities</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {campaign.activities.map(activity => <li key={activity}>{activity}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><BedDouble className="mr-2 h-5 w-5"/>Accommodation</h3>
                  <p className="text-muted-foreground">{campaign.accommodation}</p>
                </section>
              </div>

               <section>
                <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><UtensilsCrossed className="mr-2 h-5 w-5"/>Meals</h3>
                <p className="text-muted-foreground">{campaign.meals}</p>
              </section>
              
              {campaign.tags && campaign.tags.length > 0 && (
                <section>
                   <h3 className="font-headline text-lg font-semibold text-primary mb-2">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="secondary"><Tag className="h-3 w-3 mr-1" />{tag.replace('#', '')}</Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <aside className="space-y-6 md:sticky md:top-24">
              <CampaignActionsCard
                campaignTitle={campaign.title}
                currentAmount={campaign.currentAmount}
                goal={campaign.goal}
                endDate={formattedEndDate}
                volunteersSignedUp={campaign.volunteersSignedUp}
                volunteersNeeded={campaign.volunteersNeeded}
              />
              <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center"><Compass className="mr-2 h-5 w-5"/>Tour Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-semibold">{campaign.organizer}</p>
                  <p className="text-xs text-muted-foreground">We are committed to responsible and authentic travel experiences.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
          
          <Summarizer campaignDescription={campaign.description} campaignTitle={campaign.title} />

        </CardContent>
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Reviews (32)</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={`/campaigns/${campaign.id}/updates`}>
              View Full Itinerary <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
