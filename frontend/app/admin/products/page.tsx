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
  PackageX
} from 'lucide-react';
import Link from 'next/link';
import { adminApi, categoriesApi } from '@/lib/api';

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


export default function ProductManagementPage() {
  const [productsList, setProductsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    // Fetch products and categories in parallel
    Promise.all([
      adminApi.products(),
      categoriesApi.list()
    ])
      .then(([productsRes, catsRes]: [any, any]) => {
        setProductsList(productsRes.data || []);
        if (catsRes?.data) setCategories(catsRes.data);
      })
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

    <div className="space-y-2">
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
          <Button className="font-bold gap-2 rounded-full px-6" asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
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
                    <Link href="/admin/products/new" className="text-primary underline font-bold">Add one?</Link>
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
  );
}
