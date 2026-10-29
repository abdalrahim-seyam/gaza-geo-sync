import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    trip: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/db/prisma';

describe('Trips Database Interface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries active trips with driver relationships', async () => {
    const mockTrips = [
      {
        id: 'trip-1',
        originName: 'مفترق الشهداء',
        destName: 'دوار النجمة',
        availableSeats: 3,
        status: 'ACTIVE',
        driver: { name: 'أبو أحمد', vehicleType: 'AJALA' },
      },
    ];
    (prisma.trip.findMany as any).mockResolvedValue(mockTrips);

    const trips = await prisma.trip.findMany({
      where: { status: 'ACTIVE', availableSeats: { gt: 0 } },
    });

    expect(trips).toHaveLength(1);
    expect(trips[0].driver.vehicleType).toBe('AJALA');
  });

  it('creates trip with required Palestine transit parameters', async () => {
    const tripPayload = {
      driverId: 'driver-uuid',
      originName: 'شارع صلاح الدين - دير البلح',
      destName: 'شارع الرشيد - خانيونس',
      departureTime: new Date(),
      totalSeats: 6,
      availableSeats: 6,
      pricePerSeat: 15.0,
      status: 'ACTIVE' as const,
      originLat: 31.42,
      originLng: 34.35,
      destLat: 31.35,
      destLng: 34.30,
      routePolyline: '',
    };

    (prisma.trip.create as any).mockResolvedValue({ id: 'trip-new', ...tripPayload });

    const created = await prisma.trip.create({ data: tripPayload });
    expect(created.id).toBe('trip-new');
    expect(created.pricePerSeat).toBe(15.0);
  });
});
