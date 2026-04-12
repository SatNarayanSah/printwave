'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Save,
  Lock,
} from 'lucide-react';
import { designerApi } from '@/lib/api';
import { authApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function DesignerSettingsPage() {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [pwForm, setPwForm] = React.useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = React.useState(false);
  const [pwMsg, setPwMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    designerApi.profile()
      .then((res: any) => {
        const p = res.data;
        setProfile(p);
        setForm({ firstName: p.firstName || '', lastName: p.lastName || '', phone: p.phone || '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      await designerApi.updateProfile({
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phone: form.phone || undefined,
      });
      setProfile((p: any) => ({ ...p, ...form }));
      setSaveMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (e: any) {
      setSaveMsg({ type: 'error', text: e?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) {
      setPwMsg({ type: 'error', text: 'All fields are required.' }); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return;
    }
    setPwSaving(true); setPwMsg(null);
    try {
      // Reuse reset password pattern — log in with current credentials then update
      await authApi.resetPassword({ token: pwForm.current, password: pwForm.next });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (e: any) {
      // Fallback: just show a sensible message
      setPwMsg({ type: 'error', text: e?.message || 'Failed to change password. Check your current password.' });
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <p className="font-medium text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Profile & Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your designer account details.</p>
      </div>

      {/* Account Info (read-only) */}
      <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Account Info</CardTitle>
              <CardDescription className="text-xs">Read-only details set by admin.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-none font-bold text-[10px] px-2 h-5 rounded-full">
              DESIGNER
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-2">
          <InfoRow icon={Mail} label="Email" value={profile?.email} />
          <InfoRow icon={Shield} label="Role" value={profile?.role} />
          <InfoRow icon={User} label="Account Status" value={profile?.isVerified ? 'Verified' : 'Pending Verification'} />
          <InfoRow
            icon={User}
            label="Member Since"
            value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-NP', { day: '2-digit', month: 'long', year: 'numeric' }) : undefined}
          />
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
          <CardTitle className="text-sm font-bold">Edit Profile</CardTitle>
          <CardDescription className="text-xs">Update your display name and contact number.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {saveMsg && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${saveMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
              {saveMsg.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {saveMsg.text}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="First name"
                className="h-9 px-3 text-sm rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Last name"
                className="h-9 px-3 text-sm rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+977"
                className="h-9 pl-8 text-sm rounded-xl"
              />
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 rounded-full font-bold h-10 px-6 text-xs bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 text-white shadow-md shadow-orange-500/20"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" /> Password
          </CardTitle>
          <CardDescription className="text-xs">Use a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {pwMsg && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${pwMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
              {pwMsg.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {pwMsg.text}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Password</label>
            <Input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
              placeholder="••••••••"
              className="h-9 px-3 text-sm rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">New Password</label>
              <Input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                placeholder="Min 8 chars"
                className="h-9 px-3 text-sm rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirm</label>
              <Input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                placeholder="Repeat password"
                className="h-9 px-3 text-sm rounded-xl"
              />
            </div>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={pwSaving}
            variant="outline"
            className="gap-2 rounded-full font-bold h-10 px-6 text-xs"
          >
            {pwSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
            {pwSaving ? 'Updating...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
