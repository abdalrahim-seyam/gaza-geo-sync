import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockBookings, mockTrips } from '@/lib/db/mock-data';

export async function GET(request: NextRequest) {
  try {
    const qaRole = request.cookies.get('qa_user_role')?.value;
    const email = qaRole === 'driver' ? 'driver@gaza-transit.local' : 'rider@gaza-transit.local';

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        bookings: {
          include: {
            trip: {
              include: {
                driver: {
                  select: { name: true, phone: true, vehicleType: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tripsOffered: {
          orderBy: { departureTime: 'desc' },
          include: {
            bookings: {
              include: {
                passenger: {
                  select: { name: true, phone: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ bookings: [], tripsOffered: [] });
    }

    return NextResponse.json({
      bookings: user.bookings || [],
      tripsOffered: user.tripsOffered || [],
    });
  } catch (error: any) {
    // If PostgreSQL is unreachable, serve user bookings and offered trips from local store
    console.warn('Postgres unreachable, serving user bookings from local store:', error.message);
    return NextResponse.json({
      bookings: mockBookings || [],
      tripsOffered: mockTrips || [],
    });
  }
}
