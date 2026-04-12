'use client';

import * as React from 'react';
import { 
  Palette, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  MoreHorizontal,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const MOCK_DESIGNS = [
  { 
    id: 'D-101', 
    name: 'Mithila Peacock', 
    artist: 'Janak Art Studio', 
    status: 'Pending', 
    category: 'Traditional', 
    date: '10 mins ago',
    previewColor: 'bg-orange-100',
    icon: '🦚'
  },
  { 
    id: 'D-102', 
    name: 'Modern Janakpur', 
    artist: 'Bibek Design', 
    status: 'Approved', 
    category: 'Modern', 
    date: '2 hours ago',
    previewColor: 'bg-blue-100',
    icon: '🏛️'
  },
  { 
    id: 'D-103', 
    name: 'Festive Vibes', 
    artist: 'Mithila Artist', 
    status: 'Approved', 
    category: 'Festival', 
    date: '1 day ago',
    previewColor: 'bg-red-100',
    icon: '🏮'
  },
  { 
    id: 'D-104', 
    name: 'Floral Mandala', 
    artist: 'Sneha Yadav', 
    status: 'Rejected', 
    category: 'Abstract', 
    date: '3 days ago',
    previewColor: 'bg-green-100',
    icon: '🌸'
  },
  { 
    id: 'D-105', 
    name: 'Nepal Pride', 
    artist: 'Govind Shah', 
    status: 'Pending', 
    category: 'Culture', 
    date: '5 hours ago',
    previewColor: 'bg-neutral-100',
    icon: '🇳🇵'
  },
  { 
    id: 'D-106', 
    name: 'Abstract Fish', 
    artist: 'Janak Art Studio', 
    status: 'Pending', 
    category: 'Traditional', 
    date: 'Just now',
    previewColor: 'bg-purple-100',
    icon: '🐟'
  },
];

export default function DesignManagementPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Design Management</h1>
          <p className="text-muted-foreground mt-1">Review and approve designs from artists and customers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={`rounded-full ${viewMode === 'grid' ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground' : ''}`}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={`rounded-full ${viewMode === 'list' ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground' : ''}`}>
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="pending" className="rounded-md px-6 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Clock className="h-3.5 w-3.5" />
              Pending Approval
              <Badge className="ml-1 h-5 w-5 p-0 bg-primary text-[10px] flex items-center justify-center rounded-full">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-md px-6 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">All Designs</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-md px-6 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Rejected</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search designs..." className="pl-9 h-9 w-64 bg-background border-border/60" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_DESIGNS.filter(d => d.status === 'Pending').map((design) => (
              <Card key={design.id} className="border-border/40 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`aspect-square w-full ${design.previewColor} flex items-center justify-center text-6xl relative`}>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  {design.icon}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{design.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        By <span className="text-foreground font-bold">{design.artist}</span> • {design.date}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{design.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" className="w-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl h-10 font-bold">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button className="w-full gap-2 rounded-xl h-10 font-bold shadow-lg shadow-primary/20">
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {MOCK_DESIGNS.map((design) => (
              <Card key={design.id} className="border-border/40 shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                <div className={`h-40 w-full ${design.previewColor} flex items-center justify-center text-5xl relative`}>
                  <Badge 
                    className={`absolute top-3 left-3 font-bold border-none ${
                        design.status === 'Approved' ? 'bg-emerald-500 text-white' : 
                        design.status === 'Rejected' ? 'bg-destructive text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {design.status}
                  </Badge>
                  {design.icon}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm tracking-tight">{design.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold">BY {design.artist.toUpperCase()}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
