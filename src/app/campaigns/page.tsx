'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tag, ArrowRight, PlusCircle, Loader2, Search, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useState, useMemo, useEffect } from 'react';
import HeroSection from '@/components/layout/hero-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from '@/components/animated-section';
import { fetchCampaigns, type Campaign } from '@/lib/services/cms-service';

const ITEMS_PER_PAGE = 6;
const regions = ['All Regions', 'Western', 'Eastern', 'Northern', 'Central', 'Other'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.tags?.some(tag => tag.toLowerCase().replace('#', '').includes(searchTerm.toLowerCase()));
      
      const matchesRegion = regionFilter === 'All Regions' || campaign.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [campaigns, searchTerm, regionFilter]);
  
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, regionFilter]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const campaignsToShow = filteredCampaigns.slice(0, visibleCount);

  const AnimatedCard = ({ campaign }: { campaign: Campaign }) => {
    const [ref, isVisible] = useScrollAnimation();
    const progressPercentage = campaign.currentAmount || 0;
    const [imgSrc, setImgSrc] = useState(campaign.imageUrl);

    return (
        <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in')}>
            <Card key={campaign.id} className="overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card/80 backdrop-blur-sm">
            <div className="relative w-full h-48">
                <Image 
                    src={imgSrc} 
                    alt={campaign.title} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={campaign.dataAiHint} 
                    onError={() => setImgSrc(placeholderImages.campaignDetailWildebeest.src)}
                />
            </div>
            <CardHeader>
                <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
                <Link href={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 h-8">{campaign.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-primary">{campaign.currentAmount}% Traveller Rating</span>
                    <span className="text-muted-foreground">based on reviews</span>
                </div>
                <Progress value={progressPercentage} className="h-2" aria-label={`${progressPercentage}% rating`} />
                </div>
                {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {campaign.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" /> {tag.replace('#', '')}
                    </Badge>
                    ))}
                </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 whitespace-normal h-auto text-center">
                <Link href={`/campaigns/${campaign.id}`}>
                    View Itinerary <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            </CardFooter>
            </Card>
        </div>
    );
    };
    
  return (
    <div className="space-y-8 animate-fade-in">
      <HeroSection 
        title="Our Safari Tours"
        subtitle="Discover and book adventures that make a difference."
        iconName="MountainSnow"
        imageUrl={placeholderImages.campaignDetailWildebeest.src}
        dataAiHint={placeholderImages.campaignDetailWildebeest.hint}
      />

      <AnimatedSection>
        <div className="text-center">
            <h2 className="font-headline text-xl font-bold text-primary mb-2">Search & Filter Tours</h2>
            <p className="text-sm text-muted-foreground mb-4">Find your next adventure using a keyword or region.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="relative flex items-center w-full max-w-md">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search by keyword or tag..." 
                        className="w-full h-12 text-base rounded-full border pl-12 focus-visible:ring-2 focus-visible:ring-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-full sm:w-auto h-12 rounded-full border text-base focus-visible:ring-2 focus-visible:ring-accent">
                    <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
        </div>
      </AnimatedSection>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : campaignsToShow.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignsToShow.map(campaign => (
            <AnimatedCard key={campaign.id} campaign={campaign} />
          ))}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            {searchTerm || regionFilter !== 'All Regions' ? `No tours found for your criteria.` : "No tours found. Check back later!"}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-12">
        {visibleCount < filteredCampaigns.length && (
            <Button size="lg" variant="secondary" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                    </>
                ) : "Load More Tours"}
            </Button>
        )}
        <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent whitespace-normal text-center h-auto" asChild>
          <Link href="/campaigns/new" className="flex items-center justify-center">
            <PlusCircle className="mr-0 md:mr-2 h-5 w-5" />
            <span className="md:hidden">New Tour</span>
            <span className="hidden md:inline">Plan a Custom Tour</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}