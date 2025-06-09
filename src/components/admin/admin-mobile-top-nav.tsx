
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface AdminMobileTopNavProps {
  navItems: NavItem[];
}

export default function AdminMobileTopNav({ navItems }: AdminMobileTopNavProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 bg-card h-14 border-b shadow-sm z-40 flex items-center px-1 lg:hidden">
        <div className="flex justify-around w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
            return (
              <Tooltip key={item.label} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center p-2.5 rounded-md h-10 w-10", // Square buttons for icons
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "")} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-card text-card-foreground border-border shadow-md">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
