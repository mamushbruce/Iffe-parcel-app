
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SignupModal from '@/components/auth/signup-modal';
import { ShieldCheck } from 'lucide-react';

export default function ERotaractSignupTrigger() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModalForERotaract = () => {
    setIsSignupModalOpen(true);
  };

  return (
    <>
      <SignupModal 
        open={isSignupModalOpen} 
        onOpenChange={setIsSignupModalOpen}
        initialStep="erotaract"
      />
      <Button 
        size="lg" 
        variant="secondary" 
        className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" 
        onClick={openSignupModalForERotaract}
      >
        <ShieldCheck className="mr-2 h-5 w-5" /> Join the Explorer's Club
      </Button>
    </>
  );
}
