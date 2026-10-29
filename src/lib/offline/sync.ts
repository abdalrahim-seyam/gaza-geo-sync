'use client';

import { useState, useEffect } from 'react';
import { offlineDb, OutboxItem, CachedTrip } from './db';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      drainOutbox();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export async function queueOfflineMutation(
  action: OutboxItem['action'],
  endpoint: string,
  method: OutboxItem['method'],
  payload: any
): Promise<string> {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `outbox-${Date.now()}`;

  if (offlineDb) {
    await offlineDb.outbox.add({
      uuid,
      action,
      endpoint,
      method,
      payload,
      createdAt: Date.now(),
      status: 'pending',
    });

    // If online right now, attempt immediate background flush
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      drainOutbox().catch(console.error);
    }
  }

  return uuid;
}

export async function drainOutbox(): Promise<{ syncedCount: number; errors: number }> {
  if (!offlineDb || typeof navigator === 'undefined' || !navigator.onLine) {
    return { syncedCount: 0, errors: 0 };
  }

  const pendingItems = await offlineDb.outbox
    .where('status')
    .equals('pending')
    .toArray();

  let syncedCount = 0;
  let errors = 0;

  for (const item of pendingItems) {
    try {
      if (!item.id) continue;
      await offlineDb.outbox.update(item.id, { status: 'syncing' });

      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': item.uuid,
        },
        body: JSON.stringify(item.payload),
      });

      if (response.ok) {
        await offlineDb.outbox.delete(item.id);
        syncedCount++;
      } else {
        const errData = await response.json().catch(() => ({}));
        await offlineDb.outbox.update(item.id, {
          status: 'failed',
          errorMessage: errData.error || 'Server rejected mutation',
        });
        errors++;
      }
    } catch (err: any) {
      if (item.id) {
        await offlineDb.outbox.update(item.id, {
          status: 'pending',
          errorMessage: err.message,
        });
      }
      errors++;
    }
  }

  return { syncedCount, errors };
}
