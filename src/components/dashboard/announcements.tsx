
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
}

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Announcement[];
        setAnnouncements(data);
      } catch (err) {
        console.error("Fetch announcements error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
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
                  {item.priority || 'Medium'} Priority
                </Badge>
              </div>
              <CardDescription className="flex items-center text-xs mt-1">
                <Calendar className="w-3 h-3 mr-1" /> Posted on {item.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
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
