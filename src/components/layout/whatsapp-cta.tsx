
'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export default function WhatsAppCTA() {
  // Replace with your actual WhatsApp number
  const whatsappNumber = "1234567890";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="default"
            size="icon"
            className="fixed bottom-20 md:bottom-6 right-6 h-14 w-14 rounded-full bg-background hover:bg-background/90 text-white shadow-lg z-50 animate-slow-bounce flex items-center justify-center"
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '36px', color: '#25D366' }}></i>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card text-card-foreground border-border shadow-md">
          <p>Talk to us</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
