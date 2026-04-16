import type { ProductDetailDto } from '@/lib/api/types';

export type ProductType = 'apparel' | 'drinkware' | 'accessory' | 'home';

export type ProductImageForm = {
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  mimeType?: string | null;
};

export type ProductVariantForm = {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: string;
  priceAdj: string;
  imageUrl: string;
};

export type DesignAreaForm = {
  id?: string;
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

export type ProductForm = {
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

export type AdminProductRecord = ProductDetailDto & {
  category?: ProductDetailDto['category'] | null;
};

export const MAX_SINGLE_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024;

export const createVariant = (): ProductVariantForm => ({
  size: '',
  color: '',
  colorHex: '',
  sku: '',
  stock: '',
  priceAdj: '',
  imageUrl: '',
});

export const createDesignArea = (): DesignAreaForm => ({
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

export const EMPTY_FORM: ProductForm = {
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

export const createSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export const getCompletedVariants = (variants: ProductVariantForm[]) =>
  variants.filter(
    (variant) =>
      variant.size.trim() ||
      variant.color.trim() ||
      variant.sku.trim() ||
      variant.colorHex.trim() ||
      variant.stock.trim() ||
      variant.priceAdj.trim() ||
      variant.imageUrl.trim()
  );

export const getCompletedDesignAreas = (designAreas: DesignAreaForm[]) =>
  designAreas.filter(
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

export const validateProductForm = (
  form: ProductForm,
  options?: { skipImageRequirement?: boolean; skipDesignAreaRequirement?: boolean }
) => {
  const missing: string[] = [];
  const completedVariants = getCompletedVariants(form.variants);
  const completedDesignAreas = getCompletedDesignAreas(form.designAreas);

  if (!form.name.trim()) missing.push('Product name');
  if (!form.slug.trim()) missing.push('Slug');
  if (!form.categoryId) missing.push('Category');
  if (!form.basePrice.trim()) missing.push('Base price');
  if (!options?.skipImageRequirement && form.images.length === 0) missing.push('At least one image');

  if (completedVariants.length === 0) {
    missing.push('Add at least one variant');
  } else if (completedVariants.some((variant) => !variant.size.trim() || !variant.color.trim() || !variant.sku.trim())) {
    missing.push('Variant fields marked required');
  }

  if (!options?.skipDesignAreaRequirement && form.isCustomizable && completedDesignAreas.length === 0) {
    missing.push('Add at least one design area');
  } else if (
    !options?.skipDesignAreaRequirement &&
    form.isCustomizable &&
    completedDesignAreas.some((area) => !area.name.trim() || !area.widthPx.trim() || !area.heightPx.trim())
  ) {
    missing.push('Design area fields marked required');
  }

  return {
    missing,
    completedVariants,
    completedDesignAreas,
  };
};

export const buildProductPayload = (form: ProductForm) => {
  const { completedVariants, completedDesignAreas } = validateProductForm(form, {
    skipImageRequirement: true,
    skipDesignAreaRequirement: !form.isCustomizable,
  });

  return {
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
  };
};

export const mapProductToForm = (product: AdminProductRecord): ProductForm => ({
  name: product.name ?? '',
  slug: product.slug ?? '',
  description: product.description ?? '',
  categoryId: product.category?.id ?? '',
  productType: ((product.productType as ProductType | undefined) ?? 'apparel'),
  basePrice: String(product.basePrice ?? ''),
  material: product.material ?? product.fabric ?? '',
  gsm: product.gsm == null ? '' : String(product.gsm),
  weightGrams: product.weightGrams == null ? '' : String(product.weightGrams),
  printTechnique: (product as any).printTechnique ?? '',
  tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
  metaTitle: (product as any).metaTitle ?? '',
  metaDescription: (product as any).metaDescription ?? '',
  isCustomizable: Boolean(product.isCustomizable),
  isActive: typeof product.isActive === 'boolean' ? product.isActive : true,
  isFeatured: Boolean(product.isFeatured),
  images:
    product.images?.length > 0
      ? product.images.map((image, index) => ({
          url: image.url,
          altText: image.altText ?? '',
          sortOrder: image.sortOrder ?? index,
          isPrimary: Boolean(image.isPrimary),
          mimeType: image.mimeType ?? null,
        }))
      : [],
  variants:
    product.variants?.length > 0
      ? product.variants.map((variant) => ({
          id: variant.id,
          size: variant.size ?? '',
          color: variant.color ?? '',
          colorHex: variant.colorHex ?? '',
          sku: variant.sku ?? '',
          stock: String(variant.stock ?? 0),
          priceAdj: String(variant.priceAdj ?? 0),
          imageUrl: variant.imageUrl ?? '',
        }))
      : [createVariant()],
  designAreas:
    product.designAreas && product.designAreas.length > 0
      ? product.designAreas.map((area) => ({
          id: area.id,
          name: area.name ?? '',
          areaKey: area.areaKey ?? '',
          widthPx: String(area.widthPx ?? ''),
          heightPx: String(area.heightPx ?? ''),
          topPx: String(area.topPx ?? 0),
          leftPx: String(area.leftPx ?? 0),
          allowedFileTypes: Array.isArray(area.allowedFileTypes) ? area.allowedFileTypes.join(', ') : '',
          dpiRequirement: area.dpiRequirement == null ? '' : String(area.dpiRequirement),
          isRequired: Boolean(area.isRequired),
        }))
      : [createDesignArea()],
});

