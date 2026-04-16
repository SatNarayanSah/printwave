'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Boxes,
  Image as ImageIcon,
  Layers3,
  Loader2,
  Package,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { categoriesApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  buildProductPayload,
  createDesignArea,
  createSlug,
  createVariant,
  EMPTY_FORM,
  fileToDataUrl,
  MAX_SINGLE_IMAGE_BYTES,
  MAX_TOTAL_IMAGE_BYTES,
  ProductForm,
  ProductImageForm,
  ProductType,
  validateProductForm,
} from '../_lib/product-form';

type Category = {
  id: string;
  name: string;
};

type ProductEditorProps = {
  mode: 'create' | 'edit';
  title: string;
  description: string;
  submitLabel: string;
  backHref?: string;
  initialForm?: ProductForm;
  loading?: boolean;
  onSubmit: (payload: ReturnType<typeof buildProductPayload>) => Promise<void>;
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}

function countImageBytes(images: ProductImageForm[]) {
  return images.reduce((total, image) => {
    const base64Part = image.url.split(',')[1] || '';
    return total + Math.floor((base64Part.length * 3) / 4);
  }, 0);
}

export function ProductEditor({
  mode,
  title,
  description,
  submitLabel,
  backHref = '/admin/products',
  initialForm,
  loading = false,
  onSubmit,
}: ProductEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = React.useState<ProductForm>(initialForm ?? EMPTY_FORM);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  React.useEffect(() => {
    categoriesApi
      .list()
      .then((res) => setCategories((res.data || []) as Category[]))
      .catch((err) => {
        console.error(err);
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  const busy = loading || categoriesLoading || saving;
  const primaryImage = form.images.find((image) => image.isPrimary) || form.images[0];
  const totalVariantStock = form.variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);

  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: current.slug === '' || current.slug === createSlug(current.name) ? createSlug(value) : current.slug,
    }));
  };

  const updateVariant = (index: number, key: keyof ProductForm['variants'][number], value: string) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant
      ),
    }));
  };

  const updateDesignArea = (index: number, key: keyof ProductForm['designAreas'][number], value: string | boolean) => {
    setForm((current) => ({
      ...current,
      designAreas: current.designAreas.map((area, areaIndex) =>
        areaIndex === index ? { ...area, [key]: value } : area
      ),
    }));
  };

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files);
    const oversized = nextFiles.find((file) => file.size > MAX_SINGLE_IMAGE_BYTES);
    if (oversized) {
      throw new Error(`Image "${oversized.name}" is too large. Keep each image under 8MB.`);
    }

    const currentBytes = countImageBytes(form.images);
    const nextBytes = nextFiles.reduce((total, file) => total + file.size, 0);
    if (currentBytes + nextBytes > MAX_TOTAL_IMAGE_BYTES) {
      throw new Error('Total image payload is too large. Keep all product images under 24MB combined.');
    }

    const baseIndex = form.images.length;
    const nextImages = await Promise.all(
      nextFiles.map(async (file, index) => ({
        url: await fileToDataUrl(file),
        altText: form.name || file.name,
        sortOrder: baseIndex + index,
        isPrimary: form.images.length === 0 && index === 0,
        mimeType: file.type || null,
      }))
    );

    setForm((current) => ({
      ...current,
      images: [...current.images, ...nextImages],
    }));
  };

  const setPrimaryImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === index,
      })),
    }));
  };

  const removeImage = (index: number) => {
    setForm((current) => {
      const nextImages = current.images
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({
          ...image,
          sortOrder: imageIndex,
        }));

      return {
        ...current,
        images: nextImages.map((image, imageIndex) => ({
          ...image,
          isPrimary: nextImages.some((entry) => entry.isPrimary) ? image.isPrimary : imageIndex === 0,
        })),
      };
    });
  };

  const handleSubmit = async () => {
    const validation = validateProductForm(form);
    if (validation.missing.length > 0) {
      setError(validation.missing.join(', '));
      return;
    }

    setError('');
    setSaving(true);

    try {
      await onSubmit(buildProductPayload(form));
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode === 'create' ? 'save' : 'update'} product`);
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
                <Link href={backHref}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Admin Catalog
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2">
                <Package className="h-3.5 w-3.5" />
                {form.name || 'Untitled product'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2">
                <Boxes className="h-3.5 w-3.5" />
                {form.variants.length} variants
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2">
                <Layers3 className="h-3.5 w-3.5" />
                {form.images.length} images
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/12 p-2 text-primary">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Variant Stock</p>
                    <p className="text-xl font-black">{totalVariantStock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/12 p-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Status</p>
                    <p className="text-xl font-black">{form.isActive ? 'Live' : 'Draft'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-product-stat">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-500/12 p-2 text-amber-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Base Price</p>
                    <p className="text-xl font-black">रू {form.basePrice || '0'}</p>
                  </div>
                </div>
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="h-auto w-full flex-wrap rounded-2xl border border-border/50 bg-background/80 p-1.5">
              <TabsTrigger value="details" className="min-w-[120px] rounded-xl px-4 py-2 font-bold">Core Details</TabsTrigger>
              <TabsTrigger value="images" className="min-w-[120px] rounded-xl px-4 py-2 font-bold">Images</TabsTrigger>
              <TabsTrigger value="variants" className="min-w-[120px] rounded-xl px-4 py-2 font-bold">Variants</TabsTrigger>
              <TabsTrigger value="design" className="min-w-[120px] rounded-xl px-4 py-2 font-bold">Design Areas</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="admin-product-panel">
                <CardHeader>
                  <CardTitle>Core Details</CardTitle>
                  <CardDescription>Basic catalog data used across storefront, cart, and admin. Required fields are clearly marked.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field label="Product name" required>
                      <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Premium oversized t-shirt" />
                    </Field>
                  </div>
                  <Field label="Slug" required>
                    <Input value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} placeholder="premium-oversized-tshirt" />
                  </Field>
                  <Field label="Category" required>
                    <Select value={form.categoryId || undefined} onValueChange={(value) => updateForm('categoryId', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Product type" required>
                    <Select value={form.productType} onValueChange={(value) => updateForm('productType', value as ProductType)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apparel">Apparel</SelectItem>
                        <SelectItem value="drinkware">Drinkware</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Base price" required>
                    <Input type="number" value={form.basePrice} onChange={(e) => updateForm('basePrice', e.target.value)} placeholder="799" />
                  </Field>
                  <Field label="Material">
                    <Input value={form.material} onChange={(e) => updateForm('material', e.target.value)} placeholder="Cotton, Ceramic, Polyester" />
                  </Field>
                  <Field label="GSM">
                    <Input type="number" value={form.gsm} onChange={(e) => updateForm('gsm', e.target.value)} placeholder="180" />
                  </Field>
                  <Field label="Weight (grams)">
                    <Input type="number" value={form.weightGrams} onChange={(e) => updateForm('weightGrams', e.target.value)} placeholder="250" />
                  </Field>
                  <Field label="Print technique">
                    <Input value={form.printTechnique} onChange={(e) => updateForm('printTechnique', e.target.value)} placeholder="DTG, DTF, Sublimation" />
                  </Field>
                  <Field label="Tags">
                    <Input value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} placeholder="premium, oversized, summer" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <Textarea
                        value={form.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        className="min-h-36"
                        placeholder="Describe the product, materials, print compatibility, and selling points"
                      />
                    </Field>
                  </div>
                  <Field label="Meta title">
                    <Input value={form.metaTitle} onChange={(e) => updateForm('metaTitle', e.target.value)} placeholder="SEO title" />
                  </Field>
                  <Field label="Meta description">
                    <Input value={form.metaDescription} onChange={(e) => updateForm('metaDescription', e.target.value)} placeholder="SEO description" />
                  </Field>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card className="admin-product-panel">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle>Images</CardTitle>
                    <CardDescription>At least one image is required. Use a primary image to anchor cards, listings, and previews.</CardDescription>
                  </div>
                  <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      try {
                        await addImages(e.target.files);
                        e.target.value = '';
                      } catch (err: any) {
                        setError(err?.message || 'Failed to read image');
                      }
                    }}
                  />

                  {form.images.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 text-center">
                      <div className="rounded-full bg-background p-4 text-muted-foreground shadow-sm">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">No product images yet</p>
                        <p className="text-sm text-muted-foreground">Upload square or portrait visuals to make product listings look complete.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                      {form.images.map((image, index) => (
                        <div key={`${image.sortOrder}-${index}`} className="overflow-hidden rounded-3xl border border-border/60 bg-background/90 shadow-sm">
                          <div className="aspect-square overflow-hidden bg-muted/40">
                            <img src={image.url} alt={image.altText || form.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="space-y-3 p-4">
                            <Input
                              value={image.altText}
                              onChange={(e) =>
                                setForm((current) => ({
                                  ...current,
                                  images: current.images.map((entry, imageIndex) =>
                                    imageIndex === index ? { ...entry, altText: e.target.value } : entry
                                  ),
                                }))
                              }
                              placeholder="Alt text"
                            />
                            <div className="flex gap-2">
                              <Button type="button" variant={image.isPrimary ? 'default' : 'outline'} className="flex-1 rounded-full" onClick={() => setPrimaryImage(index)}>
                                {image.isPrimary ? 'Primary' : 'Set Primary'}
                              </Button>
                              <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => removeImage(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants">
              <Card className="admin-product-panel">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle>Variants</CardTitle>
                    <CardDescription>Every sellable color and size lives here. Required fields: size, color, and SKU.</CardDescription>
                  </div>
                  <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={() => updateForm('variants', [...form.variants, createVariant()])}>
                    <Plus className="h-4 w-4" />
                    Add Variant
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.variants.map((variant, index) => (
                    <div key={`${variant.id || 'new'}-${index}`} className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-black tracking-tight">Variant {index + 1}</h3>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{variant.color || 'Color'} / {variant.size || 'Size'}</p>
                        </div>
                        {form.variants.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => updateForm('variants', form.variants.filter((_, variantIndex) => variantIndex !== index))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Size / label" required>
                          <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="M or 11oz" />
                        </Field>
                        <Field label="Color" required>
                          <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="Black" />
                        </Field>
                        <Field label="Color hex">
                          <Input value={variant.colorHex} onChange={(e) => updateVariant(index, 'colorHex', e.target.value)} placeholder="#111111" />
                        </Field>
                        <Field label="SKU" required>
                          <Input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="TSHIRT-BLK-M" />
                        </Field>
                        <Field label="Stock">
                          <Input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="0" />
                        </Field>
                        <Field label="Price adjustment">
                          <Input type="number" value={variant.priceAdj} onChange={(e) => updateVariant(index, 'priceAdj', e.target.value)} placeholder="0" />
                        </Field>
                        <div className="md:col-span-2 xl:col-span-3">
                          <Field label="Variant image URL">
                            <Input value={variant.imageUrl} onChange={(e) => updateVariant(index, 'imageUrl', e.target.value)} placeholder="Optional override image or data URL" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card className="admin-product-panel">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle>Design Areas</CardTitle>
                    <CardDescription>When customization is enabled, define the printable zones customers can use.</CardDescription>
                  </div>
                  <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={() => updateForm('designAreas', [...form.designAreas, createDesignArea()])}>
                    <Plus className="h-4 w-4" />
                    Add Area
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!form.isCustomizable ? (
                    <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
                      Turn on customization from the side panel to manage design areas.
                    </div>
                  ) : (
                    form.designAreas.map((area, index) => (
                      <div key={`${area.id || 'new'}-${index}`} className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-black tracking-tight">Area {index + 1}</h3>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{area.name || 'Unnamed printable area'}</p>
                          </div>
                          {form.designAreas.length > 1 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => updateForm('designAreas', form.designAreas.filter((_, areaIndex) => areaIndex !== index))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <Field label="Name" required>
                            <Input value={area.name} onChange={(e) => updateDesignArea(index, 'name', e.target.value)} placeholder="Front chest" />
                          </Field>
                          <Field label="Key">
                            <Input value={area.areaKey} onChange={(e) => updateDesignArea(index, 'areaKey', e.target.value)} placeholder="front" />
                          </Field>
                          <Field label="Allowed file types">
                            <Input value={area.allowedFileTypes} onChange={(e) => updateDesignArea(index, 'allowedFileTypes', e.target.value)} placeholder="png,jpg,jpeg,svg" />
                          </Field>
                          <Field label="Width (px)" required>
                            <Input type="number" value={area.widthPx} onChange={(e) => updateDesignArea(index, 'widthPx', e.target.value)} placeholder="2400" />
                          </Field>
                          <Field label="Height (px)" required>
                            <Input type="number" value={area.heightPx} onChange={(e) => updateDesignArea(index, 'heightPx', e.target.value)} placeholder="3200" />
                          </Field>
                          <Field label="DPI requirement">
                            <Input type="number" value={area.dpiRequirement} onChange={(e) => updateDesignArea(index, 'dpiRequirement', e.target.value)} placeholder="300" />
                          </Field>
                          <Field label="Top offset">
                            <Input type="number" value={area.topPx} onChange={(e) => updateDesignArea(index, 'topPx', e.target.value)} placeholder="200" />
                          </Field>
                          <Field label="Left offset">
                            <Input type="number" value={area.leftPx} onChange={(e) => updateDesignArea(index, 'leftPx', e.target.value)} placeholder="150" />
                          </Field>
                          <div className="flex items-end">
                            <div className="flex h-11 w-full items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4">
                              <span className="text-sm font-medium">Required area</span>
                              <Switch checked={area.isRequired} onCheckedChange={(checked) => updateDesignArea(index, 'isRequired', checked)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="admin-product-panel sticky top-20">
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Keep inventory, customization, and merchandising rules in one place.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div>
                    <p className="font-semibold">Active product</p>
                    <p className="text-xs text-muted-foreground">Shown in storefront and catalog results.</p>
                  </div>
                  <Switch checked={form.isActive} onCheckedChange={(checked) => updateForm('isActive', checked)} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div>
                    <p className="font-semibold">Customizable</p>
                    <p className="text-xs text-muted-foreground">Unlocks design area setup and custom uploads.</p>
                  </div>
                  <Switch checked={form.isCustomizable} onCheckedChange={(checked) => updateForm('isCustomizable', checked)} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div>
                    <p className="font-semibold">Featured</p>
                    <p className="text-xs text-muted-foreground">Useful for homepage and curated collections.</p>
                  </div>
                  <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateForm('isFeatured', checked)} />
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
                {primaryImage?.url ? (
                  <img src={primaryImage.url} alt={primaryImage.altText || form.name || 'Preview'} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-lg font-black tracking-tight">{form.name || 'Untitled product'}</p>
                <p className="text-sm text-muted-foreground">{form.description || 'Short catalog summary will appear here once entered.'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Catalog Mix</p>
                    <p className="mt-1 font-semibold">{form.productType}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Assets</p>
                    <p className="mt-1 font-semibold">{form.images.length} images / {form.designAreas.length} areas</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={busy} className="h-11 w-full rounded-full font-bold">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {submitLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
