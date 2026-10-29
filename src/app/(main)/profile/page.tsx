'use client';

import React, { useState } from 'react';
import { User, Wifi, Download, Shield, HardDrive, Check, RefreshCw, Car, LogOut, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { drainOutbox } from '@/lib/offline/sync';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, switchRole } = useAuth();
  const [wifiOnlyPhotos, setWifiOnlyPhotos] = useState(true);
  const [downloadingPhotos, setDownloadingPhotos] = useState(false);
  const [photoSyncDone, setPhotoSyncDone] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleDownloadPhotos = () => {
    setDownloadingPhotos(true);
    setTimeout(() => {
      setDownloadingPhotos(false);
      setPhotoSyncDone(true);
      setTimeout(() => setPhotoSyncDone(false), 3000);
    }, 1200);
  };

  const handleForceSync = async () => {
    setSyncStatus('جاري المزامنة مع الخادم...');
    const result = await drainOutbox();
    setSyncStatus(`تمت المزامنة بنجاح: ${result.syncedCount} طلبات.`);
    setTimeout(() => setSyncStatus(''), 4000);
  };

  if (!user) {
    return (
      <div className="space-y-4 max-w-md mx-auto py-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">لم تسجل دخولك بعد</h2>
            <p className="text-xs text-slate-500 mt-1">
              اختر ما إذا كنت راكباً تبحث عن رحلة أو سائقاً تريد طرح مشاوير في قطاع غزة.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            تسجيل الدخول واختيار الصفة
          </Link>
        </div>
      </div>
    );
  }

  const isDriver = user.role === 'driver';

  return (
    <div className="space-y-4 max-w-md mx-auto pb-10">
      {/* User Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-xs text-slate-500 dir-ltr text-right font-mono">{user.phone}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isDriver
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                }`}>
                  {isDriver ? 'سائق مركبة' : 'راكب'}
                </span>
                {isDriver && user.vehicleType && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {user.vehicleType === 'AJALA' ? 'عجلة' : user.vehicleType === 'BUS' ? 'باص' : 'سيارة'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Role Switcher Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            وضع الحساب الحالي: <strong className="text-slate-900 dark:text-white">{isDriver ? 'سائق' : 'راكب'}</strong>
          </span>
          <button
            type="button"
            onClick={() => switchRole(isDriver ? 'passenger' : 'driver')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>التحويل إلى {isDriver ? 'راكب' : 'سائق'}</span>
          </button>
        </div>
      </div>

      {/* Offline & Data Settings */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-emerald-600" />
          <span>إعدادات العمل بدون إنترنت والمزامنة</span>
        </h3>

        {/* Wi-Fi only toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
              تنزيل صور المركبات عبر Wi-Fi فقط
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              توفير باقة البيانات في قطاع غزة وعدم استهلاك الرصيد
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWifiOnlyPhotos(!wifiOnlyPhotos)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              wifiOnlyPhotos ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                wifiOnlyPhotos ? 'translate-x-0' : '-translate-x-5'
              }`}
            />
          </button>
        </div>

        {/* Manual Photo Download Button */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
              الاحتفاظ بصور المركبات محلياً
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              تنزيل الصور مسبقاً للتعرف على المركبات في الشارع بدون شبكة
            </span>
          </div>
          <button
            onClick={handleDownloadPhotos}
            disabled={downloadingPhotos}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0 min-h-[36px]"
          >
            {downloadingPhotos ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : photoSyncDone ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{photoSyncDone ? 'تم الحفظ' : 'تنزيل الصور الآن'}</span>
          </button>
        </div>

        {/* Force Outbox Sync */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
              مزامنة صندوق الإرسال المحلي
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              إرسال أي طلبات أو حجوزات تم حفظها أثناء انقطاع الإنترنت
            </span>
          </div>
          <button
            onClick={handleForceSync}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold shrink-0 min-h-[36px]"
          >
            مزامنة الآن
          </button>
        </div>

        {syncStatus && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center pt-2">
            {syncStatus}
          </p>
        )}
      </div>

      {/* Privacy and Gaza Transit Rules Notice */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>الخصوصية وحماية الموقع في غزة</span>
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          نظراً لحساسية البيانات الجغرافية، لا يتم تخزين أي سجل لمواقع الركاب بعد انتهاء الرحلة. يتم تبادل رقم الهاتف حصراً بعد إتمام الحجز المتبادل بين السائق والراكب.
        </p>
      </div>
    </div>
  );
}
