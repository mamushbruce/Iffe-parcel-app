
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

const testimonials = [
  {
    name: 'Alice',
    initials: 'A',
    text: "The Adventurer package was worth every penny! Our guide was incredibly knowledgeable. Unforgettable!",
    rating: 5,
  },
  {
    name: 'Bob',
    initials: 'B',
    text: "I never thought a group tour could feel so personal. The Explorer Package was perfectly organized.",
    rating: 5,
  },
  {
    name: 'Charlie',
    initials: 'C',
    text: "Planning a custom Ultimate Safari for our honeymoon was pure magic. The team listened to every detail.",
    rating: 5,
  },
  {
    name: 'Diana',
    initials: 'D',
    text: "An amazing experience from start to finish. The landscapes were breathtaking and the wildlife was abundant.",
    rating: 4,
  },
  {
    name: 'Edward',
    initials: 'E',
    text: "The best trip of my life! I highly recommend iffe-travels to anyone looking for a real adventure.",
    rating: 5,
  },
  {
    name: 'Fiona',
    initials: 'F',
    text: "A truly professional and well-executed tour. The attention to detail made all the difference.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, isSectionVisible] = useScrollAnimation();

  useEffect(() => {
    // Start animations only when the section is visible
    if (!isSectionVisible) return;

    const initialTimer = setTimeout(() => setIsVisible(true), 500);

    const cycleTestimonials = () => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsVisible(true);
      }, 1000);
    };

    const interval = setInterval(cycleTestimonials, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isSectionVisible]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={ref} className="py-12">
        <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
                    <Users className="h-10 w-10 md:h-12 md:w-12 text-accent" />
                </div>
                <CardTitle className="font-headline text-3xl text-primary">From Our Travelers</CardTitle>
                <CardDescription>Real stories from real adventurers.</CardDescription>
            </CardHeader>
            <CardContent className="relative h-48 flex items-center justify-center">
                <div
                    className={cn(
                    "w-full transition-all duration-1000 absolute",
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-8"
                    )}
                >
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg italic text-foreground leading-relaxed max-w-lg">
                            "{currentTestimonial.text}"
                        </p>
                        <div className="text-center">
                            <p className="font-bold text-primary">{currentTestimonial.name}</p>
                            <div className="flex justify-center items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                    "h-5 w-5",
                                    i < currentTestimonial.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-muted-foreground/50"
                                    )}
                                />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </section>
  );
}
