import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockTrips, mockBookings } from '@/lib/db/mock-data';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    const body = await request.json().catch(() => ({}));
    const { seatsCount = 1, passengerName, passengerPhone } = body;

    const qaRole = request.cookies.get('qa_user_role')?.value;
    const email = qaRole === 'rider' ? 'rider@gaza-transit.local' : (body.email || `rider-${Date.now()}@gaza-transit.local`);

    try {
      // Try Prisma Transaction
      const passenger = await prisma.user.upsert({
        where: { email },
        update: {
          name: passengerName || undefined,
          phone: passengerPhone || undefined,
        },
        create: {
          email,
          name: passengerName || 'راكب غزة',
          phone: passengerPhone || '+970599654321',
        },
      });

      const booking = await prisma.$transaction(async (tx) => {
        const trip = await tx.trip.findUnique({
          where: { id: tripId },
        });

        if (!trip || trip.status !== 'ACTIVE') {
          throw new Error('TRIP_UNAVAILABLE');
        }

        if (trip.availableSeats < seatsCount) {
          throw new Error('NO_SEATS_LEFT');
        }

        await tx.trip.update({
          where: { id: tripId },
          data: {
            availableSeats: {
              decrement: seatsCount,
            },
          },
        });

        const newBooking = await tx.booking.create({
          data: {
            tripId,
            passengerId: passenger.id,
            seatsCount,
            status: 'CONFIRMED',
          },
          include: {
            trip: {
              include: {
                driver: {
                  select: {
                    name: true,
                    phone: true,
                    vehicleType: true,
                  },
                },
              },
            },
          },
        });

        return newBooking;
      });

      return NextResponse.json(booking, { status: 201 });
    } catch (dbError: any) {
      if (dbError.message === 'NO_SEATS_LEFT') {
        return NextResponse.json({ error: 'عذراً، المقاعد اكتملت بالفعل' }, { status: 409 });
      }
      if (dbError.message === 'TRIP_UNAVAILABLE') {
        return NextResponse.json({ error: 'هذا المشوار لم يعد متاحاً' }, { status: 404 });
      }

      // Fallback to in-memory store
      console.warn('Postgres unreachable, booking in local mock store');
      const trip = mockTrips.find((t) => t.id === tripId);
      if (!trip || trip.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'هذا المشوار لم يعد متاحاً' }, { status: 404 });
      }
      if (trip.availableSeats < seatsCount) {
        return NextResponse.json({ error: 'عذراً، المقاعد اكتملت بالفعل' }, { status: 409 });
      }

      trip.availableSeats -= seatsCount;
      const newBooking = {
        id: `mock-booking-${Date.now()}`,
        tripId,
        seatsCount,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        trip: {
          ...trip,
          driver: trip.driver,
        },
        passenger: {
          name: passengerName || 'محمود',
          phone: passengerPhone || '+970599654321',
        },
      };

      if (!trip.bookings) trip.bookings = [];
      trip.bookings.push(newBooking);
      mockBookings.unshift(newBooking);

      return NextResponse.json(newBooking, { status: 201 });
    }
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'فشل إتمام الحجز' }, { status: 500 });
  }
}
