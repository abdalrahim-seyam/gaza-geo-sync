import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { AuthProvider } from '@/contexts/AuthContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cairo',
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
        <AuthProvider>
          <AppHeader />
          <main className="flex-1 pb-20 max-w-md w-full mx-auto px-4 pt-4">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
