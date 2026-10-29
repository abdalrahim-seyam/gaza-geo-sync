import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockTrips, MockTrip } from '@/lib/db/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin')?.toLowerCase();
  const destination = searchParams.get('destination')?.toLowerCase();

  try {
    const whereClause: any = {
      status: 'ACTIVE',
      availableSeats: { gt: 0 },
    };

    if (origin) {
      whereClause.originName = { contains: origin, mode: 'insensitive' };
    }
    if (destination) {
      whereClause.destName = { contains: destination, mode: 'insensitive' };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      orderBy: { departureTime: 'asc' },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            vehiclePhotos: true,
          },
        },
      },
    });

    return NextResponse.json(trips);
  } catch (error: any) {
    // If PostgreSQL is not reachable, gracefully serve mock Gaza trips
    console.warn('Postgres unreachable, using local demo trips store:', error.message);
    let filtered = mockTrips.filter((t) => t.status === 'ACTIVE' && t.availableSeats > 0);
    if (origin) {
      filtered = filtered.filter((t) => t.originName.toLowerCase().includes(origin));
    }
    if (destination) {
      filtered = filtered.filter((t) => t.destName.toLowerCase().includes(destination));
    }
    return NextResponse.json(filtered);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      originName,
      originLat,
      originLng,
      destName,
      destLat,
      destLng,
      routePolyline,
      departureTime,
      totalSeats = 4,
      pricePerSeat = 10.0,
      driverName,
      driverPhone,
      vehicleType = 'AJALA',
    } = body;

    if (!originName || !destName || !departureTime) {
      return NextResponse.json({ error: 'يرجى تحديد مكان الانطلاق والوجهة ووقت الرحلة' }, { status: 400 });
    }

    const qaRole = request.cookies.get('qa_user_role')?.value;
    const email = qaRole === 'driver' ? 'driver@gaza-transit.local' : (body.email || `driver-${Date.now()}@gaza-transit.local`);
    const parsedDeparture = new Date(departureTime);

    try {
      const driver = await prisma.user.upsert({
        where: { email },
        update: {
          name: driverName || 'سائق المشوار',
          phone: driverPhone || '+970599123456',
          vehicleType: vehicleType,
        },
        create: {
          email,
          name: driverName || 'أبو العبد',
          phone: driverPhone || '+970599123456',
          vehicleType: vehicleType,
          vehiclePhotos: ['/demo-ajala.jpg'],
        },
      });

      const trip = await prisma.trip.create({
        data: {
          driverId: driver.id,
          originName,
          originLat: Number(originLat) || 31.45,
          originLng: Number(originLng) || 34.42,
          destName,
          destLat: Number(destLat) || 31.28,
          destLng: Number(destLng) || 34.25,
          routePolyline: routePolyline || '',
          departureTime: parsedDeparture,
          totalSeats: Number(totalSeats),
          availableSeats: Number(totalSeats),
          pricePerSeat: Number(pricePerSeat),
          status: 'ACTIVE',
        },
        include: {
          driver: {
            select: {
              name: true,
              phone: true,
              vehicleType: true,
            },
          },
        },
      });

      return NextResponse.json(trip, { status: 201 });
    } catch (dbError) {
      // In-memory fallback
      console.warn('Postgres unreachable, saving trip to local store');
      const newTrip: MockTrip = {
        id: `mock-trip-${Date.now()}`,
        driverId: `driver-${Date.now()}`,
        originName,
        originLat: Number(originLat) || 31.45,
        originLng: Number(originLng) || 34.42,
        destName,
        destLat: Number(destLat) || 31.28,
        destLng: Number(destLng) || 34.25,
        routePolyline: routePolyline || '',
        departureTime: parsedDeparture.toISOString(),
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        pricePerSeat: Number(pricePerSeat),
        status: 'ACTIVE',
        driver: {
          id: `driver-${Date.now()}`,
          name: driverName || 'سائق مشوار',
          phone: driverPhone || '+970599123456',
          vehicleType: vehicleType as any,
          vehiclePhotos: [],
        },
        bookings: [],
      };
      mockTrips.unshift(newTrip);
      return NextResponse.json(newTrip, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'فشل طرح المشوار' }, { status: 500 });
  }
}
