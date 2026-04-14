'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { adminApi, categoriesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ProductType = 'apparel' | 'drinkware' | 'accessory' | 'home';

type ProductImageForm = {
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  mimeType?: string | null;
};

type ProductVariantForm = {
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: string;
  priceAdj: string;
  imageUrl: string;
};

type DesignAreaForm = {
  name: string;
  areaKey: string;
  widthPx: string;
  heightPx: string;
  topPx: string;
  leftPx: string;
  allowedFileTypes: string;
  dpiRequirement: string;
  isRequired: boolean;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  productType: ProductType;
  basePrice: string;
  material: string;
  gsm: string;
  weightGrams: string;
  printTechnique: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  isCustomizable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImageForm[];
  variants: ProductVariantForm[];
  designAreas: DesignAreaForm[];
};

const createVariant = (): ProductVariantForm => ({
  size: '',
  color: '',
  colorHex: '',
  sku: '',
  stock: '',
  priceAdj: '',
  imageUrl: '',
});

const createDesignArea = (): DesignAreaForm => ({
  name: '',
  areaKey: '',
  widthPx: '',
  heightPx: '',
  topPx: '',
  leftPx: '',
  allowedFileTypes: '',
  dpiRequirement: '',
  isRequired: false,
});

const EMPTY_FORM: ProductForm = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  productType: 'apparel',
  basePrice: '',
  material: '',
  gsm: '',
  weightGrams: '',
  printTechnique: '',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  isCustomizable: true,
  isActive: true,
  isFeatured: false,
  images: [],
  variants: [createVariant()],
  designAreas: [createDesignArea()],
};

const MAX_SINGLE_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = React.useState<ProductForm>(EMPTY_FORM);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    categoriesApi
      .list()
      .then((res) => setCategories(res.data || []))
      .catch((err) => {
        console.error(err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    updateForm('name', value);
    updateForm(
      'slug',
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  const updateVariant = (index: number, key: keyof ProductVariantForm, value: string) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant
      ),
    }));
  };

  const updateDesignArea = (index: number, key: keyof DesignAreaForm, value: string | boolean) => {
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
    const oversizedFile = nextFiles.find((file) => file.size > MAX_SINGLE_IMAGE_BYTES);
    if (oversizedFile) {
      throw new Error(`Image "${oversizedFile.name}" is too large. Keep each image under 8MB.`);
    }

    const currentBytes = form.images.reduce((total, image) => {
      const base64Part = image.url.split(',')[1] || '';
      return total + Math.floor((base64Part.length * 3) / 4);
    }, 0);
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
    setForm((current) => ({
      ...current,
      images: current.images
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({
          ...image,
          sortOrder: imageIndex,
          isPrimary: imageIndex === 0 ? true : image.isPrimary,
        }))
        .map((image, imageIndex, all) => ({
          ...image,
          isPrimary: all.some((entry) => entry.isPrimary) ? image.isPrimary : imageIndex === 0,
        })),
    }));
  };

  const handleSubmit = async () => {
    const missing: string[] = [];
    const completedVariants = form.variants.filter(
      (variant) => variant.size.trim() || variant.color.trim() || variant.sku.trim() || variant.colorHex.trim() || variant.stock.trim() || variant.priceAdj.trim() || variant.imageUrl.trim()
    );
    const completedDesignAreas = form.designAreas.filter(
      (area) =>
        area.name.trim() ||
        area.areaKey.trim() ||
        area.widthPx.trim() ||
        area.heightPx.trim() ||
        area.topPx.trim() ||
        area.leftPx.trim() ||
        area.allowedFileTypes.trim() ||
        area.dpiRequirement.trim()
    );

    if (!form.name.trim()) missing.push('Product name');
    if (!form.slug.trim()) missing.push('Slug');
    if (!form.categoryId) missing.push('Category');
    if (!form.basePrice.trim()) missing.push('Base price');
    if (form.images.length === 0) missing.push('At least one image');
    if (completedVariants.length === 0) {
      missing.push('Add at least one variant');
    } else if (completedVariants.some((variant) => !variant.size.trim() || !variant.color.trim() || !variant.sku.trim())) {
      missing.push('Variant fields marked required');
    }
    if (form.isCustomizable && completedDesignAreas.length === 0) {
      missing.push('Add at least one design area');
    } else if (form.isCustomizable && completedDesignAreas.some((area) => !area.name.trim() || !area.widthPx.trim() || !area.heightPx.trim())) {
      missing.push('Design area fields marked required');
    }

    if (missing.length > 0) {
      setError(missing.join(', '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      await adminApi.createProduct({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        productType: form.productType,
        basePrice: Number(form.basePrice),
        material: form.material.trim(),
        gsm: form.gsm ? Number(form.gsm) : null,
        weightGrams: form.weightGrams ? Number(form.weightGrams) : null,
        printTechnique: form.printTechnique.trim() || null,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        metaTitle: form.metaTitle.trim() || null,
        metaDescription: form.metaDescription.trim() || null,
        isCustomizable: form.isCustomizable,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        images: form.images.map((image, index) => ({
          ...image,
          sortOrder: index,
        })),
        variants: completedVariants.map((variant) => ({
          size: variant.size.trim(),
          color: variant.color.trim(),
          colorHex: variant.colorHex.trim() || '#000000',
          sku: variant.sku.trim(),
          stock: Number(variant.stock || 0),
          priceAdj: Number(variant.priceAdj || 0),
          imageUrl: variant.imageUrl.trim() || null,
        })),
        designAreas: form.isCustomizable
          ? completedDesignAreas.map((area, index) => ({
              name: area.name.trim(),
              areaKey: area.areaKey.trim() || null,
              widthPx: Number(area.widthPx || 0),
              heightPx: Number(area.heightPx || 0),
              topPx: Number(area.topPx || 0),
              leftPx: Number(area.leftPx || 0),
              allowedFileTypes: area.allowedFileTypes
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
              dpiRequirement: area.dpiRequirement ? Number(area.dpiRequirement) : null,
              sortOrder: index,
              isRequired: area.isRequired,
            }))
          : [],
      });

      router.push('/admin/products');
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Create Product</h1>
              <p className="text-sm text-muted-foreground">
                Save product details, images, variants, and design areas in one flow.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving || loading} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Product
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
              <CardDescription>Basic catalog data used across storefront, cart, and admin. Fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Product name *</label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Premium oversized t-shirt" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug *</label>
                <Input value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} placeholder="premium-oversized-tshirt" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateForm('categoryId', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Product type *</label>
                <select
                  value={form.productType}
                  onChange={(e) => updateForm('productType', e.target.value as ProductType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="apparel">Apparel</option>
                  <option value="drinkware">Drinkware</option>
                  <option value="accessory">Accessory</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Base price *</label>
                <Input type="number" value={form.basePrice} onChange={(e) => updateForm('basePrice', e.target.value)} placeholder="799" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Material (Optional)</label>
                <Input value={form.material} onChange={(e) => updateForm('material', e.target.value)} placeholder="Cotton, Ceramic, Polyester" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">GSM (Optional)</label>
                <Input type="number" value={form.gsm} onChange={(e) => updateForm('gsm', e.target.value)} placeholder="180" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Weight (grams) (Optional)</label>
                <Input type="number" value={form.weightGrams} onChange={(e) => updateForm('weightGrams', e.target.value)} placeholder="250" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Print technique (Optional)</label>
                <Input value={form.printTechnique} onChange={(e) => updateForm('printTechnique', e.target.value)} placeholder="DTG, DTF, Sublimation" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tags (Optional)</label>
                <Input value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} placeholder="premium, oversized, summer" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe the product, materials, print compatibility, and selling points"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Meta title (Optional)</label>
                <Input value={form.metaTitle} onChange={(e) => updateForm('metaTitle', e.target.value)} placeholder="SEO title" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Meta description (Optional)</label>
                <Input value={form.metaDescription} onChange={(e) => updateForm('metaDescription', e.target.value)} placeholder="SEO description" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Images</CardTitle>
                <CardDescription>At least one image is required. Uploaded images are converted to data URLs and stored in the database.</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
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
                <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No images added yet.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {form.images.map((image, index) => (
                    <div key={`${image.sortOrder}-${index}`} className="overflow-hidden rounded-lg border bg-card">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img src={image.url} alt={image.altText || form.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-3 p-3">
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
                          <Button type="button" variant={image.isPrimary ? 'default' : 'outline'} onClick={() => setPrimaryImage(index)} className="flex-1">
                            {image.isPrimary ? 'Primary' : 'Set Primary'}
                          </Button>
                          <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)}>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Variants</CardTitle>
                <CardDescription>At least one variant is required. Required fields: size, color, SKU. Other variant fields are optional.</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={() => updateForm('variants', [...form.variants, createVariant()])} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.variants.map((variant, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Variant {index + 1}</h3>
                    {form.variants.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateForm('variants', form.variants.filter((_, variantIndex) => variantIndex !== index))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Size / label *</label>
                      <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="M or 11oz" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Color *</label>
                      <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="Black" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Color hex (Optional)</label>
                      <Input value={variant.colorHex} onChange={(e) => updateVariant(index, 'colorHex', e.target.value)} placeholder="#111111" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">SKU *</label>
                      <Input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="TSHIRT-BLK-M" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Stock (Optional)</label>
                      <Input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="0" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Price adjustment (Optional)</label>
                      <Input type="number" value={variant.priceAdj} onChange={(e) => updateVariant(index, 'priceAdj', e.target.value)} placeholder="0" />
                    </div>
                    <div className="md:col-span-2 xl:col-span-3">
                      <label className="mb-1 block text-sm font-medium">Variant image URL (Optional)</label>
                      <Input value={variant.imageUrl} onChange={(e) => updateVariant(index, 'imageUrl', e.target.value)} placeholder="Optional override image or data URL" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {form.isCustomizable ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Design Areas</CardTitle>
                  <CardDescription>When customizable is enabled, add at least one design area. Required fields: name, width, height.</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={() => updateForm('designAreas', [...form.designAreas, createDesignArea()])} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Area
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.designAreas.map((area, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">Area {index + 1}</h3>
                      {form.designAreas.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => updateForm('designAreas', form.designAreas.filter((_, areaIndex) => areaIndex !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Name *</label>
                        <Input value={area.name} onChange={(e) => updateDesignArea(index, 'name', e.target.value)} placeholder="Front" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Key (Optional)</label>
                        <Input value={area.areaKey} onChange={(e) => updateDesignArea(index, 'areaKey', e.target.value)} placeholder="front" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Allowed file types (Optional)</label>
                        <Input value={area.allowedFileTypes} onChange={(e) => updateDesignArea(index, 'allowedFileTypes', e.target.value)} placeholder="png,jpg,jpeg,svg" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Width (px) *</label>
                        <Input type="number" value={area.widthPx} onChange={(e) => updateDesignArea(index, 'widthPx', e.target.value)} placeholder="2400" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Height (px) *</label>
                        <Input type="number" value={area.heightPx} onChange={(e) => updateDesignArea(index, 'heightPx', e.target.value)} placeholder="3200" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">DPI requirement (Optional)</label>
                        <Input type="number" value={area.dpiRequirement} onChange={(e) => updateDesignArea(index, 'dpiRequirement', e.target.value)} placeholder="300" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Top offset (Optional)</label>
                        <Input type="number" value={area.topPx} onChange={(e) => updateDesignArea(index, 'topPx', e.target.value)} placeholder="200" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Left offset (Optional)</label>
                        <Input type="number" value={area.leftPx} onChange={(e) => updateDesignArea(index, 'leftPx', e.target.value)} placeholder="150" />
                      </div>
                      <label className="flex items-center gap-2 pt-7 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={area.isRequired}
                          onChange={(e) => updateDesignArea(index, 'isRequired', e.target.checked)}
                        />
                        Required design area
                      </label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Catalog and customization visibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between text-sm">
                <span>Active product</span>
                <input type="checkbox" checked={form.isActive} onChange={(e) => updateForm('isActive', e.target.checked)} />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Customizable</span>
                <input type="checkbox" checked={form.isCustomizable} onChange={(e) => updateForm('isCustomizable', e.target.checked)} />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Featured</span>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm('isFeatured', e.target.checked)} />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Quick summary of what will be saved.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg border bg-muted">
                {form.images[0]?.url ? (
                  <img src={form.images.find((image) => image.isPrimary)?.url || form.images[0].url} alt={form.name || 'Preview'} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{form.name || 'Untitled product'}</p>
                <p className="text-sm text-muted-foreground">{form.productType}</p>
                <p className="text-sm text-muted-foreground">
                  {form.variants.length} variants, {form.images.length} images, {form.isCustomizable ? form.designAreas.length : 0} design areas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
