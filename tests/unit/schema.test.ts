import { describe, it, expect } from 'vitest';
import { VehicleType, TripStatus, BookingStatus } from '@prisma/client';

describe('Prisma Schema Enums & Models', () => {
  it('defines the correct vehicle types according to gaza-transit-domain', () => {
    expect(VehicleType.CAR).toBe('CAR');
    expect(VehicleType.BUS).toBe('BUS');
    expect(VehicleType.AJALA).toBe('AJALA');
  });

  it('defines valid TripStatus values', () => {
    expect(TripStatus.ACTIVE).toBe('ACTIVE');
    expect(TripStatus.COMPLETED).toBe('COMPLETED');
    expect(TripStatus.CANCELLED).toBe('CANCELLED');
  });

  it('defines valid BookingStatus values', () => {
    expect(BookingStatus.CONFIRMED).toBe('CONFIRMED');
    expect(BookingStatus.CANCELLED).toBe('CANCELLED');
  });
});
