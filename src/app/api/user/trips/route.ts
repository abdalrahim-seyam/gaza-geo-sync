import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const qaRole = request.cookies.get('qa_user_role')?.value;
    const email = qaRole === 'driver' ? 'driver@gaza-transit.local' : 'rider@gaza-transit.local';

    // Find user
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
      // Return empty structure if not created yet
      return NextResponse.json({ bookings: [], tripsOffered: [] });
    }

    return NextResponse.json({
      bookings: user.bookings,
      tripsOffered: user.tripsOffered,
    });
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return NextResponse.json({ error: 'تعذر جلب البيانات' }, { status: 500 });
  }
}
