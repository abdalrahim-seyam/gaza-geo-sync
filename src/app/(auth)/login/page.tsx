'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { User, Car, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [role, setRole] = useState<UserRole>('passenger');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<'AJALA' | 'CAR' | 'BUS'>('AJALA');
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (!name) {
      setName(selectedRole === 'driver' ? 'أبو العبد' : 'محمود');
    }
    if (!phone) {
      setPhone(selectedRole === 'driver' ? '+970599123456' : '+970599654321');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال الاسم الكريم');
      return;
    }
    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }

    login({
      name: name.trim(),
      phone: phone.trim(),
      role,
      vehicleType: role === 'driver' ? vehicleType : undefined,
    });

    if (role === 'driver') {
      router.push('/offer');
    } else {
      router.push('/trips');
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 mb-1">
          <span className="text-2xl font-black">م</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          تسجيل الدخول إلى مشوار
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed px-4">
          شبكة النقل والمشاوير والتوصيل التشاركي في قطاع غزة. حدد صفتك للاستمرار.
        </p>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleRoleSelect('passenger')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[110px] ${
            role === 'passenger'
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-600'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <div className={`p-2 rounded-xl ${role === 'passenger' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
              <User className="w-5 h-5" />
            </div>
            {role === 'passenger' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              أنا راكب
            </div>
            <div className="text-[11px] text-slate-500">
              أبحث عن مشوار وأحجز مقعد
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('driver')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[110px] ${
            role === 'driver'
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-600'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <div className={`p-2 rounded-xl ${role === 'driver' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
              <Car className="w-5 h-5" />
            </div>
            {role === 'driver' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              أنا سائق
            </div>
            <div className="text-[11px] text-slate-500">
              أطرح رحلاتي وأنقل الركاب
            </div>
          </div>
        </button>
      </div>

      {/* Form Details */}
      <form onSubmit={handleLogin} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            الاسم الكامل
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'driver' ? 'مثال: أبو العبد' : 'مثال: محمود محمد'}
            className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            رقم الهاتف للتواصل (جوال / أوريدو)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+970 59-xxxxxxx"
            dir="ltr"
            className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none transition-all text-left font-mono"
            required
          />
          <span className="block text-[10px] text-slate-400 mt-1">
            لا يظهر رقم هاتفك للعامة، بل للمشوار المحجوز فقط.
          </span>
        </div>

        {role === 'driver' && (
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              نوع المركبة
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'AJALA', label: 'عجلة (عربة)' },
                { type: 'CAR', label: 'سيارة (4-7)' },
                { type: 'BUS', label: 'باص' },
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    vehicleType === v.type
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick demo fill buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">حسابات تجريبية سريعة:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRole('passenger');
                setName('محمود سليم');
                setPhone('+970599654321');
              }}
              className="text-emerald-600 hover:underline font-medium text-[11px]"
            >
              دخول كراكب
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => {
                setRole('driver');
                setName('أبو أحمد النجار');
                setPhone('+970599123456');
                setVehicleType('AJALA');
              }}
              className="text-emerald-600 hover:underline font-medium text-[11px]"
            >
              دخول كسائق
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[44px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>دخول ومتابعة المشوار</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </form>

      {/* Security reassurance */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-2.5 text-xs text-slate-500">
        <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          يعمل التطبيق بدون اتصال بالإنترنت (Offline-first)، ويتم حفظ بيانات جلستك محلياً على جهازك لتسهيل التنقل داخل قطاع غزة.
        </p>
      </div>
    </div>
  );
}
