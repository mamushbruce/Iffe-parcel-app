
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import Image from 'next/image';

const testimonials = [
    {
        name: 'Alice',
        avatarSrc: placeholderImages.userAlice.src,
        avatarHint: 'happy traveler',
        avatarWidth: placeholderImages.userAlice.width,
        avatarHeight: placeholderImages.userAlice.height,
        rating: 5,
        message: "The adventurer package was worth every penny! Our guide was incredibly knowledgeable, and seeing the 'Big Five' was a dream come true. The luxury tents were surprisingly comfortable. Unforgettable!"
    },
    {
        name: 'Bob',
        avatarSrc: placeholderImages.userBob.src,
        avatarHint: 'smiling man',
        avatarWidth: placeholderImages.userBob.width,
        avatarHeight: placeholderImages.userBob.height,
        rating: 5,
        message: "I never thought a group tour could feel so personal. The Explorer Package was perfectly organized, and I met some amazing people. Can't wait for my next trip with iffe-travels!"
    },
    {
        name: 'Charlie',
        avatarSrc: placeholderImages.userCharlie.src,
        avatarHint: 'adventurous person',
        avatarWidth: placeholderImages.userCharlie.width,
        avatarHeight: placeholderImages.userCharlie.height,
        rating: 4,
        message: "We planned a custom Ultimate Safari for our honeymoon, and it exceeded all expectations. The team listened to every detail and crafted a trip that was pure magic. Thank you!"
    }
];

export default function TestimonialCarousel() {
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [ref, isVisible] = useScrollAnimation();
    const [clientReady, setClientReady] = useState(false);
    
    useEffect(() => {
        setClientReady(true);
    }, []);

    useEffect(() => {
        if (!isVisible || !clientReady) return;

        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setTestimonialIndex(prevIndex => (prevIndex + 1) % testimonials.length);
                setIsAnimating(false);
            }, 300); // Corresponds to animation duration
        }, 7000); // Change testimonial every 7 seconds

        return () => clearInterval(timer);
    }, [isVisible, clientReady]);
    
    if (!clientReady) {
        return null; // Don't render on the server to prevent hydration issues
    }
    
    const currentTestimonial = testimonials[testimonialIndex];

    return (
        <section ref={ref} className={cn('scroll-animate py-8', isVisible && 'scroll-animate-in')}>
            <Card className="bg-transparent w-full max-w-2xl mx-auto border-none shadow-none">
                <CardHeader className="text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-accent mb-2"/>
                    <CardTitle className="font-headline text-2xl text-primary">From Our Travelers</CardTitle>
                </CardHeader>
                <CardContent className={cn(
                    "transition-all duration-300 ease-in-out",
                    isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                )}>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Avatar className="h-20 w-20 border-4 border-accent shadow-lg">
                           <Image 
                             src={currentTestimonial.avatarSrc} 
                             alt={currentTestimonial.name} 
                             width={currentTestimonial.avatarWidth} 
                             height={currentTestimonial.avatarHeight} 
                             data-ai-hint={currentTestimonial.avatarHint} 
                            />
                            <AvatarFallback>{currentTestimonial.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                             <p className="font-medium text-primary">{currentTestimonial.name}</p>
                            <div className="flex justify-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-5 w-5",
                                            i < currentTestimonial.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-muted-foreground/30"
                                        )}
                                    />
                                ))}
                            </div>
                           <p className="text-muted-foreground italic max-w-lg">"{currentTestimonial.message}"</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
