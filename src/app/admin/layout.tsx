
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, FileText, Image as ImageIcon, MessageSquare, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import React from 'react';

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
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <RotarySpinner size={28} className="text-primary" />
            <span className="text-xl font-semibold text-primary">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation - Vertically Centered */}
        <nav className="flex flex-grow flex-col justify-center px-4">
          <ul className="flex flex-col gap-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-secondary-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64"> {/* pl-64 to offset for the fixed sidebar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          {/* This header can contain breadcrumbs, user menu, search, etc. in the future */}
          <div className="flex-1">
            {/* Placeholder for future header content, e.g., page title or user actions */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Developer Note:</p>
            <p>Admin authentication is currently bypassed for testing. Remember to re-enable security checks.</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
