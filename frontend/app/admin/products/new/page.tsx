'use client';

import { useRouter } from 'next/navigation';

import { adminApi } from '@/lib/api';
import { ProductEditor } from '../_components/product-editor';

export default function NewProductPage() {
  const router = useRouter();

  return (
    <ProductEditor
      mode="create"
      title="Create Product"
      description="Build a complete catalog entry with cleaner structure, responsive editing, and consistent admin UI."
      submitLabel="Save Product"
      onSubmit={async (payload) => {
        await adminApi.createProduct(payload);
        router.push('/admin/products');
      }}
    />
  );
}

