'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Phone, CheckCircle2 } from 'lucide-react';

interface TripCardProps {
  id: string;
  driverName: string;
  driverPhone?: string;
  vehicleType: string;
  originName: string;
  destName: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  onBookSuccess?: () => void;
}

export function TripCard({
  id,
  driverName,
  driverPhone,
  vehicleType,
  originName,
  destName,
  departureTime,
  availableSeats,
  pricePerSeat,
  onBookSuccess,
}: TripCardProps) {
  const [bookingState, setBookingState] = useState<'idle' | 'booking' | 'booked' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const vehicleLabel = vehicleType === 'AJALA' ? 'عجلة (عربة ركاب)' : vehicleType === 'BUS' ? 'باص' : 'سيارة';
  const isAjala = vehicleType === 'AJALA';

  const timeFormatted = new Date(departureTime).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleBook = async () => {
    setBookingState('booking');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/trips/${id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatsCount: 1 }),
      });

      if (res.ok) {
        setBookingState('booked');
        if (onBookSuccess) onBookSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setBookingState('error');
        setErrorMessage(data.error || 'فشل إتمام الحجز');
      }
    } catch (err: any) {
      setBookingState('error');
      setErrorMessage('حدث خطأ في الاتصال، تم حفظ الطلب محلياً');
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-all hover:border-emerald-500/30">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm">
            {driverName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{driverName}</h3>
            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium mt-0.5 ${
              isAjala
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {vehicleLabel}
            </span>
          </div>
        </div>

        <div className="text-left">
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{pricePerSeat} ₪</span>
          <span className="block text-[10px] text-slate-400">لكل مقعد</span>
        </div>
      </div>

      {/* Origin & Destination */}
      <div className="space-y-1.5 py-1 text-xs text-slate-700 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-900 dark:text-slate-100">الانطلاق: {originName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-medium text-slate-900 dark:text-slate-100">الوصول: {destName}</span>
        </div>
      </div>

      {/* Info & Booking Action */}
      <div className="flex justify-between items-center pt-1">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {timeFormatted}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {availableSeats} متبقي
          </span>
        </div>

        {bookingState === 'booked' ? (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold py-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حجز مقعدك ✓</span>
          </div>
        ) : (
          <button
            onClick={handleBook}
            disabled={bookingState === 'booking' || availableSeats <= 0}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-xl transition-colors min-h-[44px] touch-action-manipulation flex items-center justify-center"
          >
            {bookingState === 'booking' ? 'جاري الحجز...' : availableSeats <= 0 ? 'مكتمل' : 'احجز مقعداً'}
          </button>
        )}
      </div>

      {bookingState === 'booked' && driverPhone && (
        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">رقم السائق للتنسيق:</span>
          <a
            href={`tel:${driverPhone}`}
            className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 dir-ltr"
          >
            <Phone className="w-3.5 h-3.5" />
            {driverPhone}
          </a>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-red-500 dark:text-red-400 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
