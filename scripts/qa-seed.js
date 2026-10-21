// scripts/qa-seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding QA demonstration data for Gaza transit...');

  // Upsert demo driver
  const driver = await prisma.user.upsert({
    where: { email: 'driver@gaza-transit.local' },
    update: {},
    create: {
      name: 'أبو أحمد',
      email: 'driver@gaza-transit.local',
      phone: '+970599123456',
      vehicleType: 'AJALA',
      vehiclePhotos: ['/demo-ajala.jpg'],
    },
  });

  // Upsert demo rider
  const rider = await prisma.user.upsert({
    where: { email: 'rider@gaza-transit.local' },
    update: {},
    create: {
      name: 'محمود',
      email: 'rider@gaza-transit.local',
      phone: '+970599654321',
    },
  });

  // Seed sample active trip on Salah al-Din road
  const trip = await prisma.trip.create({
    data: {
      driverId: driver.id,
      originName: 'مفترق الشهداء (نتساريم)',
      originLat: 31.4582,
      originLng: 34.4172,
      destName: 'دوار النجمة، رفح',
      destLat: 31.2825,
      destLng: 34.2541,
      routePolyline: 'encoded_sample_polyline_gaza_salah_al_din',
      departureTime: new Date(Date.now() + 3600 * 1000), // in 1 hour
      totalSeats: 6,
      availableSeats: 4,
      pricePerSeat: 15.0,
      status: 'ACTIVE',
    },
  });

  console.log(`QA Demo Data Seeded: Driver ${driver.name}, Rider ${rider.name}, Trip ${trip.id}`);
}

main()
  .catch((e) => {
    console.error('QA Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
