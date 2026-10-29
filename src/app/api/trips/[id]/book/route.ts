import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

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

    // Ensure passenger exists
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

      // Atomically decrement seats
      const updatedTrip = await tx.trip.update({
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
  } catch (error: any) {
    if (error.message === 'NO_SEATS_LEFT') {
      return NextResponse.json({ error: 'عذراً، المقاعد اكتملت بالفعل' }, { status: 409 });
    }
    if (error.message === 'TRIP_UNAVAILABLE') {
      return NextResponse.json({ error: 'هذا المشوار لم يعد متاحاً' }, { status: 404 });
    }
    console.error('Booking transaction error:', error);
    return NextResponse.json({ error: 'فشل إتمام الحجز' }, { status: 500 });
  }
}
