'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, PlusCircle, CalendarCheck, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isDriver = user?.role === 'driver';

  const navItems = [
    { label: 'استكشف', href: '/trips', icon: Compass },
    { label: isDriver ? 'طرح رحلة' : 'اطرح مشوار', href: '/offer', icon: PlusCircle },
    { label: isDriver ? 'رحلاتي' : 'حجوزاتي', href: '/bookings', icon: CalendarCheck },
    {
      label: user ? (user.role === 'driver' ? 'سائق' : 'حسابي') : 'دخول',
      href: user ? '/profile' : '/login',
      icon: user ? User : LogIn,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/trips' && pathname === '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
