'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Car, MapPin, Phone, Users, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'rider' | 'driver'>('rider');
  const [data, setData] = useState<{ bookings: any[]; tripsOffered: any[] }>({
    bookings: [],
    tripsOffered: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/trips')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 max-w-md mx-auto pb-10">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-base font-bold text-slate-900 dark:text-white">مشاويري وسجل الحجوزات</h1>
        <p className="text-xs text-slate-500 mt-1">
          تابع رحلاتك القادمة وبيانات التواصل المباشر مع السائقين أو الركاب.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('rider')}
          className={`flex-1 py-2 rounded-lg transition-all min-h-[38px] ${
            activeTab === 'rider'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          حجوزاتي كراكب ({data.bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('driver')}
          className={`flex-1 py-2 rounded-lg transition-all min-h-[38px] ${
            activeTab === 'driver'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          مشاويري المطروحة ({data.tripsOffered.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'rider' ? (
        data.bookings.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs text-slate-500">ليس لديك أي حجوزات نشطة حالياً</p>
            <Link
              href="/trips"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              استكشف المشاوير المتاحة واحجز مقعدك
            </Link>
          </div>
        ) : (
          data.bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {b.trip?.driver?.name || 'سائق مشوار'}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {b.trip?.driver?.vehicleType === 'AJALA' ? 'عجلة' : 'سيارة'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  مؤكد ✓
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 py-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>من: {b.trip?.originName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>إلى: {b.trip?.destName}</span>
                </div>
              </div>

              {b.trip?.driver?.phone && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">للتواصل مع السائق:</span>
                  <a
                    href={`tel:${b.trip.driver.phone}`}
                    className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 dir-ltr"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {b.trip.driver.phone}
                  </a>
                </div>
              )}
            </div>
          ))
        )
      ) : (
        data.tripsOffered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs text-slate-500">لم تقم بطرح أي مشاوير بعد</p>
            <Link
              href="/offer"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              طرح مشوار جديد الآن
            </Link>
          </div>
        ) : (
          data.tripsOffered.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.originName} ← {t.destName}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {t.pricePerSeat} ₪ للمقعد
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600">
                  {t.availableSeats} / {t.totalSeats} مقاعد متبقية
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span>الركاب المسجلين: {t.bookings?.length || 0}</span>
                {t.bookings && t.bookings.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {t.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center text-[11px] bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                        <span>{booking.passenger?.name || 'راكب'} ({booking.seatsCount} مقعد)</span>
                        {booking.passenger?.phone && (
                          <a href={`tel:${booking.passenger.phone}`} className="text-emerald-600 dir-ltr font-mono">
                            {booking.passenger.phone}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
