# Offline Sync & Storage Reference

## IndexedDB Outbox Structure
```typescript
interface OutboxRecord {
  id: string; // Client UUID
  endpoint: string; // Target API endpoint
  method: 'POST' | 'PUT' | 'DELETE';
  payload: Record<string, unknown>;
  createdAt: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
}
```

## Byte Budget Standards
* **Regular Delta Sync (JSON)**: Maximum 10 KB per request/response payload.
* **Map Tile Pre-cache**: Maximum 50 MB total storage budget across active transit corridors.
* **Vehicle Photo Cache**: Excluded from mobile data; max 150 KB per compressed photo.

## Safari Metered Network Fallback
```typescript
export function shouldAutoDownloadPhotos(userPreference: 'always' | 'wifi_only' | 'manual'): boolean {
  if (userPreference === 'manual') return false;
  // iOS Safari navigator.connection check
  const connection = (navigator as any).connection;
  if (!connection) {
    // Cannot determine metered status: safe default is OFF
    return false;
  }
  return connection.type === 'wifi' || connection.saveData === false;
}
```
