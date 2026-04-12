'use client';

import * as React from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus,
  ShieldCheck,
  Ban,
  Loader2,
  CheckCircle2,
  Plus,
  Briefcase,
  Trash2,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// --- Add User Modal ---
function AddUserModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (data: any) => Promise<void> }) {
  const [form, setForm] = React.useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', role: 'DESIGNER'
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError('Required fields (*) are missing.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'DESIGNER' });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-6 space-y-4 rounded-xl shadow-2xl border-border/40 backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Add Staff Account</DialogTitle>
        </DialogHeader>

        {error && <p className="text-[11px] text-destructive bg-destructive/10 px-3 py-2 rounded-lg font-bold">{error}</p>}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name *</label>
              <Input placeholder="Janak" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="h-9 px-3 text-sm rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name *</label>
              <Input placeholder="Sah" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="h-9 px-3 text-sm rounded-lg" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email *</label>
            <Input type="email" placeholder="name@persomith.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="h-9 px-3 text-sm rounded-lg" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Password *</label>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="h-9 px-3 text-sm rounded-lg" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone</label>
            <Input placeholder="+977" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="h-9 px-3 text-sm rounded-lg" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-full font-bold h-10 text-xs">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="flex-1 rounded-full font-bold h-10 text-xs gap-2">
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            {saving ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [usersList, setUsersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => { fetchUsers(); }, []);

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
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const changeRole = async (user: any, newRole: string) => {
    try {
      await adminApi.updateUserRole(user.id, { role: newRole });
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleAddDesigner = async (data: any) => {
    const res = await adminApi.createDesignerAccount(data);
    if (!res.success) throw new Error(res.message);
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const filteredUsers = usersList.filter(user => {
    if (activeTab !== 'all' && user.role.toLowerCase() !== activeTab.slice(0, -1)) return false;
    if (search && !`${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddDesigner} />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-lg">Delete user permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove <span className="font-bold text-foreground">{deleteTarget?.firstName} {deleteTarget?.lastName}</span> ({deleteTarget?.email}) and all their data from the database. This action <span className="font-bold text-destructive">cannot be undone</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-bold text-xs h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="rounded-full font-bold text-xs h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              {deleting ? 'Deleting...' : 'Delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage platform members, roles, and access controls.</p>
          </div>
          <Button className="font-bold gap-2 rounded-full h-10 px-6 shadow-sm" onClick={() => setShowAddModal(true)}>
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        <Card className="border-border/40 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="border-b border-border/40 bg-muted/20 py-3 px-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
                <TabsList className="bg-muted/60 p-1 h-8 border border-border/40">
                  <TabsTrigger value="all" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">All Users</TabsTrigger>
                  <TabsTrigger value="customers" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">Customers</TabsTrigger>
                  <TabsTrigger value="designers" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">Designers</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 w-60 bg-background border-border/60 text-xs" 
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8">
                   <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="h-10 border-b border-border/40">
                  <TableHead className="font-bold text-xs pl-6">Identity</TableHead>
                  <TableHead className="font-bold text-xs">Role</TableHead>
                  <TableHead className="font-bold text-xs">Status</TableHead>
                  <TableHead className="font-bold text-xs text-center">Engagement</TableHead>
                  <TableHead className="text-right font-bold text-xs pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-xs">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin mb-1.5" />
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-xs">No users found.</TableCell>
                  </TableRow>
                ) : filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/10 transition-colors h-14">
                    <TableCell className="pl-6 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[13px] leading-none">{user.firstName} {user.lastName}</span>
                          <span className="text-[11px] text-muted-foreground mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold border-none text-[9px] px-2 h-5 rounded-full ${
                        user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500' : 
                        user.role === 'DESIGNER' ? 'bg-orange-500/10 text-orange-500' : 
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${!user.isVerified ? 'bg-amber-500 animate-pulse' : user.isActive ? 'bg-emerald-500' : 'bg-destructive'}`} />
                        <span className={`text-[11px] font-bold ${!user.isVerified ? 'text-amber-500' : user.isActive ? 'text-emerald-500' : 'text-destructive'}`}>
                          {!user.isVerified ? 'Verification Pending' : user.isActive ? 'Active' : 'Locked'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xs leading-none">{user.orderCount ?? 0}</span>
                          <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Orders</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xs leading-none">{user.designCount ?? 0}</span>
                          <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Designs</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-muted rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-xs font-medium" onClick={() => changeRole(user, user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}>
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Promote/Revoke Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-xs font-medium" onClick={() => changeRole(user, user.role === 'DESIGNER' ? 'CUSTOMER' : 'DESIGNER')}>
                            <Briefcase className="h-3.5 w-3.5 text-orange-500" /> Toggle Designer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-xs text-destructive font-bold focus:bg-destructive/10" onClick={() => toggleUserStatus(user)}>
                            {user.isActive ? <><Ban className="h-3.5 w-3.5" /> Suspend</> : <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Activate</>}
                          </DropdownMenuItem>
                          {user.role !== 'ADMIN' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 rounded-lg py-1.5 text-xs text-destructive font-black focus:bg-destructive/10"
                                onClick={() => setDeleteTarget(user)}
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete user
                              </DropdownMenuItem>
                            </>
                          )}
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
    </>
  );
}
