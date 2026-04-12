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
  List as ListIcon,
  Loader2,
  PackageX
} from 'lucide-react';
import { adminApi } from '@/lib/api';

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
  const [designsList, setDesignsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = () => {
    setLoading(true);
    adminApi.designs()
      .then(res => setDesignsList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id: string, isApproved: boolean) => {
    try {
      await adminApi.updateDesignStatus(id, { isApproved });
      fetchDesigns();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingDesigns = designsList.filter(d => !d.isApproved);
  const approvedDesigns = designsList.filter(d => d.isApproved); // Just simplifying: Assuming unapproved is Pending. Wait, maybe we need rejected status too. Since schema only has isApproved boolean, if false -> Pending. We don't have Rejected explicitly without a separate flag. For now, false = Pending, true = Approved.
  // We can treat any design as pending if isApproved=false, and maybe add a rejected flag later. For now, we only show Pending and All.

  const filterDesigns = (list: any[]) => list.filter(d => 
    !search || 
    (d.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (d.user?.firstName || '').toLowerCase().includes(search.toLowerCase())
  );

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
              <Badge className="ml-1 h-5 w-5 p-0 bg-primary text-[10px] flex items-center justify-center rounded-full">{pendingDesigns.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-md px-6 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">All Designs</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-md px-6 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Rejected</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search designs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-64 bg-background border-border/60" 
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading designs...
              </div>
            ) : filterDesigns(pendingDesigns).length === 0 ? (
              <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground">
                 No pending designs found.
              </div>
            ) : filterDesigns(pendingDesigns).map((design) => (
              <Card key={design.id} className="border-border/40 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`aspect-square w-full bg-muted/40 flex items-center justify-center relative overflow-hidden`}>
                  <img src={design.fileUrl || design.thumbnailUrl} alt={design.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{design.name || 'Untitled Design'}</h3>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        By <span className="text-foreground font-bold">{design.user?.firstName || 'Guest'}</span> • {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <Button 
                      onClick={() => handleUpdateStatus(design.id, true)}
                      className="w-full gap-2 rounded-xl h-10 font-bold shadow-lg shadow-primary/20"
                    >
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
             {loading ? (
              <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading designs...
              </div>
            ) : filterDesigns(designsList).length === 0 ? (
              <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground">
                 No designs found.
              </div>
            ) : filterDesigns(designsList).map((design) => (
              <Card key={design.id} className="border-border/40 shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                <div className={`h-40 w-full bg-muted/40 relative overflow-hidden`}>
                  <img src={design.fileUrl || design.thumbnailUrl} alt={design.name} className="w-full h-full object-cover" />
                  <Badge 
                    className={`absolute top-3 left-3 font-bold border-none ${
                        design.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {design.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate pr-2">
                      <h3 className="font-bold text-sm tracking-tight truncate">{design.name || 'Untitled Design'}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold truncate">BY {design.user?.firstName?.toUpperCase() || 'GUEST'}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => handleUpdateStatus(design.id, !design.isApproved)}
                      title={design.isApproved ? 'Mark as Pending' : 'Approve'}
                    >
                      <CheckCircle2 className={`h-4 w-4 ${design.isApproved ? 'text-emerald-500' : 'text-muted-foreground'}`} />
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
