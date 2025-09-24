
'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="currentColor"
    >
      <path d="M24 4C12.95 4 4 12.95 4 24c0 4.22 1.23 8.12 3.36 11.41L4 44l8.91-3.29C16.15 42.76 20 44 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4z" fill="#fff"/>
      <path d="M24 9c8.27 0 15 6.73 15 15 0 8.27-6.73 15-15 15-3.14 0-6.04-.97-8.46-2.64l-.6-.42-5.28 1.95 1.98-5.17-.44-.63C9.99 29.99 9 27.1 9 24c0-8.27 6.73-15 15-15z" fill="#25D366"/>
      <path d="M19.79 16.42c-.4-.89-.82-.91-1.2-.93-.31-.02-.67-.02-1.03-.02s-.95.14-1.45.72c-.5.58-1.9 1.86-1.9 4.54s1.95 5.26 2.22 5.62c.27.36 3.76 6 9.3 8.16 4.61 1.82 5.55 1.46 6.55 1.37.99-.09 3.22-1.31 3.67-2.58.45-1.27.45-2.36.32-2.58-.14-.22-.5-.36-1.04-.63-.54-.27-3.22-1.59-3.72-1.77-.5-.18-.86-.27-1.22.27-.36.54-1.4 1.77-1.72 2.13-.32.36-.63.4-1.17.13-.54-.27-2.29-.85-4.36-2.72-1.61-1.43-2.69-3.19-3.01-3.73-.31-.54-.03-.83.23-1.1.24-.24.54-.63.81-.95.27-.32.36-.54.54-.9.18-.36.09-.68-.04-.95-.13-.27-1.15-2.81-1.62-3.86z" fill="#fff"/>
    </svg>
);


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
            className="fixed bottom-20 md:bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg z-50 animate-pulse-slow"
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <WhatsAppIcon className="h-10 w-10" />
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
