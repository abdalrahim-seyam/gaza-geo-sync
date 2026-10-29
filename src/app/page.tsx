import Link from 'next/link';
import { Compass, PlusCircle, User, Car, LogIn } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* Hero Welcome Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
            شبكة مواصلات قطاع غزة
          </span>
          <span className="text-[11px] text-slate-400">Offline-first PWA</span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            مشوار | ركاب وسائقين معاً
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
            خطوط المواصلات العامة والتنقل بين مدن ومخيمات قطاع غزة على شارعي صلاح الدين والرشيد.
          </p>
        </div>

        {/* Primary Role Choice Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            href="/trips"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm group min-h-[90px]"
          >
            <Compass className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs">أنا راكب</span>
            <span className="text-[10px] text-emerald-100 opacity-90">استكشف واحجز</span>
          </Link>

          <Link
            href="/offer"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-all shadow-sm group min-h-[90px]"
          >
            <PlusCircle className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform text-emerald-400" />
            <span className="font-bold text-xs">أنا سائق</span>
            <span className="text-[10px] text-slate-300">اطرح مشوار جديد</span>
          </Link>
        </div>

        {/* Login / Identity Link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">هل تريد تثبيت هويتك وبياناتك؟</span>
          <Link
            href="/login"
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول / اختيار الصفة</span>
          </Link>
        </div>
      </div>

      {/* Transit corridors summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">عجلة</div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mt-1">الوسيلة الأكثر انتشاراً</div>
          <div className="text-[10px] text-slate-500 mt-0.5">عربات ركاب مفتوحة</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">سيارات وباصات</div>
          <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1">خطوط رئيسية يومية</div>
          <div className="text-[10px] text-slate-500 mt-0.5">صلاح الدين والرشيد</div>
        </div>
      </div>
    </div>
  );
}
