'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Home
} from 'lucide-react';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/authContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

const PAGE_NAMES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/products': 'Product Management',
  '/admin/orders': 'Order Management',
  '/admin/designs': 'Design Management',
  '/admin/shipping': 'Shipping Control',
  '/admin/production': 'Production Queue',
  '/admin/finance': 'Finance & Payments',
  '/admin/marketing': 'Marketing & Promotions',
  '/admin/analytics': 'Reports & Analytics',
  '/admin/cms': 'Content Management',
  '/admin/settings': 'Global Settings',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      if (!user || String(user.role).toUpperCase() !== 'ADMIN') {
        router.push('/');
      } else if (user.mustChangePassword) {
        router.push('/auth/onboarding');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user || String(user.role).toUpperCase() !== 'ADMIN' || user.mustChangePassword) {
    return null;
  }

  // Find best matching breadcrumb name
  const pageName = PAGE_NAMES[pathname] ?? PAGE_NAMES[Object.keys(PAGE_NAMES).find(k => k !== '/admin' && pathname.startsWith(k)) ?? ''] ?? 'Admin';

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-[1px] bg-border/60 mx-1" />
          <div className="hidden md:flex flex-1 items-center gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin" className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== '/admin' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 md:hidden" />
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9 rounded-full"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-muted/60 rounded-full h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border border-primary/20 flex items-center justify-center text-primary-foreground text-xs font-bold ring-2 ring-primary/10 transition-all hover:scale-105 cursor-pointer">
              {user.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        <main className="p-2">
          <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

