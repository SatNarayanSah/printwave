'use client';

import * as React from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Palette,
  Eye,
  Settings2,
  MoreVertical,
  Trash2,
  Loader2,
  PackageX,
  X,
  Save
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  fabric: string;
  gsm: string;
  isCustomizable: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '', slug: '', description: '', basePrice: '',
  fabric: 'Cotton', gsm: '180', isCustomizable: true, isFeatured: false,
};

function AddProductModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (data: ProductForm) => Promise<void> }) {
  const [form, setForm] = React.useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const set = (k: keyof ProductForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSlugify = (name: string) => {
    set('name', name);
    set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.basePrice) {
      setError('Name, slug, and price are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      setForm(EMPTY_FORM);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create product.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border/60 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Add New Product</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Product Name *</label>
              <Input placeholder="e.g. Classic Mithila T-Shirt" value={form.name} onChange={e => handleSlugify(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Slug *</label>
              <Input placeholder="classic-mithila-t-shirt" value={form.slug} onChange={e => set('slug', e.target.value)} className="font-mono" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Base Price (रू) *</label>
              <Input type="number" placeholder="799" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Fabric</label>
              <Input placeholder="Cotton" value={form.fabric} onChange={e => set('fabric', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">GSM</label>
              <Input type="number" placeholder="180" value={form.gsm} onChange={e => set('gsm', e.target.value)} />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isCustomizable} onChange={e => set('isCustomizable', e.target.checked)} className="rounded" />
                <span className="text-sm font-semibold">Customizable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="rounded" />
                <span className="text-sm font-semibold">Featured</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Description</label>
              <textarea 
                placeholder="Product description..." 
                value={form.description} 
                onChange={e => set('description', e.target.value)}
                className="w-full min-h-[80px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full font-bold px-5">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="rounded-full font-bold px-6 gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductManagementPage() {
  const [productsList, setProductsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [showAddModal, setShowAddModal] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    adminApi.products()
      .then(res => setProductsList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async (form: ProductForm) => {
    await adminApi.createProduct({
      name: form.name,
      slug: form.slug,
      description: form.description,
      basePrice: parseFloat(form.basePrice),
      fabric: form.fabric || 'Cotton',
      gsm: parseInt(form.gsm) || 180,
      isCustomizable: form.isCustomizable,
      isFeatured: form.isFeatured,
      isActive: true,
    });
    fetchProducts();
  };

  const filteredProducts = productsList.filter(prod => {
    if (categoryFilter !== 'All' && prod.category?.name !== categoryFilter) return false;
    if (search && !prod.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalProducts = productsList.length;
  let activeVariantsCount = 0;
  let lowStockAlertsCount = 0;

  productsList.forEach(prod => {
    const variants = prod.variants || [];
    variants.forEach((v: any) => {
      if (v.stock > 0) activeVariantsCount++;
      if (v.stock > 0 && v.stock < 10) lowStockAlertsCount++;
    });
  });

  const uniqueCategories = ['All', ...Array.from(new Set(productsList.map(p => p.category?.name).filter(Boolean))) as string[]];

  return (
    <>
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreateProduct}
      />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Product Management</h1>
            <p className="text-muted-foreground mt-1">Manage blank products, categories, and inventory variants.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold gap-2 rounded-full">
              <Layers className="h-4 w-4" />
              Categories
            </Button>
            <Button className="font-bold gap-2 rounded-full px-6" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-widest">Total Products</CardDescription>
              <CardTitle className="text-3xl font-black">{loading ? '...' : totalProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-medium">Across {uniqueCategories.length - 1} categories</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-widest">Active Variants</CardDescription>
              <CardTitle className="text-3xl font-black">{loading ? '...' : activeVariantsCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-medium">Sizes and colors in stock</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-widest text-primary">Low Stock Alerts</CardDescription>
              <CardTitle className="text-3xl font-black text-primary">{loading ? '...' : lowStockAlertsCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-primary/70 font-bold">
                {lowStockAlertsCount === 0 ? 'All variants well-stocked' : 'Needs restock immediately'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 <div className="flex flex-wrap gap-1">
                   {uniqueCategories.map((cat) => (
                     <Button 
                       key={cat}
                       variant={categoryFilter === cat ? 'default' : 'outline'} 
                       size="sm" 
                       onClick={() => setCategoryFilter(cat)}
                       className={`h-8 text-xs font-bold rounded-full px-4 ${categoryFilter !== cat ? 'bg-background hover:bg-muted' : ''}`}
                     >
                       {cat}
                     </Button>
                   ))}
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
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
                  <TableHead className="font-bold pl-6">Product Details</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Base Price</TableHead>
                  <TableHead className="font-bold">Variants</TableHead>
                  <TableHead className="font-bold">Stock Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      <PackageX className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                      No products found.{' '}
                      <button onClick={() => setShowAddModal(true)} className="text-primary underline font-bold">Add one?</button>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.map((prod) => {
                  const totalStock = prod.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
                  let status = 'Out of Stock';
                  if (totalStock > 0 && totalStock < 10) status = 'Low Stock';
                  else if (totalStock >= 10) status = 'In Stock';

                  return (
                    <TableRow key={prod.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3 py-1">
                          <div className="h-12 w-12 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground overflow-hidden flex-shrink-0">
                             {prod.imageUrl ? (
                               <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                             ) : (
                               <Package className="h-6 w-6" />
                             )}
                          </div>
                          <div className="flex flex-col max-w-[200px]">
                            <span className="font-bold text-sm tracking-tight truncate" title={prod.name}>{prod.name}</span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                              {prod.fabric || 'Cotton'} · {prod.gsm || '—'}gsm · {prod.isCustomizable ? 'Customizable' : 'Standard'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold border-border/60 text-[10px] uppercase">
                          {prod.category?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-sm">रू {Number(prod.basePrice).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Palette className="h-3 w-3" />
                          {prod.variants?.length || 0} Variants
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`font-bold text-[10px] uppercase tracking-wider border-none
                            ${status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                            ${status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : ''}
                            ${status === 'Out of Stock' ? 'bg-destructive/10 text-destructive' : ''}
                          `}
                          variant="outline"
                        >
                          {status} ({totalStock})
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" title="View on site" asChild>
                            <a href={`/products/${prod.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500" title="Manage variants">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => handleDelete(prod.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
