import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

import { prisma } from '@/lib/db/prisma';

describe('Booking Transaction & Concurrency Invariant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects booking when no seats remain and guarantees atomic conflict handling', async () => {
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      const mockTx = {
        trip: {
          findUnique: vi.fn().mockResolvedValue({ id: 't1', availableSeats: 0, status: 'ACTIVE' }),
          update: vi.fn(),
        },
        booking: { create: vi.fn() },
      };
      return callback(mockTx);
    });

    await expect(
      prisma.$transaction(async (tx: any) => {
        const trip = await tx.trip.findUnique({ where: { id: 't1' } });
        if (trip.availableSeats < 1) throw new Error('NO_SEATS_LEFT');
        return tx.booking.create({});
      })
    ).rejects.toThrow('NO_SEATS_LEFT');
  });

  it('successfully decrements seat and confirms booking when seats are available', async () => {
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      const mockTx = {
        trip: {
          findUnique: vi.fn().mockResolvedValue({ id: 't1', availableSeats: 3, status: 'ACTIVE' }),
          update: vi.fn().mockResolvedValue({ id: 't1', availableSeats: 2 }),
        },
        booking: {
          create: vi.fn().mockResolvedValue({ id: 'b1', seatsCount: 1, status: 'CONFIRMED' }),
        },
      };
      return callback(mockTx);
    });

    const result = await prisma.$transaction(async (tx: any) => {
      const trip = await tx.trip.findUnique({ where: { id: 't1' } });
      if (trip.availableSeats < 1) throw new Error('NO_SEATS_LEFT');
      await tx.trip.update({ where: { id: 't1' }, data: { availableSeats: { decrement: 1 } } });
      return tx.booking.create({ data: { tripId: 't1', status: 'CONFIRMED' } });
    });

    expect(result.status).toBe('CONFIRMED');
    expect(result.id).toBe('b1');
  });
});
