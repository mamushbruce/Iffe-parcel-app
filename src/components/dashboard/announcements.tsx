
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - will be wired to Firestore in the next step
    setTimeout(() => {
      setAnnouncements([
        {
          id: '1',
          title: 'Upcoming Season Schedule Changes',
          content: 'Please be advised that due to seasonal migration patterns, some Serengeti departure times have been adjusted. Check your itineraries for updates.',
          priority: 'high',
          createdAt: new Date().toLocaleDateString()
        },
        {
          id: '2',
          title: 'New Eco-Friendly Gear Partner',
          content: 'We are proud to announce our partnership with "WildGear". All travelers now receive a 15% discount on sustainable safari equipment.',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toLocaleDateString()
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-headline font-black text-primary uppercase">Announcements</h2>
      </div>
      
      {announcements.length > 0 ? (
        announcements.map((item) => (
          <Card key={item.id} className={cn(
            "transition-all duration-300 border-l-4 hover:shadow-md",
            item.priority === 'high' ? "border-l-red-500" : "border-l-accent"
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-primary">{item.title}</CardTitle>
                <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                  {item.priority} Priority
                </Badge>
              </div>
              <CardDescription className="flex items-center text-xs mt-1">
                <Calendar className="w-3 h-3 mr-1" /> Posted on {item.createdAt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No announcements at this time. Check back later!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
