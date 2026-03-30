'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

interface Design {
  id: string;
  name: string;
  imageUrl: string;
  user?: { email?: string };
  createdAt: string;
}

export default function AdminDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getDesigns();
        setDesigns(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  if (loading) return <div className="animate-pulse h-10 bg-divider rounded w-1/4"></div>;

  return (
    <div className="space-y-8 lg:space-y-12">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-main tracking-tight">User Designs Library</h1>
        <p className="text-muted text-sm font-medium mt-2">Review all custom artwork uploaded by users</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {designs.map(d => (
          <div key={d.id} className="group relative aspect-square bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-divider/60 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
            <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent opacity-90 flex flex-col justify-end p-5 lg:p-6 transition-opacity duration-300">
              <p className="text-white text-sm font-black truncate mb-1.5">{d.name}</p>
              <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest truncate line-clamp-1">{d.user?.email}</p>
              <p className="text-white/40 text-[9px] font-bold mt-2 uppercase tracking-widest">{new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {designs.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-divider/80">
            <div className="w-16 h-16 bg-secondary-bg rounded-2xl flex items-center justify-center text-muted mb-6 mx-auto rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
               </svg>
            </div>
            <h2 className="text-xl font-black text-main mb-2 tracking-tight">No Designs Yet</h2>
            <p className="text-muted text-sm font-medium">When users upload artwork, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
