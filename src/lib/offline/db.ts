import Dexie, { Table } from 'dexie';

export interface CachedTrip {
  id: string;
  driverName: string;
  vehicleType: string;
  driverPhone?: string;
  originName: string;
  destName: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  routePolyline?: string;
  syncStatus: 'synced' | 'pending';
}

export interface CachedBooking {
  id: string;
  tripId: string;
  seatsCount: number;
  status: string;
  driverName?: string;
  originName?: string;
  destName?: string;
  syncStatus: 'synced' | 'pending';
}

export interface OutboxItem {
  id?: number;
  uuid: string; // Idempotency key
  action: 'CREATE_TRIP' | 'BOOK_SEAT' | 'CREATE_REQUEST';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  createdAt: number;
  status: 'pending' | 'syncing' | 'failed';
  errorMessage?: string;
}

export class MmshwarDatabase extends Dexie {
  trips!: Table<CachedTrip, string>;
  bookings!: Table<CachedBooking, string>;
  outbox!: Table<OutboxItem, number>;

  constructor() {
    super('MmshwarGazaDB');
    this.version(1).stores({
      trips: 'id, departureTime, syncStatus',
      bookings: 'id, tripId, syncStatus',
      outbox: '++id, uuid, action, status, createdAt',
    });
  }
}

export const offlineDb = typeof window !== 'undefined' ? new MmshwarDatabase() : (null as any);
