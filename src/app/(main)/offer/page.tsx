'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bus, Clock, MapPin, Users, Banknote, CheckCircle, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';
import { queueOfflineMutation } from '@/lib/offline/sync';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function OfferTripPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    originName: '',
    destName: '',
    originLat: 31.4582,
    originLng: 34.4172,
    destLat: 31.2825,
    destLng: 34.2541,
    departureTime: '',
    totalSeats: 6,
    pricePerSeat: 15.0,
    vehicleType: 'AJALA',
    driverName: user?.name || 'أبو أحمد',
    driverPhone: user?.phone || '+970599123456',
  });

  // Pre-fill default departure time to 1 hour from now formatted for datetime-local
  useEffect(() => {
    const defaultDate = new Date(Date.now() + 3600 * 1000);
    const localIso = new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setForm((prev) => ({
      ...prev,
      departureTime: prev.departureTime || localIso,
      driverName: user?.name || prev.driverName,
      driverPhone: user?.phone || prev.driverPhone,
      vehicleType: user?.vehicleType || prev.vehicleType,
    }));
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const quickStops = [
    'مفترق الشهداء (نتساريم)',
    'شارع صلاح الدين - دير البلح',
    'دوار بني سهيلا - خانيونس',
    'دوار النجمة - رفح',
    'شارع الرشيد الساحلي - الميناء',
    'مواصي خانيونس',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        ...form,
        driverName: user?.name || form.driverName,
        driverPhone: user?.phone || form.driverPhone,
        totalSeats: Number(form.totalSeats),
        pricePerSeat: Number(form.pricePerSeat),
      };

      if (!navigator.onLine) {
        await queueOfflineMutation('CREATE_TRIP', '/api/trips', 'POST', payload);
        setSuccess(true);
        setTimeout(() => router.push('/trips'), 1500);
        return;
      }

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/trips'), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'تعذر نشر المشوار');
      }
    } catch (err: any) {
      await queueOfflineMutation('CREATE_TRIP', '/api/trips', 'POST', form);
      setSuccess(true);
      setTimeout(() => router.push('/trips'), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">طرح خط سير مشوار جديد</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            حدد مسارك اليومي وعدد المقاعد الشاغرة ليتمكن الركاب من الحجز.
          </p>
        </div>
        {!user && (
          <Link
            href="/login"
            className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-emerald-600 flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل</span>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">نوع وسيلة النقل</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, vehicleType: 'AJALA', totalSeats: 6 })}
              className={`p-3 rounded-xl border text-center transition-all min-h-[56px] ${
                form.vehicleType === 'AJALA'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="text-sm font-bold">عجلة</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">عربة ركاب</div>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, vehicleType: 'CAR', totalSeats: 4 })}
              className={`p-3 rounded-xl border text-center transition-all min-h-[56px] ${
                form.vehicleType === 'CAR'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="text-sm font-bold">سيارة</div>
              <div className="text-[10px] text-slate-500 mt-0.5">٤-٧ مقاعد</div>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, vehicleType: 'BUS', totalSeats: 12 })}
              className={`p-3 rounded-xl border text-center transition-all min-h-[56px] ${
                form.vehicleType === 'BUS'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="text-sm font-bold">باص</div>
              <div className="text-[10px] text-slate-500 mt-0.5">ميكروباص</div>
            </button>
          </div>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">مكان الانطلاق</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute start-3 top-3.5" />
              <input
                type="text"
                required
                value={form.originName}
                onChange={(e) => setForm({ ...form, originName: e.target.value })}
                placeholder="مثال: مفترق الشهداء (نتساريم)"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">الوجهة النهائية</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-500 absolute start-3 top-3.5" />
              <input
                type="text"
                required
                value={form.destName}
                onChange={(e) => setForm({ ...form, destName: e.target.value })}
                placeholder="مثال: دوار النجمة، رفح"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Quick preset suggestions */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1.5">أماكن ومواقف شائعة:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickStops.map((stop) => (
                <button
                  key={stop}
                  type="button"
                  onClick={() => {
                    if (!form.originName) setForm({ ...form, originName: stop });
                    else if (!form.destName) setForm({ ...form, destName: stop });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors"
                >
                  {stop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Departure Time & Pricing */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">موعد الرحلة</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
              <input
                type="datetime-local"
                required
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">المقاعد المتاحة</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.totalSeats}
                  onChange={(e) => setForm({ ...form, totalSeats: Number(e.target.value) })}
                  className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">الأجرة لكل مقعد (₪)</label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={form.pricePerSeat}
                  onChange={(e) => setForm({ ...form, pricePerSeat: Number(e.target.value) })}
                  className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Driver identity preview */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">بيانات السائق الناشر:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name || form.driverName}</span>
            <span className="text-slate-500 font-mono ms-2 dir-ltr">{user?.phone || form.driverPhone}</span>
          </div>
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline text-[11px]">
            تعديل
          </Link>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>تم نشر المشوار بنجاح! جاري الانتقال لقائمة المشاوير...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-md transition-all min-h-[48px] touch-action-manipulation"
        >
          {submitting ? 'جاري الحفظ والنشر...' : 'نشر المشوار الآن'}
        </button>
      </form>
    </div>
  );
}
