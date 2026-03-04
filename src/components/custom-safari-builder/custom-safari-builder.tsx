
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <section className="bg-stone-900/40 rounded-3xl border border-accent/20 p-6 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-accent border-accent/30 px-4 py-1 uppercase tracking-tighter">
            Bespoke Adventure
          </Badge>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Build Your <span className="text-accent">Custom</span> Safari
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Design your dream journey by starting with a base package and layering on the experiences that matter most to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-12">
            {/* Step 1: Base Package */}
            <div className="space-y-6">
              <h3 className="font-headline text-xl font-bold text-primary-foreground flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-lg"><Package className="h-5 w-5 text-accent" /></div>
                Step 1: Choose Your Foundation
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 bg-stone-800/50 border-stone-700 hover:border-accent/50 group",
                      selectedPackage?.id === pkg.id && "border-accent ring-1 ring-accent scale-[1.02] bg-stone-800"
                    )}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-headline text-white">{pkg.name}</CardTitle>
                      <div className="text-2xl font-black text-accent">${pkg.basePrice}</div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-stone-400">
                      {pkg.durationDays} Days Duration
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedPackage?.id === 'explorer' && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                  <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-200">
                    <strong>Expert Suggestion:</strong> Upgrade to the <span className="text-white font-semibold">Adventurer Package</span> for a significantly deeper primate experience and better lodge locations.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Add-ons */}
            <div className="space-y-8">
              <h3 className="font-headline text-xl font-bold text-primary-foreground flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-lg"><ListChecks className="h-5 w-5 text-accent" /></div>
                Step 2: Add Your Experiences
              </h3>

              {/* Grouped Addons */}
              {Object.entries(groupedAddons).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h4 className="text-sm font-black text-stone-500 uppercase tracking-widest pl-1">{category}s</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {items.map((addon) => (
                      <div 
                        key={addon.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer group",
                          selectedAddonIds.includes(addon.id) 
                            ? "bg-accent/10 border-accent/40" 
                            : "bg-stone-800/30 border-stone-700 hover:border-stone-600"
                        )}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={addon.id} 
                            checked={selectedAddonIds.includes(addon.id)}
                            onCheckedChange={() => toggleAddon(addon.id)}
                            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                          <label className="text-sm font-medium text-stone-200 cursor-pointer">{addon.name}</label>
                        </div>
                        <div className="text-sm font-bold text-accent">+${addon.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Sticky Summary */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <Card className="bg-stone-800 border-accent/30 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="font-headline text-xl text-white">Summary</CardTitle>
                  {pricing?.tier === 'elite' && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-stone-900 border-none animate-pulse">
                      <Trophy className="h-3 w-3 mr-1" /> Elite
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-stone-400">Review your custom configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-300">
                    <span>Base: {selectedPackage?.name}</span>
                    <span>${pricing?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Add-ons ({selectedAddonIds.length})</span>
                    <span>${pricing?.addonsTotal.toLocaleString()}</span>
                  </div>
                  {pricing?.discountAmount ? (
                    <div className="flex justify-between text-green-400 font-bold">
                      <span>Wildlife Bundle Discount (5%)</span>
                      <span>-${pricing.discountAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>

                <div className="pt-4 border-t border-stone-700">
                  <div className="flex justify-between items-end">
                    <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Total Investment</span>
                    <div className="text-4xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-500">
                      ${pricing?.finalTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-stone-900/50 p-6">
                <Button className="w-full bg-accent text-stone-900 hover:bg-accent/90 font-black h-14 text-lg rounded-xl transition-all hover:scale-[1.02]" onClick={handleBooking}>
                  REQUEST ITINERARY <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center p-4">
              <p className="text-xs text-stone-500 italic">
                * All custom safaris are subject to seasonal availability. Prices represent estimated group investments per person.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
