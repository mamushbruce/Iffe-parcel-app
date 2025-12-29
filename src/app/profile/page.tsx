
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ShieldCheck, Heart, UserPlus, Rss, Mountain, MapPin, Star, MessageSquare } from 'lucide-react';
import VerifiedBadge from '@/components/verified-badge'; 
import placeholderImages from '@/app/lib/placeholder-images.json';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const rangerData = {
  name: 'Ranger Ben',
  title: 'Conservation & Tracking Specialist',
  avatarUrl: placeholderImages.homeCreatorTom.src,
  avatarWidth: placeholderImages.homeCreatorTom.width,
  avatarHeight: placeholderImages.homeCreatorTom.height,
  dataAiHint: placeholderImages.homeCreatorTom.hint,
  bio: `With over 15 years of experience in the African bush, Ranger Ben is a master tracker and a passionate conservationist. His deep understanding of animal behavior and the delicate balance of the ecosystem provides a safari experience that is both thrilling and educational. Ben specializes in walking safaris and has a keen eye for spotting the most elusive wildlife. He believes that true conservation comes from a place of respect and understanding, a philosophy he shares with every traveler he guides.`,
  stats: [
    { label: 'Experience', value: '15+ Years' },
    { label: 'Tours Guided', value: '400+' },
    { label: 'Specialties', value: 'Tracking, Conservation' },
  ],
  isVerified: true,
};

const rangerBlogPosts: BlogCardProps[] = [
  { id: '2', title: 'Birdwatcher\'s Paradise: The Shoebill of Mabamba Swamp', author: 'Ranger Ben', date: 'Oct 22, 2023', excerpt: 'Journey into the swamps of Uganda to find one of the world\'s most prehistoric and sought-after birds.', imageUrl: placeholderImages.blogShoebill.src, dataAiHint: 'shoebill stork', tags: ['#Birdwatching', '#Uganda'], commentCount: 8 },
];

const rangerTours = [
  { id: '2', title: 'Queen Elizabeth National Park', shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.', imageUrl: placeholderImages.campaignQueenElizabeth.src, dataAiHint: 'tree climbing lion' },
  { id: '4', title: 'Kibale Forest Chimpanzee Trekking', shortDescription: 'Trek chimpanzees in the primate capital of East Africa.', imageUrl: placeholderImages.campaignKibale.src, dataAiHint: 'chimpanzee forest' },
];

const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in', className)}>
            <Card className={cn("overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full", className)}>
                {children}
            </Card>
        </div>
    );
};


export default function RangerProfilePage() {
    const [headerRef, isHeaderVisible] = useScrollAnimation();

  return (
    <div className="space-y-8 animate-fade-in">
        <section ref={headerRef} className={cn('scroll-animate bg-card p-6 rounded-lg shadow-lg', isHeaderVisible && 'scroll-animate-in')}>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <Avatar className="h-24 w-24 border-4 border-accent">
                <AvatarImage asChild src={rangerData.avatarUrl} alt={rangerData.name}>
                  <Image src={rangerData.avatarUrl} alt={rangerData.name} width={rangerData.avatarWidth} height={rangerData.avatarHeight} data-ai-hint={rangerData.dataAiHint} />
                </AvatarImage>
                <AvatarFallback>{rangerData.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="font-headline text-3xl font-bold text-primary flex items-center justify-center sm:justify-start">
                  {rangerData.name} {rangerData.isVerified && <VerifiedBadge className="ml-2" size={24} />}
                </h1>
                <p className="text-muted-foreground">{rangerData.title}</p>
                <div className="mt-3 flex gap-2 flex-wrap justify-center sm:justify-start">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><UserPlus className="w-4 h-4 mr-2" /> Follow</Button>
                    <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
                </div>
              </div>
            </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
            {rangerData.stats.map(stat => (
                <AnimatedCard key={stat.label}>
                    <CardHeader className="text-center p-4">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.label}</CardTitle>
                        <CardDescription className="text-2xl font-bold text-primary">{stat.value}</CardDescription>
                    </CardHeader>
                </AnimatedCard>
            ))}
        </div>

        <AnimatedCard>
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">About Ranger Ben</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{rangerData.bio}</p>
            </CardContent>
        </AnimatedCard>

        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Travel Journal</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {rangerBlogPosts.map(post => <BlogCard key={post.id} {...post} />)}
                 {rangerBlogPosts.length === 0 && <p className="text-muted-foreground">No journal entries yet.</p>}
            </div>
        </section>
        
        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Guided Tours</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rangerTours.map(tour => (
                    <AnimatedCard key={tour.id}>
                        <div className="relative w-full h-48">
                            <Image src={tour.imageUrl} alt={tour.title} layout="fill" objectFit="cover" data-ai-hint={tour.dataAiHint} />
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg text-primary hover:text-accent transition-colors">
                                <Link href={`/campaigns/${tour.id}`}>{tour.title}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground">{tour.shortDescription}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="link" className="p-0 text-accent">
                                <Link href={`/campaigns/${tour.id}`}>View Itinerary &rarr;</Link>
                            </Button>
                        </CardFooter>
                    </AnimatedCard>
                ))}
            </div>
        </section>

    </div>
  );
}
