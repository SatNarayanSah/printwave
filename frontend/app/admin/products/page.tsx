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
  Trash2
} from 'lucide-react';

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Cotton T-Shirt', type: 'Apparel', category: 'Clothing', price: 'रू 899', stock: 245, variants: '8 Colors, 5 Sizes', status: 'In Stock' },
  { id: '2', name: 'Ceramic Matte Mug', type: 'Drinkware', category: 'Accessories', price: 'रू 450', stock: 120, variants: '4 Colors', status: 'In Stock' },
  { id: '3', name: 'Heavyweight Hoodie', type: 'Apparel', category: 'Clothing', price: 'रू 2,499', stock: 15, variants: '3 Colors, 4 Sizes', status: 'Low Stock' },
  { id: '4', name: 'Tote Bag - Eco Cotton', type: 'Accessories', category: 'Bags', price: 'रू 350', stock: 0, variants: '2 Colors', status: 'Out of Stock' },
  { id: '5', name: 'Snapback Cap', type: 'Accessories', category: 'Clothing', price: 'रू 1,200', stock: 85, variants: 'One Size', status: 'In Stock' },
];

export default function ProductManagementPage() {
  return (
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
          <Button className="font-bold gap-2 rounded-full px-6">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-widest">Total Products</CardDescription>
            <CardTitle className="text-3xl font-black">128</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground font-medium">Across 12 categories</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-widest">Active Variants</CardTitle>
            <CardTitle className="text-3xl font-black">456</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground font-medium">Sizes and colors in stock</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-widest text-primary">Low Stock Alerts</CardDescription>
            <CardTitle className="text-3xl font-black text-primary">7</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-primary/70 font-bold">Needs restock immediately</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <div className="flex -space-x-1">
                  {['All', 'Clothing', 'Drinkware', 'Bags'].map((cat, i) => (
                    <Button 
                      key={cat}
                      variant={i === 0 ? 'default' : 'outline'} 
                      size="sm" 
                      className={`h-8 text-xs font-bold rounded-full px-4 ${i !== 0 ? 'bg-background hover:bg-muted' : ''}`}
                    >
                      {cat}
                    </Button>
                  ))}
               </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9 h-9 w-64 bg-background" />
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
              {MOCK_PRODUCTS.map((prod) => (
                <TableRow key={prod.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-12 w-12 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{prod.name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{prod.type}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold border-border/60 text-[10px] uppercase">
                      {prod.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-sm">{prod.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Palette className="h-3 w-3" />
                      {prod.variants}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        font-bold text-[10px] uppercase tracking-wider border-none
                        ${prod.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${prod.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${prod.status === 'Out of Stock' ? 'bg-destructive/10 text-destructive' : ''}
                      `}
                      variant="outline"
                    >
                      {prod.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="gap-2 font-medium">Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-medium">Archive</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
