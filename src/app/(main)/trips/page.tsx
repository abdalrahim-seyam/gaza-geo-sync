'use client';

import React, { useEffect, useState } from 'react';
import { GazaMap } from '@/components/map/GazaMap';
import { TripCard } from '@/components/trips/TripCard';
import { Search, SlidersHorizontal, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';

interface Trip {
  id: string;
  originName: string;
  originLat: number;
  originLng: number;
  destName: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  driver: {
    id: string;
    name: string;
    phone?: string;
    vehicleType: string;
  };
}

export default function TripsDiscoveryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'salah' | 'rashid'>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
        if (data.length > 0 && !selectedTrip) {
          setSelectedTrip(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((t) => {
    if (activeFilter === 'salah') {
      return t.originName.includes('صلاح الدين') || t.destName.includes('صلاح الدين');
    }
    if (activeFilter === 'rashid') {
      return t.originName.includes('الرشيد') || t.destName.includes('الرشيد') || t.originName.includes('البحر') || t.destName.includes('البحر');
    }
    return true;
  });

  return (
    <div className="space-y-4 -mx-4 -mt-4">
      {/* Top Half: Interactive Map */}
      <div className="h-[36dvh] w-full border-b border-slate-200 dark:border-slate-800 relative">
        <GazaMap
          origin={selectedTrip ? { lat: selectedTrip.originLat, lng: selectedTrip.originLng, name: selectedTrip.originName } : undefined}
          destination={selectedTrip ? { lat: selectedTrip.destLat, lng: selectedTrip.destLng, name: selectedTrip.destName } : undefined}
          routeCoordinates={selectedTrip ? [
            [selectedTrip.originLng, selectedTrip.originLat],
            [(selectedTrip.originLng + selectedTrip.destLng) / 2, (selectedTrip.originLat + selectedTrip.destLat) / 2 + 0.005],
            [selectedTrip.destLng, selectedTrip.destLat],
          ] : undefined}
        />

        {/* Floating Quick Action */}
        <div className="absolute top-3 start-3 z-10">
          <Link
            href="/offer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/95 hover:bg-emerald-700 text-white text-xs font-semibold shadow-lg backdrop-blur min-h-[36px]"
          >
            <Plus className="w-4 h-4" />
            <span>اطرح مشوارك</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 space-y-3 pb-6">
        {/* Corridor Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 min-h-[36px] ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            جميع المشاوير ({trips.length})
          </button>
          <button
            onClick={() => setActiveFilter('salah')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 min-h-[36px] ${
              activeFilter === 'salah'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            شارع صلاح الدين
          </button>
          <button
            onClick={() => setActiveFilter('rashid')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 min-h-[36px] ${
              activeFilter === 'rashid'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            شارع الرشيد الساحلي
          </button>
        </div>

        {/* Trips Header */}
        <div className="flex justify-between items-center pt-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            المشاوير المتاحة الآن
          </h2>
          <button
            onClick={fetchTrips}
            disabled={loading}
            className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 p-1 min-h-[36px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
        </div>

        {/* Trips List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              لا توجد مشاوير نشطة في هذا المسار حالياً
            </p>
            <Link
              href="/offer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl hover:bg-emerald-100"
            >
              <Plus className="w-4 h-4" />
              <span>كن أول من يطرح مشواراً في هذا الخط</span>
            </Link>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className={`cursor-pointer transition-transform ${selectedTrip?.id === trip.id ? 'ring-2 ring-emerald-500 rounded-2xl' : ''}`}
            >
              <TripCard
                id={trip.id}
                driverName={trip.driver?.name || 'سائق مشوار'}
                driverPhone={trip.driver?.phone}
                vehicleType={trip.driver?.vehicleType || 'AJALA'}
                originName={trip.originName}
                destName={trip.destName}
                departureTime={trip.departureTime}
                availableSeats={trip.availableSeats}
                pricePerSeat={trip.pricePerSeat}
                onBookSuccess={fetchTrips}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
