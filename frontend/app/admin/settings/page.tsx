'use client';

import * as React from 'react';
import {
  Settings, Globe, CreditCard, Bell, Shield, Palette, Save, Loader2, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingField { label: string; key: string; value: string; type?: string; placeholder?: string; }

function SettingsSection({ title, fields, onSave }: { title: string; fields: SettingField[]; onSave: (data: Record<string, string>) => void }) {
  const [values, setValues] = React.useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.key, f.value]))
  );
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simulate save
    onSave(values);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.key} className="grid grid-cols-3 items-center gap-4">
          <label className="text-sm font-semibold text-muted-foreground col-span-1">{field.label}</label>
          <Input
            type={field.type || 'text'}
            value={values[field.key]}
            placeholder={field.placeholder}
            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
            className="col-span-2 h-9 bg-muted/30 border-border/40"
          />
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-full px-6 font-bold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const generalFields: SettingField[] = [
    { label: 'Business Name', key: 'name', value: 'Persomith', placeholder: 'Your business name' },
    { label: 'Support Email', key: 'email', value: 'support@persomith.com', placeholder: 'support@example.com' },
    { label: 'Phone Number', key: 'phone', value: '+977-41-123456', placeholder: '+977-...' },
    { label: 'Address', key: 'address', value: 'Janakpur, Province No. 2, Nepal', placeholder: 'City, Country' },
    { label: 'Website URL', key: 'url', value: 'https://persomith.com', placeholder: 'https://...' },
  ];

  const paymentFields: SettingField[] = [
    { label: 'eSewa Merchant ID', key: 'esewa_id', value: 'EPAYTEST', placeholder: 'eSewa merchant code' },
    { label: 'Khalti Secret Key', key: 'khalti_key', value: '', type: 'password', placeholder: 'Khalti live secret key' },
    { label: 'IME Pay Token', key: 'imepay_token', value: '', type: 'password', placeholder: 'IME Pay token' },
    { label: 'COD', key: 'cod_enabled', value: 'Enabled', placeholder: '' },
    { label: 'Tax Rate (%)', key: 'tax_rate', value: '13', placeholder: '13' },
  ];

  const notificationFields: SettingField[] = [
    { label: 'SMTP Host', key: 'smtp_host', value: 'smtp.gmail.com', placeholder: 'smtp.example.com' },
    { label: 'SMTP Port', key: 'smtp_port', value: '587', placeholder: '587' },
    { label: 'SMTP User', key: 'smtp_user', value: 'noreply@persomith.com', placeholder: 'email@example.com' },
    { label: 'SMTP Password', key: 'smtp_pass', value: '', type: 'password', placeholder: 'App password' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Global Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide settings for Persomith.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/60 p-1 mb-6">
          {[
            { value: 'general', label: 'General', icon: Globe },
            { value: 'payments', label: 'Payments', icon: CreditCard },
            { value: 'notifications', label: 'Notifications', icon: Bell },
            { value: 'security', label: 'Security', icon: Shield },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-md px-5 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> General Information</CardTitle>
              <CardDescription>Basic business profile settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsSection title="General" fields={generalFields} onSave={(d) => console.log('General saved:', d)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Gateways</CardTitle>
              <CardDescription>Configure eSewa, Khalti, IME Pay, and COD.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {['eSewa', 'Khalti', 'IME Pay', 'COD', 'Bank Transfer'].map(gw => (
                  <Badge key={gw} className="bg-emerald-500/10 text-emerald-500 border-none font-bold">{gw} ✓</Badge>
                ))}
              </div>
              <SettingsSection title="Payments" fields={paymentFields} onSave={(d) => console.log('Payment saved:', d)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Email & Notification Settings</CardTitle>
              <CardDescription>SMTP configuration for automated emails.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsSection title="Notifications" fields={notificationFields} onSave={(d) => console.log('Notifications saved:', d)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security Settings</CardTitle>
              <CardDescription>Password policy, session management, and 2FA configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Min Password Length', value: '8 characters', status: 'Configured' },
                { label: 'Two-Factor Auth (2FA)', value: 'Optional for all users', status: 'Optional' },
                { label: 'Session Timeout', value: '24 hours', status: 'Active' },
                { label: 'Login Rate Limiting', value: '5 attempts / 15 min', status: 'Active' },
                { label: 'JWT Secret Rotation', value: 'Manual', status: 'Manual' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10">
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.value}</p>
                  </div>
                  <Badge className={`font-bold text-[10px] border-none ${item.status === 'Active' || item.status === 'Configured' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
