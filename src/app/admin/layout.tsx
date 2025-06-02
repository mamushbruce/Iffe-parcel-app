
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, FileText, Image as ImageIcon, MessageSquare, Settings, LayoutDashboard, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/admin/posts', label: 'Content Moderation', icon: FileText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/chatrooms', label: 'Chatrooms', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={false}> {/* Sidebar collapsed by default on desktop */}
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar collapsible="icon" side="left" className="border-r bg-background">
          <SidebarHeader className="flex items-center justify-center p-2 py-2 border-b h-14"> {/* Changed py-3 to py-2 */}
            <Link
              href="/admin"
              className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-3 text-lg font-semibold text-primary-foreground md:h-10 md:px-3 md:text-base"
            >
              <RotarySpinner size={20} className="transition-all group-hover:scale-110" />
              {/* Text span will be hidden by SidebarMenuButton logic when collapsed */}
              <span className="font-semibold transition-opacity duration-300 group-data-[state=collapsed]:group-data-[data-collapsible=icon]:sr-only group-data-[state=collapsed]:group-data-[data-collapsible=icon]:opacity-0">
                Admin Panel
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="flex-1">
              <SidebarMenu className="px-2 pb-2 pt-0">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="w-full justify-start"
                      >
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" /> {/* Standardized icon size */}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden"> {/* Hidden on sm and up if sidebar is fixed open */}
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
             {/* Placeholder for breadcrumbs or other header elements */}
             <div className="flex-1">
                {/* <h1 className="text-lg font-semibold">Page Title</h1> */}
             </div>
          </header>
          <SidebarInset> {/* This is the <main> tag for the page content */}
            <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8"> {/* Adjusted padding */}
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md" role="alert">
                <p className="font-bold">Developer Note:</p>
                <p>Admin authentication is currently bypassed for testing. Remember to re-enable security checks.</p>
              </div>
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
