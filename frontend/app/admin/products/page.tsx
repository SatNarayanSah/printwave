'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number | string;
  fabric: string;
  gsm?: number;
  isCustomizable: boolean;
  isActive: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', basePrice: '', fabric: '', gsm: '', isCustomizable: true, isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, {
            ...formData,
            basePrice: parseFloat(formData.basePrice) || 0,
            gsm: parseInt(formData.gsm) || 0
        });
      } else {
        await adminApi.createProduct({
            ...formData,
            basePrice: parseFloat(formData.basePrice) || 0,
            gsm: parseInt(formData.gsm) || 0
        });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', description: '', basePrice: '', fabric: '', gsm: '', isCustomizable: true, isActive: true });
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      basePrice: product.basePrice.toString(),
      fabric: product.fabric || '',
      gsm: product.gsm?.toString() || '',
      isCustomizable: product.isCustomizable,
      isActive: product.isActive
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain? This will delete the product entirely.')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) return <div className="animate-pulse h-10 bg-divider rounded w-1/4"></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-main tracking-tight">Products Menu</h1>
          <p className="text-muted text-sm font-medium mt-2">Manage catalog and pricing</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(true); setEditingId(null);
            setFormData({ name: '', slug: '', description: '', basePrice: '', fabric: '', gsm: '', isCustomizable: true, isActive: true });
          }}
          className="px-6 py-3.5 bg-main text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md shadow-main/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-divider/60 space-y-6">
          <h2 className="text-xl font-black text-main mb-6">{editingId ? 'Edit Product' : 'New Product'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted tracking-widest">Name</label>
              <input required type="text" className="w-full p-3 border border-divider/60 rounded-xl bg-[#f8fafc] text-sm font-bold focus:border-main focus:bg-white transition-all outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted tracking-widest">Slug</label>
              <input required type="text" className="w-full p-3 border border-divider/60 rounded-xl bg-[#f8fafc] text-sm font-bold focus:border-main focus:bg-white transition-all outline-none" 
                value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted tracking-widest">Base Price</label>
              <input required type="number" step="0.01" className="w-full p-3 border border-divider/60 rounded-xl bg-[#f8fafc] text-sm font-bold focus:border-main focus:bg-white transition-all outline-none" 
                value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted tracking-widest">Fabric</label>
              <input type="text" className="w-full p-3 border border-divider/60 rounded-xl bg-[#f8fafc] text-sm font-bold focus:border-main focus:bg-white transition-all outline-none" 
                value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4 pt-6 border-t border-divider/60">
            <button type="submit" className="px-8 py-3 bg-main text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 bg-transparent border border-divider text-muted font-black rounded-xl text-[10px] uppercase tracking-widest hover:text-main hover:border-main transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl md:rounded-3xl border border-divider/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8fafc] border-b border-divider/60">
            <tr>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Product Name</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Price</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Custom?</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider/40 font-medium">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-secondary-bg/40 transition-colors">
                <td className="px-6 py-4 lg:px-8">
                   <span className="block font-black text-main">{p.name}</span>
                   <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">/{p.slug}</span>
                </td>
                <td className="px-6 py-4 lg:px-8 font-black text-main">${Number(p.basePrice).toFixed(2)}</td>
                <td className="px-6 py-4 lg:px-8">
                  <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black ${p.isCustomizable ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-[#f1f5f9] text-muted border border-divider/60'}`}>
                    {p.isCustomizable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 lg:px-8 text-right space-x-4">
                  <button onClick={() => handleEdit(p)} className="text-[10px] font-black text-main hover:text-blue-600 uppercase tracking-widest transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-[10px] font-black text-error uppercase tracking-widest hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 lg:py-16 text-muted text-sm font-medium">No products found. Start by creating one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
