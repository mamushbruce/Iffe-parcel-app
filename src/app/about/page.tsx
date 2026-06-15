
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import placeholderImages from '@/app/lib/placeholder-images.json';
import PageHero from "@/components/layout/page-hero";
import TestimonialSection from "@/components/testimonial-section";
import { ShieldCheck, Users, Globe, Leaf, Camera, HeartHandshake, Map, Compass } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <section ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in', className)}>
                {children}
            </section>
        );
    };

    const coreValues = [
        {
            icon: ShieldCheck,
            title: "Uncompromising Safety",
            description: "From our 4x4 fleet maintenance to our highly trained guides, your security is our primary focus on every journey."
        },
        {
            icon: Leaf,
            title: "Sustainable Footprint",
            description: "We are committed to ethical tourism, ensuring that our visits preserve the pristine beauty of the landscapes we explore."
        },
        {
            icon: Users,
            title: "Community First",
            description: "A significant portion of every booking goes directly to supporting the local villages and conservation projects we partner with."
        },
        {
            icon: Compass,
            title: "Radical Authenticity",
            description: "No generic tourist traps. We take you off the beaten path to meet the real people and wildlife of the Pearl of Africa."
        }
    ];

  return (
    <div className="space-y-20 pb-20">
        <PageHero 
          title="Our Heritage: Your Adventure"
          subtitle="Discover the passion and purpose behind iffe-travels—where bespoke safari luxury meets deep-rooted community impact."
          imageUrl={placeholderImages.aboutHeader.src}
          dataAiHint={placeholderImages.aboutHeader.hint}
          primaryAction={{ text: "Explore Our Expeditions", link: "/campaigns" }}
          secondaryAction={{ text: "Plan a Custom Trip", link: "/campaigns/new" }}
        />

        {/* Who We Are & Our Story */}
        <AnimatedSection className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                        The Iffe Story
                    </div>
                    <h2 className="font-headline text-4xl font-black text-primary uppercase tracking-tighter leading-tight">
                        Bridging Luxury with <span className="text-accent">Authentic</span> African Roots
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-lg font-body italic border-l-4 border-accent pl-6">
                        "iffe-travels was founded not just to show people the wildlife, but to immerse them in the soul of the continent."
                    </p>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Born from a deep love for the Pearl of Africa, iffe-travels began as a small guide-led operation with a single vehicle and a vision to change how people see Uganda. Our founder, Ian Mudembula, spent over 15 years navigating the rugged terrain of Bwindi, Queen Elizabeth, and the Kidepo Valley.
                        </p>
                        <p>
                            Today, we have grown into a premier tour agency that refuses to lose its personal touch. We believe that travel should be a two-way exchange—an experience that transforms the traveler while providing sustainable growth for the local guides, artisans, and communities we visit.
                        </p>
                    </div>
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
                    <Image 
                        src={placeholderImages.gallerySafariGroup.src} 
                        alt="Guided safari group" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        data-ai-hint="safari group"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                        <p className="text-white font-bold italic">"Expertly crafted, heart-led journeys across East Africa."</p>
                    </div>
                </div>
             </div>
        </AnimatedSection>

        {/* Core Values Grid */}
        <div className="bg-stone-950 py-24 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter">The <span className="text-accent">Iffe</span> Pillars</h2>
                    <p className="text-stone-400 font-medium">Every itinerary we build is anchored by these four fundamental commitments.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coreValues.map((value, idx) => (
                        <Card key={idx} className="bg-white/5 border-white/10 hover:border-accent/50 transition-all duration-500 group rounded-[2rem] h-full flex flex-col">
                            <CardHeader className="p-8 pb-4">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent transition-all group-hover:scale-110">
                                    <value.icon className="h-7 w-7 text-accent group-hover:text-stone-950 transition-colors" />
                                </div>
                                <CardTitle className="text-white font-headline text-xl uppercase tracking-tight">{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 flex-grow">
                                <p className="text-stone-400 text-sm leading-relaxed">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        {/* Why Us / Impact */}
        <AnimatedSection className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-muted/30 rounded-[3rem] p-8 md:p-16 border border-primary/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                <div className="grid md:grid-cols-3 gap-12 items-center">
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="font-headline text-3xl font-black text-primary uppercase tracking-tighter">Why Choose Our Agency?</h2>
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">01</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-primary">Native Knowledge</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Our guides aren't just staff; they are locals who grew up in the regions you visit, offering an ancestral connection to the land.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">02</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-primary">Custom-Built Flexibility</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">We don't believe in "one size fits all." Every tour can be adjusted on the fly to match your pace and spontaneous interests.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">03</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-primary">Photography Focused</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">With expert photographers on the team, we ensure you are positioned correctly for the best lighting and angles to capture that perfect shot.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">04</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-primary">Bespoke Support</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">From Entebbe arrival to departure, our operations team in Jinja monitors your progress 24/7 for total peace of mind.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] shadow-2xl flex flex-col items-center text-center space-y-6">
                        <HeartHandshake className="h-12 w-12 text-accent" />
                        <h3 className="font-headline text-2xl font-black uppercase leading-tight">Ready to join the Pride?</h3>
                        <p className="text-sm opacity-80 font-body">Contact our specialists today to begin drafting your personalized safari foundation.</p>
                        <div className="w-full h-px bg-white/20" />
                        <a href="/contact" className="text-accent font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors">Start Inquiring &rarr;</a>
                    </div>
                </div>
            </div>
        </AnimatedSection>

        <TestimonialSection />

    </div>
  );
}
