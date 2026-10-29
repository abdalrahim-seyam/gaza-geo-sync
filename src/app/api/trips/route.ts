import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

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
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'تعذر جلب المشاوير' }, { status: 500 });
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

    // Identify or upsert the driver (supports QA mode demo driver or custom driver)
    const qaRole = request.cookies.get('qa_user_role')?.value;
    const email = qaRole === 'driver' ? 'driver@gaza-transit.local' : (body.email || `driver-${Date.now()}@gaza-transit.local`);

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

    const parsedDeparture = new Date(departureTime);

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
  } catch (error: any) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'فشل طرح المشوار' }, { status: 500 });
  }
}
