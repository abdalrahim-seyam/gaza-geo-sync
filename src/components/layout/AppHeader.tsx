'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, Car, LogIn } from 'lucide-react';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export function AppHeader() {
  const { user, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
      <div className="flex justify-between items-center h-12 px-4 max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">مشوار</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
            غزة
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-1.5">
              {/* Quick Role Switcher Pill */}
              <button
                type="button"
                onClick={() => switchRole(user.role === 'driver' ? 'passenger' : 'driver')}
                title="اضغط للتبديل بين وضع السائق والراكب"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {user.role === 'driver' ? (
                  <>
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400">سائق</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-400">راكب</span>
                  </>
                )}
                <span className="text-[10px] text-slate-400 font-normal mr-0.5">تبديل</span>
              </button>

              <Link
                href="/profile"
                className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm"
              >
                {user.name.charAt(0)}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول</span>
            </Link>
          )}
        </div>
      </div>
      <OfflineBanner />
    </header>
  );
}
