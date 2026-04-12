'use client';

import * as React from 'react';
import { Printer, Settings, Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ProductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Printing & Production</h1>
        <p className="text-muted-foreground mt-1">Monitor real-time printing status and machine health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'DTG Printer #1', status: 'Printing', job: 'PW-1022', progress: 65, type: 'Direct to Garment' },
          { name: 'Plotter #A', status: 'Idle', job: 'None', progress: 0, type: 'Vinyl Cutting' },
          { name: 'Heat Press #4', status: 'Maintenance', job: 'None', progress: 0, type: 'Curing/Transfer' },
        ].map((machine) => (
          <Card key={machine.name} className="border-border/40 shadow-sm group">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  {machine.name}
                </CardTitle>
                <Badge variant="outline" className={`
                   font-bold border-none text-[10px] uppercase
                   ${machine.status === 'Printing' ? 'bg-emerald-500 text-white' : ''}
                   ${machine.status === 'Idle' ? 'bg-blue-500 text-white' : ''}
                   ${machine.status === 'Maintenance' ? 'bg-destructive text-white' : ''}
                `}>
                  {machine.status}
                </Badge>
              </div>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">{machine.type}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
               {machine.status === 'Printing' ? (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span>Job ID: <span className="text-primary font-mono">{machine.job}</span></span>
                       <span>{machine.progress}%</span>
                    </div>
                    <Progress value={machine.progress} className="h-2 rounded-full" />
                 </div>
               ) : (
                 <div className="h-10 flex items-center justify-center text-xs font-bold text-muted-foreground italic bg-muted/30 rounded-lg">
                    {machine.status === 'Idle' ? 'Ready for next job' : 'Offline for repairs'}
                 </div>
               )}
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5">
                     <Settings className="h-4 w-4" />
                     Settings
                  </Button>
                  {machine.status === 'Printing' ? (
                     <Button variant="destructive" size="sm" className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5">
                        <Pause className="h-4 w-4" />
                        Pause
                     </Button>
                  ) : (
                     <Button className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5" disabled={machine.status === 'Maintenance'}>
                        <Play className="h-4 w-4" />
                        Start Job
                     </Button>
                  )}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-border/40 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Quality Check Queue
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10">
                       <span className="font-bold text-sm">#PW-1018 (3 Items)</span>
                       <Button size="sm" variant="outline" className="h-7 text-[10px] font-black uppercase tracking-wider rounded-lg border-primary/20 hover:bg-primary/10 hover:text-primary">Inspect</Button>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
         <Card className="border-border/40 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Daily Production Yield
               </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-1 mb-2">
                   <div className="text-4xl font-black">42</div>
                   <div className="text-xs text-muted-foreground font-bold mb-1">/ 50 Target</div>
                </div>
                <Progress value={84} className="h-3 rounded-full bg-muted" />
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
