// In-memory demo fallback store when PostgreSQL server is not running locally

export interface MockDriver {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'AJALA' | 'CAR' | 'BUS';
  vehiclePhotos: string[];
}

export interface MockTrip {
  id: string;
  driverId: string;
  originName: string;
  originLat: number;
  originLng: number;
  destName: string;
  destLat: number;
  destLng: number;
  routePolyline?: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  driver: MockDriver;
  bookings?: any[];
}

// Global persistent in-memory singleton across hot reload in development
const globalForMock = globalThis as unknown as {
  _mockTrips?: MockTrip[];
  _mockBookings?: any[];
};

export const mockTrips: MockTrip[] = globalForMock._mockTrips || [
  {
    id: 'demo-trip-1',
    driverId: 'driver-abu-ahmed',
    originName: 'مفترق الشهداء (نتساريم) - صلاح الدين',
    originLat: 31.4582,
    originLng: 34.4172,
    destName: 'دوار النجمة، رفح',
    destLat: 31.2825,
    destLng: 34.2541,
    departureTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    totalSeats: 6,
    availableSeats: 4,
    pricePerSeat: 15,
    status: 'ACTIVE',
    driver: {
      id: 'driver-abu-ahmed',
      name: 'أبو أحمد',
      phone: '+970599123456',
      vehicleType: 'AJALA',
      vehiclePhotos: ['/demo-ajala.jpg'],
    },
    bookings: [],
  },
  {
    id: 'demo-trip-2',
    driverId: 'driver-mahmoud',
    originName: 'مفترق النابلسي - شارع الرشيد الساحلي',
    originLat: 31.4721,
    originLng: 34.4022,
    destName: 'مواصي خانيونس، الساحلي',
    destLat: 31.3321,
    destLng: 34.2654,
    departureTime: new Date(Date.now() + 7200 * 1000).toISOString(),
    totalSeats: 4,
    availableSeats: 3,
    pricePerSeat: 20,
    status: 'ACTIVE',
    driver: {
      id: 'driver-mahmoud',
      name: 'محمود كمال',
      phone: '+970599234567',
      vehicleType: 'CAR',
      vehiclePhotos: [],
    },
    bookings: [],
  },
  {
    id: 'demo-trip-3',
    driverId: 'driver-sleiman',
    originName: 'مدخل دير البلح - شارع صلاح الدين',
    originLat: 31.4182,
    originLng: 34.3512,
    destName: 'مفترق بني سهيلا، خانيونس',
    destLat: 31.3452,
    destLng: 34.3125,
    departureTime: new Date(Date.now() + 10800 * 1000).toISOString(),
    totalSeats: 14,
    availableSeats: 8,
    pricePerSeat: 10,
    status: 'ACTIVE',
    driver: {
      id: 'driver-sleiman',
      name: 'سليمان أبو غالي',
      phone: '+970599345678',
      vehicleType: 'BUS',
      vehiclePhotos: [],
    },
    bookings: [],
  },
];

export const mockBookings: any[] = globalForMock._mockBookings || [];

if (process.env.NODE_ENV !== 'production') {
  globalForMock._mockTrips = mockTrips;
  globalForMock._mockBookings = mockBookings;
}
