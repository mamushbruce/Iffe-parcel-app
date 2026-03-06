'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Sparkles, Map, Package, ListChecks, Trophy, ArrowRight, Info } from 'lucide-react';
import { fetchBasePackages, fetchAddons, calculatePricing, type Package as BuilderPackage, type Addon } from '@/lib/services/cms-service';
import { useToast } from '@/hooks/use-toast';

export default function CustomSafariBuilder() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<BuilderPackage[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<BuilderPackage | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pkgs, ads] = await Promise.all([fetchBasePackages(), fetchAddons()]);
        setPackages(pkgs);
        setAddons(ads);
        // Default to adventurer if it exists
        const defaultPkg = pkgs.find(p => p.id === 'adventurer') || pkgs[0];
        setSelectedPackage(defaultPkg || null);
      } catch (err) {
        console.error("Builder load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedAddons = useMemo(() => 
    addons.filter(a => selectedAddonIds.includes(a.id)),
    [addons, selectedAddonIds]
  );

  const pricing = useMemo(() => {
    if (!selectedPackage) return null;
    return calculatePricing(selectedPackage, selectedAddons);
  }, [selectedPackage, selectedAddons]);

  const groupedAddons = useMemo(() => {
    return {
      activity: addons.filter(a => a.category === 'activity'),
      luxury: addons.filter(a => a.category === 'luxury'),
      extension: addons.filter(a => a.category === 'extension'),
    };
  }, [addons]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBooking = () => {
    toast({
      title: "Custom Safari Request Prepared",
      description: "Our experts will contact you to finalize your bespoke itinerary.",
    });
  };

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading Builder...</div>;

  return (
    <section className="bg-stone-950/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-500">
      {/* Dynamic Lighting Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-6">
          <Badge variant="outline" className="text-accent border-accent/40 bg-accent/5 px-6 py-1.5 uppercase tracking-[0.2em] text-[10px] font-black rounded-full">
            Bespoke Adventure
          </Badge>
          <h2 className="font-headline text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Custom</span> Safari
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Design your dream journey by starting with a base package and layering on the experiences that matter most to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-16">
            {/* Step 1: Base Package */}
            <div className="space-y-8">
              <h3 className="font-headline text-2xl font-bold text-white flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl"><Package className="h-6 w-6 text-accent" /></div>
                Step 1: Choose Your Foundation
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={cn(
                      "cursor-pointer transition-all duration-500 bg-white/5 backdrop-blur-md border-white/10 hover:border-accent/50 group relative overflow-hidden",
                      selectedPackage?.id === pkg.id && "border-accent ring-1 ring-accent/50 scale-[1.05] bg-white/10 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                    )}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity duration-500",
                        selectedPackage?.id === pkg.id && "opacity-100"
                    )} />
                    <CardHeader className="p-6 relative z-10">
                      <CardTitle className="text-xl font-headline text-white group-hover:text-accent transition-colors">{pkg.name}</CardTitle>
                      <div className="text-3xl font-black text-accent mt-2">${pkg.basePrice}</div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-sm text-stone-400 relative z-10 font-medium">
                      {pkg.durationDays} Days Duration
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedPackage?.id === 'explorer' && (
                <div className="bg-blue-500/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 animate-fade-in shadow-lg">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-blue-100/80 leading-relaxed font-medium">
                    <strong className="text-white block mb-1">Expert Suggestion</strong> 
                    Upgrade to the <span className="text-blue-400 font-bold">Adventurer Package</span> for a significantly deeper primate experience and better lodge locations.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Add-ons */}
            <div className="space-y-10">
              <h3 className="font-headline text-2xl font-bold text-white flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl"><ListChecks className="h-6 w-6 text-accent" /></div>
                Step 2: Add Your Experiences
              </h3>

              {/* Grouped Addons */}
              {Object.entries(groupedAddons).map(([category, items]) => (
                <div key={category} className="space-y-6">
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-[0.3em] pl-1">{category}s</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {items.map((addon) => (
                      <div 
                        key={addon.id}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-md",
                          selectedAddonIds.includes(addon.id) 
                            ? "bg-accent/10 border-accent/40 shadow-accent/5" 
                            : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                        )}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <Checkbox 
                            id={addon.id} 
                            checked={selectedAddonIds.includes(addon.id)}
                            onCheckedChange={() => toggleAddon(addon.id)}
                            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent h-5 w-5 border-white/30"
                          />
                          <label className="text-sm font-bold text-stone-200 cursor-pointer group-hover:text-white transition-colors">{addon.name}</label>
                        </div>
                        <div className="text-sm font-black text-accent relative z-10 group-hover:scale-110 transition-transform">+${addon.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Sticky Summary */}
          <aside className="lg:sticky lg:top-24 space-y-8">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden relative rounded-[2rem] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
              <CardHeader className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="font-headline text-2xl text-white font-black tracking-tight">Summary</CardTitle>
                  {pricing?.tier === 'elite' && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-stone-950 border-none font-black px-3 py-1 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse">
                      <Trophy className="h-3 w-3 mr-1.5" /> ELITE
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-stone-400 font-medium">Review your custom configuration</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-stone-300">
                    <span className="opacity-70">Base Foundation</span>
                    <span className="text-white">${pricing?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="opacity-70">Custom Add-ons ({selectedAddonIds.length})</span>
                    <span className="text-white">${pricing?.addonsTotal.toLocaleString()}</span>
                  </div>
                  {pricing?.discountAmount ? (
                    <div className="flex justify-between text-green-400 bg-green-400/10 px-3 py-2 rounded-xl border border-green-400/20">
                      <span>Wildlife Bundle Discount</span>
                      <span className="font-black">-${pricing.discountAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex flex-col gap-2">
                    <span className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Investment</span>
                    <div className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_25px_rgba(251,191,36,0.25)] transition-all duration-700">
                      ${pricing?.finalTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-stone-950/50 p-8 border-t border-white/5">
                <Button className="w-full bg-accent text-stone-950 hover:bg-white hover:scale-[1.02] font-black h-16 text-lg rounded-2xl transition-all shadow-[0_15px_30px_-5px_rgba(251,191,36,0.3)] active:scale-95" onClick={handleBooking}>
                  REQUEST ITINERARY <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center px-6">
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
                * All custom safaris are subject to seasonal availability. Prices represent estimated group investments per person.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}