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
      setSaveMsg({ type: 'success', text: 'Profile updated' });
    } catch (e: any) {
      setSaveMsg({ type: 'error', text: e?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) {
      setPwMsg({ type: 'error', text: 'Required fields missing' }); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'Passwords mismatch' }); return;
    }
    setPwSaving(true); setPwMsg(null);
    try {
      await authApi.resetPassword({ token: pwForm.current, password: pwForm.next });
      setPwMsg({ type: 'success', text: 'Password secured' });
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (e: any) {
      setPwMsg({ type: 'error', text: e?.message || 'Access denied' });
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
        <span className="text-[10px] font-black uppercase">Studio Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Account Studio</h1>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Manage your identity and security</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Account Info (read-only) */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden h-fit">
          <CardHeader className="border-b border-border/20 bg-muted/20 py-3 px-5 flex flex-row items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Account DNA</span>
            <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] px-2 h-4 rounded-sm">
              {profile?.role}
            </Badge>
          </CardHeader>
          <CardContent className="px-5 py-2">
            <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
            <InfoRow icon={Shield} label="Account Trust" value={profile?.isVerified ? 'Verified' : 'Pending'} />
            <InfoRow
              icon={User}
              label="Joined Studio"
              value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'New'}
            />
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/20 py-3 px-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Public Identity</span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {saveMsg && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${saveMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                {saveMsg.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {saveMsg.text}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="h-8 px-3 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="h-8 px-3 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-8 pl-8 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full gap-2 rounded-xl font-black text-[10px] uppercase tracking-widest h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              {saving ? 'Syncing...' : 'Update Identity'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden max-w-xl">
        <CardHeader className="border-b border-border/20 bg-muted/20 py-3 px-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
            <Lock className="h-3 w-3" /> Security Access
          </span>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {pwMsg && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${pwMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
              {pwMsg.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {pwMsg.text}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">Current Password (Token)</label>
            <Input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
              className="h-8 px-3 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">New Password</label>
              <Input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                className="h-8 px-3 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1">Confirm</label>
              <Input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="h-8 px-3 text-xs rounded-lg bg-background/50 border-border/40 font-bold"
              />
            </div>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={pwSaving}
            variant="outline"
            className="w-full gap-2 rounded-xl font-black text-[10px] uppercase tracking-widest h-9 border-border/60 hover:bg-muted/40"
          >
            {pwSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lock className="h-3 w-3" />}
            {pwSaving ? 'Securing...' : 'Establish New Access'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

