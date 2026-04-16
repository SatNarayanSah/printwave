'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Boxes, Loader2, Package, Palette, Plus, Save, ShieldAlert, Trash2 } from 'lucide-react';

import { adminApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buildProductPayload, createVariant, mapProductToForm, ProductVariantForm, validateProductForm } from '../_lib/product-form';

type VariantManagerProps = {
  product: any;
  onSaved?: () => void;
};

function statTone(stock: number) {
  if (stock <= 0) return 'text-destructive bg-destructive/10';
  if (stock < 10) return 'text-amber-600 bg-amber-500/10';
  return 'text-emerald-600 bg-emerald-500/10';
}

export function VariantManager({ product, onSaved }: VariantManagerProps) {
  const baseForm = React.useMemo(() => mapProductToForm(product), [product]);
  const [variants, setVariants] = React.useState<ProductVariantForm[]>(baseForm.variants);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setVariants(baseForm.variants);
  }, [baseForm]);

  const totalStock = variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
  const lowStockCount = variants.filter((variant) => Number(variant.stock || 0) > 0 && Number(variant.stock || 0) < 10).length;
  const colorFamilies = new Set(variants.map((variant) => variant.color.trim()).filter(Boolean)).size;

  const updateVariant = (index: number, key: keyof ProductVariantForm, value: string) => {
    setVariants((current) =>
      current.map((variant, variantIndex) => (variantIndex === index ? { ...variant, [key]: value } : variant))
    );
  };

  const handleSave = async () => {
    const nextForm = { ...baseForm, variants };
    const validation = validateProductForm(nextForm, { skipImageRequirement: true, skipDesignAreaRequirement: true });
    if (validation.missing.length > 0) {
      setError(validation.missing.join(', '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      await adminApi.updateProduct(product.id, buildProductPayload(nextForm));
      onSaved?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update variants');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-product-shell space-y-6">
      <section className="admin-product-hero">
        <div className="admin-product-grid-bg" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Variant Control
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{product.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Edit sellable combinations, stock levels, SKU hygiene, and pricing adjustments without touching the rest of the product setup.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Total Units</p>
                <p className="mt-2 text-2xl font-black">{totalStock}</p>
              </CardContent>
            </Card>
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Color Families</p>
                <p className="mt-2 text-2xl font-black">{colorFamilies}</p>
              </CardContent>
            </Card>
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Low Stock</p>
                <p className="mt-2 text-2xl font-black">{lowStockCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="admin-product-panel">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Variant Matrix</CardTitle>
              <CardDescription>Keep required fields filled for every active option. Changes here update the product catalog immediately.</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={() => setVariants((current) => [...current, createVariant()])}>
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => {
              const stock = Number(variant.stock || 0);
              return (
                <div key={`${variant.id || 'new'}-${index}`} className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-11 w-11 rounded-2xl border border-border/60"
                        style={{ background: variant.colorHex?.trim() || 'linear-gradient(135deg, #f4f4f5, #d4d4d8)' }}
                      />
                      <div>
                        <h3 className="font-black tracking-tight">{variant.color || 'New color'} / {variant.size || 'New size'}</h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{variant.sku || 'Missing SKU'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`rounded-full border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${statTone(stock)}`}>
                        {stock <= 0 ? 'Out' : stock < 10 ? 'Low' : 'Healthy'} stock
                      </Badge>
                      {variants.length > 1 ? (
                        <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setVariants((current) => current.filter((_, i) => i !== index))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="Size / label *" />
                    <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="Color *" />
                    <Input value={variant.colorHex} onChange={(e) => updateVariant(index, 'colorHex', e.target.value)} placeholder="Color hex" />
                    <Input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="SKU *" />
                    <Input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="Stock" />
                    <Input type="number" value={variant.priceAdj} onChange={(e) => updateVariant(index, 'priceAdj', e.target.value)} placeholder="Price adj." />
                    <div className="md:col-span-2 xl:col-span-2">
                      <Input value={variant.imageUrl} onChange={(e) => updateVariant(index, 'imageUrl', e.target.value)} placeholder="Variant image URL" />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="admin-product-panel sticky top-20">
            <CardHeader>
              <CardTitle>Variant Summary</CardTitle>
              <CardDescription>Quick inventory health view for this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Base Price</p>
                      <p className="font-black">रू {product.basePrice}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Variant Count</p>
                      <p className="font-black">{variants.length}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">At Risk</p>
                      <p className="font-black">{lowStockCount} low-stock variants</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
                {product.primaryImageUrl ? (
                  <img src={product.primaryImageUrl} alt={product.name} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-muted-foreground">
                    <Boxes className="h-8 w-8" />
                  </div>
                )}
              </div>

              <Button onClick={handleSave} disabled={saving} className="h-11 w-full rounded-full font-bold">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Variants
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
