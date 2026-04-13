'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Info,
  Settings2,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  Upload,
  X,
  CloudUpload,
  Trash2,
  Plus
} from 'lucide-react';
import { adminApi, categoriesApi, designsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: string;
  fabric: string;
  gsm: string;
  styleCode: string;
  gender: string;
  fit: string;
  neckline: string;
  sleeve: string;
  weight: string;
  isCustomizable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrls: string;
}

const EMPTY_FORM: ProductForm = {
  name: '', slug: '', description: '', categoryId: '', basePrice: '',
  fabric: 'Cotton', gsm: '180', styleCode: '', gender: 'Unisex', fit: 'Regular',
  neckline: 'Crew', sleeve: 'Short', weight: '',
  isCustomizable: true, isActive: true, isFeatured: false, isDigital: false,
  metaTitle: '', metaDescription: '', imageUrls: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = React.useState<ProductForm>(EMPTY_FORM);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Quick Category Add State
  const [showCatModal, setShowCatModal] = React.useState(false);
  const [newCat, setNewCat] = React.useState({ name: '', slug: '', description: '' });
  const [catSaving, setCatSaving] = React.useState(false);
  const [catError, setCatError] = React.useState('');

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const set = (k: keyof ProductForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSlugify = (name: string) => {
    set('name', name);
    set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.list();
      const cats = res.data || [];
      setCategories(cats);
      return cats;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCat.name || !newCat.slug) return setCatError('Name and Slug are required');
    setCatSaving(true);
    setCatError('');
    try {
      const res = await adminApi.createCategory(newCat);
      const created = res.data as any;
      const allCats = await fetchCategories();
      
      // Auto-select newly created category if ID is available
      if (created?.id) {
        set('categoryId', String(created.id));
      } else if (newCat.slug) {
        const found = allCats.find((c: any) => c.slug === newCat.slug);
        if (found) set('categoryId', String(found.id));
      }
      
      setShowCatModal(false);
      setNewCat({ name: '', slug: '', description: '' });
    } catch (e: any) {
      setCatError(e?.message || 'Failed to create category');
    } finally {
      setCatSaving(false);
    }
  };

  const handleSubmit = async () => {
    const missing = [];
    if (!form.name?.trim()) missing.push('Product Name');
    if (!form.slug?.trim()) missing.push('Product Slug');
    if (!form.basePrice?.toString().trim()) missing.push('Base Price');
    if (!form.categoryId) missing.push('Category');

    if (missing.length > 0) {
      setError(`${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setError('');
    setSaving(true);
    try {
      // 1. Upload images in parallel
      const uploadPromises = selectedFiles.map(file =>
        designsApi.upload({ file, name: `${form.name} Asset` })
      );

      const uploadResults = await Promise.all(uploadPromises);
      const imageUrlsFromUpload = uploadResults.map(res => (res.data as any).fileUrl);

      // 2. Combine with manual URLs if any
      const manualUrls = form.imageUrls.split(',')
        .map(url => url.trim())
        .filter(Boolean);

      const allUrls = [...imageUrlsFromUpload, ...manualUrls];

      const images = allUrls.map((url, i) => ({
        url,
        altText: form.name,
        sortOrder: i,
        isPrimary: i === 0
      }));

      await adminApi.createProduct({
        ...form,
        basePrice: parseFloat(form.basePrice) || 0,
        gsm: parseInt(form.gsm) || 180,
        weight: parseFloat(form.weight) || 0,
        images,
      });

      router.push('/admin/products');
    } catch (e: any) {
      setError(e?.message || 'Failed to establish product entity in system.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2 ">
      <Dialog open={showCatModal} onOpenChange={setShowCatModal}>
        <DialogPortal>
          <DialogOverlay className="bg-foreground/40 backdrop-blur-none z-[100]" />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-background border border-primary/20 rounded-2xl shadow-2xl w-full max-w-md sm:w-[448px] min-w-[320px] overflow-hidden flex flex-col relative">
              <div className="p-6 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-primary">Add New Category</h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Register new catalog node</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setShowCatModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                {catError && <p className="text-[10px] font-bold text-destructive bg-destructive/5 px-3 py-2 rounded-lg border border-destructive/10 uppercase tracking-tighter">{catError}</p>}
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block tracking-wider">Category Name</label>
                  <Input
                    placeholder="e.g. Premium Oversized"
                    value={newCat.name}
                    onChange={e => {
                      const n = e.target.value;
                      const s = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewCat(prev => ({ ...prev, name: n, slug: s }));
                    }}
                    className="font-bold border-primary/10 focus:border-primary/40 focus:ring-primary/20 bg-primary/5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block tracking-wider">Description</label>
                  <textarea
                    placeholder="Optional categorization details..."
                    value={newCat.description}
                    onChange={e => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full min-h-[80px] rounded-xl border border-primary/10 bg-muted/5 px-3 py-2 text-xs font-medium resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>
              <div className="p-4 bg-primary/5 border-t border-primary/10 flex justify-end gap-2">
                <Button variant="ghost" className="text-[10px] font-black uppercase px-4 h-9 hover:bg-primary/10 transition-colors" onClick={() => setShowCatModal(false)}>Cancel</Button>
                <Button onClick={handleCreateCategory} disabled={catSaving} className="text-[10px] font-black uppercase px-6 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_8px_16px_-6px_rgba(var(--primary),0.3)]">
                  {catSaving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />}
                  {catSaving ? 'Creating...' : 'Register'}
                </Button>
              </div>
            </div>
          </div>
        </DialogPortal>
      </Dialog>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/95  z-10 py-4 -mx-4 px-4 border-b border-border/20">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 border-border/60"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Create Base Product</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">New Inventory Node Initialization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-full font-black text-[10px] uppercase tracking-widest px-6 h-10"
            onClick={() => router.back()}
          >
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-full font-black text-[10px] uppercase tracking-widest px-8 h-10 gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Syncing...' : 'Establish Product'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <Info className="h-5 w-5 text-destructive" />
          <p className="text-xs font-black uppercase tracking-wider text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Core Data */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Identification */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                <Package className="h-3 w-3" /> Core Identity
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Commercial Product Name *</label>
                  <Input
                    placeholder="e.g. Classic Mithila Unisex Heavyweight T-Shirt"
                    value={form.name}
                    onChange={e => handleSlugify(e.target.value)}
                    className="h-11 font-bold text-base bg-muted/5 border-border/60 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Uniform Resource Slug (Automated) *</label>
                  <Input
                    placeholder="classic-heavyweight-t-shirt"
                    value={form.slug}
                    onChange={e => set('slug', e.target.value)}
                    className="h-10 font-mono text-xs font-bold bg-muted/20"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Catalog Placement *</label>
                  <div className="flex gap-2">
                    <select
                      value={form.categoryId}
                      onChange={e => set('categoryId', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-border/60 bg-muted/5 px-3 py-1 text-sm font-bold shadow-sm transition-colors focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Target Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 border-border/60 hover:bg-primary/5 hover:text-primary transition-all rounded-md"
                      onClick={() => setShowCatModal(true)}
                      title="Add New Category"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Commercial Narrative (Description)</label>
                  <textarea
                    placeholder="Craft a compelling story for this product..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="w-full min-h-[150px] rounded-xl border border-border/60 bg-muted/5 px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specs */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                <Settings2 className="h-3 w-3" /> Technical Specifications
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Fabric Composition</label>
                  <Input placeholder="100% Cotton" value={form.fabric} onChange={e => set('fabric', e.target.value)} className="font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Density (GSM)</label>
                  <Input type="number" placeholder="180" value={form.gsm} onChange={e => set('gsm', e.target.value)} className="font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Model Reference (StyleCode)</label>
                  <Input placeholder="BC-3001" value={form.styleCode} onChange={e => set('styleCode', e.target.value)} className="font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Gender Orientation</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)} className="flex h-10 w-full rounded-md border border-border/60 bg-muted/5 px-3 py-1 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary">
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Fit Architecture</label>
                  <select value={form.fit} onChange={e => set('fit', e.target.value)} className="flex h-10 w-full rounded-md border border-border/60 bg-muted/5 px-3 py-1 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary">
                    <option value="Regular">Regular</option>
                    <option value="Slim">Slim</option>
                    <option value="Oversized">Oversized</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Neckline Style</label>
                  <Input placeholder="Crew Neck" value={form.neckline} onChange={e => set('neckline', e.target.value)} className="font-semibold" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visibility Optimization */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                <Search className="h-3 w-3" /> SEO Visibility Architecture
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Metadata Title (SEO)</label>
                <Input placeholder="SEO Optimized Title" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} className="font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Metadata Description (SEO)</label>
                <textarea
                  placeholder="Summarize product for search crawlers..."
                  value={form.metaDescription}
                  onChange={e => set('metaDescription', e.target.value)}
                  className="w-full min-h-[80px] rounded-xl border border-border/60 bg-muted/5 px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Logistics & Assets */}
        <div className="space-y-8">
          {/* Commercials */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                Commercial Parameters
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Base Cost Node (रू) *</label>
                <Input type="number" placeholder="799.00" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} className="h-12 font-black text-xl text-primary bg-primary/5 border-primary/20" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block tracking-wider">Logistic Weight (Grams)</label>
                <Input type="number" placeholder="250" value={form.weight} onChange={e => set('weight', e.target.value)} className="font-bold" />
              </div>
            </CardContent>
          </Card>

          {/* Asset Pipeline */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Image Asset Pipeline
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              {/* File Upload Area */}
              <div
                className="group relative p-8 border-2 border-dashed border-border/40 rounded-2xl bg-muted/5 hover:bg-muted/10 hover:border-primary/40 transition-all cursor-pointer text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CloudUpload className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Upload Inventory Assets</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Select PNG, JPG, or WEBP files</p>
                </div>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {previews.map((preview, i) => (
                    <div key={i} className="group relative aspect-square rounded-lg bg-muted border border-border/20 overflow-hidden shadow-sm">
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-border/20">
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block tracking-wider">Historical/Remote URLs</label>
                <textarea
                  placeholder="Paste backup URLs (comma separated)..."
                  value={form.imageUrls}
                  onChange={e => set('imageUrls', e.target.value)}
                  className="w-full min-h-[60px] rounded-xl border border-border/60 bg-muted/5 px-3 py-2 text-[10px] font-mono leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Node Status Switches */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-3 border-b border-border/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                Entity Parameters
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer border border-transparent hover:border-border/20">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider">Customizable Node</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Allow designer overlay</p>
                </div>
                <input type="checkbox" checked={form.isCustomizable} onChange={e => set('isCustomizable', e.target.checked)} className="h-4 w-4 rounded-full accent-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer border border-transparent hover:border-border/20">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider">Production Active</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Sync to public catalog</p>
                </div>
                <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="h-4 w-4 rounded-full accent-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer border border-transparent hover:border-border/20">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider">Global Featured</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Promote on dashboard</p>
                </div>
                <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="h-4 w-4 rounded-full accent-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer border border-transparent hover:border-border/20">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider">Pure Digital Spec</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Asset-only, no logistics</p>
                </div>
                <input type="checkbox" checked={form.isDigital} onChange={e => set('isDigital', e.target.checked)} className="h-4 w-4 rounded-full accent-primary" />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
