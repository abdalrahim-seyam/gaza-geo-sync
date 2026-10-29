import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مشوار | مواصلات غزة',
  description: 'منصة نقل وتشارك المشاوير في قطاع غزة - تعمل بدون إنترنت',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'مشوار',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col`}>
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
          <div className="flex justify-between items-center h-12 px-4 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">مشوار</h1>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
              قطاع غزة
            </span>
          </div>
          <OfflineBanner />
        </header>

        <main className="flex-1 pb-20 max-w-md w-full mx-auto px-4 pt-4">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
