'use client';

import React from 'react';
import { useOnlineStatus } from '@/lib/offline/sync';
import { WifiOff, ShieldCheck } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between transition-all">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="font-medium">أنت غير متصل بالإنترنت</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>محفوظ على هذا الهاتف، سيتم الإرسال فور الاتصال</span>
      </div>
    </div>
  );
}
