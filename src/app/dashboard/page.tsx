
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  MessageSquare, 
  FileText, 
  Mountain, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  User, 
  Download, 
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { signOut } from 'next-auth/react';

// Sections components defined below for cleaner structure
import DashboardAnnouncements from '@/components/dashboard/announcements';
import DashboardDocuments from '@/components/dashboard/documents';
import DashboardChat from '@/components/dashboard/chat';
import DashboardTrips from '@/components/dashboard/trips';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [ref, isVisible] = useScrollAnimation();

  const user = session?.user;

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Header Profile Section */}
      <section ref={ref} className={cn('scroll-animate bg-card border rounded-2xl p-6 shadow-sm', isVisible && 'scroll-animate-in')}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Avatar className="h-24 w-24 border-4 border-accent shadow-lg">
              <AvatarImage src={user.image || undefined} alt={user.name || 'Traveler'} />
              <AvatarFallback className="text-2xl">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="font-headline text-3xl font-black text-primary">{user.name}</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Explorer
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Button variant="outline" size="sm" className="rounded-full"><User className="w-4 h-4 mr-2" /> Profile</Button>
                <Button variant="outline" size="sm" className="rounded-full"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-destructive" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          <Card className="w-full md:w-auto bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Impact Points</p>
              <p className="text-4xl font-black text-accent">1,250</p>
              <p className="text-xs font-bold">Gold Level Explorer</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <TabsList className="bg-muted/50 p-1 rounded-full inline-flex">
            <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mountain className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" /> My Documents
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" /> Support Chat
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-8">
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <DashboardTrips />
              </div>
              <div className="space-y-8">
                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /> Latest News</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Check the Announcements tab for important tour updates and seasonal offers.</p>
                    <Button variant="link" onClick={() => setActiveTab('announcements')} className="p-0 text-accent font-bold">View all updates &rarr;</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary" /> Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Our support team is online. Start a conversation if you have any questions about your upcoming trips.</p>
                    <Button className="w-full bg-primary" onClick={() => setActiveTab('chat')}>Open Support Chat</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <DashboardAnnouncements />
          </TabsContent>

          <TabsContent value="documents">
            <DashboardDocuments />
          </TabsContent>

          <TabsContent value="chat">
            <DashboardChat />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
