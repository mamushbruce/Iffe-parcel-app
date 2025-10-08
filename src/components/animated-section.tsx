
'use client';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <section ref={ref} id={id} className={cn('scroll-animate py-8', isVisible && 'scroll-animate-in', className)}>
            {children}
        </section>
    );
}
