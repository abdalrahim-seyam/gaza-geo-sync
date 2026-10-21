export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          أهلاً بك في مشوار
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          خطوط المواصلات العامة بين مدن قطاع غزة على شارعي صلاح الدين والرشيد.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">عجلة</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">الوسيلة الأكثر انتشاراً</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">سيارات وباصات</div>
          <div className="text-xs text-slate-500 mt-1">خطوط رئيسية يومية</div>
        </div>
      </div>
    </div>
  );
}
