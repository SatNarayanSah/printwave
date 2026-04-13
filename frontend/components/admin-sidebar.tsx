'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Palette,
  ShoppingCart,
  Truck,
  Printer,
  CircleDollarSign,
  Megaphone,
  BarChart3,
  Settings,
  FileText,
  ChevronRight,
  LogOut,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/authContext';

const NAV_ITEMS = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
    items: [
      { title: 'All Users', url: '/admin/users' },
      { title: 'Customers', url: '/admin/users/customers' },
      { title: 'Designers', url: '/admin/users/designers' },
    ],
  },
  {
    title: 'Product Management',
    url: '/admin/products',
    icon: Package,
    items: [
      { title: 'All Products', url: '/admin/products' },
      { title: 'Categories', url: '/admin/products/categories' },
      { title: 'Variants', url: '/admin/products/variants' },
    ],
  },
  {
    title: 'Design Management',
    url: '/admin/designs',
    icon: Palette,
    items: [
      { title: 'All Designs', url: '/admin/designs' },
      { title: 'Approval Queue', url: '/admin/designs/approval' },
      { title: 'Designer Earnings', url: '/admin/designs/earnings' },
    ],
  },
  {
    title: 'Order Management',
    url: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Shipping Control',
    url: '/admin/shipping',
    icon: Truck,
  },
  {
    title: 'Production',
    url: '/admin/production',
    icon: Printer,
  },
  {
    title: 'Finance',
    url: '/admin/finance',
    icon: CircleDollarSign,
  },
  {
    title: 'Marketing',
    url: '/admin/marketing',
    icon: Megaphone,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Content CMS',
    url: '/admin/cms',
    icon: FileText,
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Palette className="h-5 w-5" />
          </div>
          <span className="font-black tracking-tight text-xl">PERSOMITH</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === '/admin'
                        ? pathname === '/admin'
                        : pathname === item.url || pathname.startsWith(item.url + '/')
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-bold uppercase">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold truncate">{user?.name || 'Admin'}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email || 'admin@persomith.com'}</span>
              </div>
            </div>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
