'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { adminApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { ProductEditor } from '../../_components/product-editor';
import { mapProductToForm } from '../../_lib/product-form';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setError('');
    setProduct(null);
    adminApi
      .products()
      .then((res: any) => {
        const match = (res.data || []).find((entry: any) => entry.id === params.id);
        if (!match) {
          setError('Product not found');
          return;
        }
        setProduct(match);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message || 'Failed to load product');
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <Card className="admin-product-panel">
        <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading product editor...</p>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="admin-product-panel">
        <CardContent className="flex min-h-[240px] items-center justify-center text-sm text-destructive">
          {error || 'Product not found'}
        </CardContent>
      </Card>
    );
  }

  return (
    <ProductEditor
      mode="edit"
      title="Edit Product"
      description="Update core product content, merchandising settings, imagery, printable areas, and all sellable options in one place."
      submitLabel="Update Product"
      initialForm={mapProductToForm(product)}
      onSubmit={async (payload) => {
        await adminApi.updateProduct(product.id, payload);
        router.push('/admin/products');
      }}
    />
  );
}
