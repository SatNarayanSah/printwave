'use client';

import * as React from 'react';
import {
  FileText, Image, Type, Save, Plus, Trash2, Edit3, Eye, Loader2, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

// Static CMS blocks — In a real production app these would be fetched/updated via an /api/admin/cms endpoint.
// They demonstrate how the system would work and provide real editing UI.
const INITIAL_PAGES = [
  { id: 'home', title: 'Home Page', slug: '/', status: 'Published', lastEdited: '2 days ago' },
  { id: 'about', title: 'About Persomith', slug: '/about', status: 'Published', lastEdited: '5 days ago' },
  { id: 'faq', title: 'FAQ', slug: '/faq', status: 'Draft', lastEdited: '1 week ago' },
  { id: 'contact', title: 'Contact Us', slug: '/contact', status: 'Published', lastEdited: '3 days ago' },
  { id: 'privacy', title: 'Privacy Policy', slug: '/privacy', status: 'Published', lastEdited: '1 month ago' },
  { id: 'terms', title: 'Terms of Service', slug: '/terms', status: 'Draft', lastEdited: '2 weeks ago' },
];

const BANNER_CONFIG = {
  heading: 'Custom Prints, रू Your Way',
  subheading: 'Premium quality Mithila-inspired custom printing for Nepal.',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  backgroundGradient: 'from-primary/20 via-background to-background',
};

function InlineEdit({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(value);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onSave(val);
    setEditing(false);
    setSaving(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input value={val} onChange={e => setVal(e.target.value)} className="h-8 text-sm flex-1" autoFocus />
        <Button size="sm" className="h-8 gap-1 font-bold" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-sm font-semibold">{val}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setEditing(true)}
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default function CMSPage() {
  const [pages, setPages] = React.useState(INITIAL_PAGES);
  const [banner, setBanner] = React.useState(BANNER_CONFIG);
  const [newPage, setNewPage] = React.useState({ title: '', slug: '' });
  const [savingBanner, setSavingBanner] = React.useState(false);
  const [bannerSaved, setBannerSaved] = React.useState(false);

  const saveBanner = async () => {
    setSavingBanner(true);
    await new Promise(r => setTimeout(r, 600));
    setSavingBanner(false);
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2000);
  };

  const togglePageStatus = (id: string) => {
    setPages(p => p.map(page =>
      page.id === id
        ? { ...page, status: page.status === 'Published' ? 'Draft' : 'Published', lastEdited: 'Just now' }
        : page
    ));
  };

  const deletePage = (id: string) => {
    setPages(p => p.filter(page => page.id !== id));
  };

  const addPage = () => {
    if (!newPage.title || !newPage.slug) return;
    setPages(p => [...p, {
      id: newPage.slug.replace(/\//g, ''),
      title: newPage.title,
      slug: newPage.slug.startsWith('/') ? newPage.slug : `/${newPage.slug}`,
      status: 'Draft',
      lastEdited: 'Just now',
    }]);
    setNewPage({ title: '', slug: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Content Management</h1>
        <p className="text-muted-foreground mt-1">Manage site pages, banners, and content blocks.</p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="bg-muted/60 p-1 mb-6">
          {[
            { value: 'pages', label: 'Pages', icon: FileText },
            { value: 'banner', label: 'Hero Banner', icon: Image },
            { value: 'text', label: 'Content Blocks', icon: Type },
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

        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card className="border-border/40 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Page Title (e.g. About Us)"
                  value={newPage.title}
                  onChange={e => setNewPage(v => ({ ...v, title: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  placeholder="Slug (e.g. /about)"
                  value={newPage.slug}
                  onChange={e => setNewPage(v => ({ ...v, slug: e.target.value }))}
                  className="flex-1"
                />
                <Button onClick={addPage} disabled={!newPage.title || !newPage.slug} className="gap-2 font-bold rounded-full px-5">
                  <Plus className="h-4 w-4" /> Add Page
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold"><FileText className="h-5 w-5" /> Site Pages</CardTitle>
              <CardDescription>Manage all content pages on the site.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="pl-6 font-bold">Page Title</TableHead>
                    <TableHead className="font-bold">Slug</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Last Edited</TableHead>
                    <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map(page => (
                    <TableRow key={page.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="pl-6 font-bold">{page.title}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{page.slug}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-bold border-none cursor-pointer ${page.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
                          onClick={() => togglePageStatus(page.id)}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{page.lastEdited}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={page.slug} target="_blank" rel="noopener noreferrer" title="Preview">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => deletePage(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banner Tab */}
        <TabsContent value="banner">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold"><Image className="h-5 w-5" /> Hero Banner Settings</CardTitle>
              <CardDescription>Control the main homepage hero section content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Live Preview */}
              <div className={`rounded-2xl bg-gradient-to-r ${banner.backgroundGradient} p-8 border border-border/40 mb-4`}>
                <h2 className="text-2xl font-black text-foreground mb-1">{banner.heading}</h2>
                <p className="text-muted-foreground text-sm mb-4">{banner.subheading}</p>
                <Button className="rounded-full font-bold px-6">{banner.ctaText}</Button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Heading', key: 'heading' as const },
                  { label: 'Subheading', key: 'subheading' as const },
                  { label: 'CTA Button Text', key: 'ctaText' as const },
                  { label: 'CTA Button Link', key: 'ctaLink' as const },
                ].map(field => (
                  <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-semibold text-muted-foreground">{field.label}</label>
                    <Input
                      value={banner[field.key]}
                      onChange={e => setBanner(b => ({ ...b, [field.key]: e.target.value }))}
                      className="col-span-3 h-9 bg-muted/30 border-border/40"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={saveBanner} disabled={savingBanner} className="gap-2 rounded-full px-6 font-bold">
                  {savingBanner ? <Loader2 className="h-4 w-4 animate-spin" /> : bannerSaved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
                  {savingBanner ? 'Saving...' : bannerSaved ? 'Saved!' : 'Save Banner'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Blocks Tab */}
        <TabsContent value="text">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold"><Type className="h-5 w-5" /> Content Blocks</CardTitle>
              <CardDescription>Editable text blocks used across the site — hover to edit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { section: 'Footer Tagline', initial: 'Premium quality print-on-demand from the heart of Mithila.' },
                { section: 'Return Policy Summary', initial: 'Returns accepted within 7 days of delivery. Custom prints are non-refundable.' },
                { section: 'Shipping Info', initial: 'Free shipping on orders above रू 3000. Delivery within 3-5 business days.' },
                { section: 'About Blurb (Homepage)', initial: 'Persomith is Nepal\'s first premium print-on-demand platform, inspired by Mithila art.' },
              ].map(block => (
                <div key={block.section} className="p-4 rounded-xl border border-border/40 bg-muted/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{block.section}</p>
                  <InlineEdit value={block.initial} onSave={v => console.log(`${block.section} saved:`, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
