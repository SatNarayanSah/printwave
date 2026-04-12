'use client';

import * as React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus,
  Mail,
  ShieldCheck,
  Ban,
  Pencil,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { adminApi } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [usersList, setUsersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminApi.users()
      .then(res => setUsersList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const toggleUserStatus = async (user: any) => {
    try {
      await adminApi.updateUserStatus(user.id, { isActive: !user.isActive });
      fetchUsers(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const changeRole = async (user: any, newRole: string) => {
    try {
      await adminApi.updateUserRole(user.id, { role: newRole });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = usersList.filter(user => {
    if (activeTab !== 'all' && user.role.toLowerCase() !== activeTab.slice(0, -1)) {
      return false;
    }
    if (search && !`${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage customers, designers, and staff roles.</p>
        </div>
        <Button className="font-bold gap-2 rounded-full px-6">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
              <TabsList className="bg-muted/60 p-1">
                <TabsTrigger value="all" className="rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">All Users</TabsTrigger>
                <TabsTrigger value="customers" className="rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Customers</TabsTrigger>
                <TabsTrigger value="designers" className="rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Designers</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-64 bg-background" 
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="font-bold pl-6">User</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Joined</TableHead>
                <TableHead className="font-bold">Orders/Portfolio</TableHead>
                <TableHead className="text-right font-bold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-muted to-muted/40 border border-border/60 flex items-center justify-center text-xs font-bold uppercase">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold border-border/60 bg-muted/20 uppercase text-[10px]">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        user.isActive ? 'bg-emerald-500' : 'bg-destructive'
                      }`} />
                      <span className={`text-xs font-semibold ${
                        user.isActive ? 'text-emerald-500' : 'text-destructive'
                      }`}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{user.id ? '...' : '0'}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Items</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl">
                        <DropdownMenuLabel className="text-xs font-bold opacity-70 px-2 py-1.5">User Actions</DropdownMenuLabel>
                        
                        <DropdownMenuItem 
                          className="gap-2 rounded-lg cursor-pointer"
                          onClick={() => changeRole(user, user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                        >
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">
                            {user.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                          </span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="gap-2 rounded-lg cursor-pointer"
                          onClick={() => changeRole(user, user.role === 'DESIGNER' ? 'CUSTOMER' : 'DESIGNER')}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                             {user.role === 'DESIGNER' ? 'Revoke Designer' : 'Make Designer'}
                          </span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          className="gap-2 rounded-lg cursor-pointer text-destructive focus:bg-destructive/10"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.isActive ? (
                            <>
                              <Ban className="h-4 w-4" />
                              <span className="font-bold">Suspend User</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="font-bold text-emerald-500">Activate User</span>
                            </>
                          )}
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
