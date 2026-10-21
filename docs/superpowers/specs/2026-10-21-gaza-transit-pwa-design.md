# Gaza Transit PWA (مشوار - mMshwar) Design Specification

## 1. Executive Summary & Product Vision
**mMshwar (مشوار)** is an offline-first, native-feeling Progressive Web Application tailored for public transit and ride-sharing across the Gaza Strip. The application directly addresses severe network instability, infrastructure constraints, and regional mobility patterns by providing resilient offline outbox synchronization, low-bandwidth data transfers, strict location privacy, and an authentic Palestinian Arabic mobile UX optimized for iOS Safari.

---

## 2. Domain & Operational Rules (`gaza-transit-domain`)

### 2.1 Vehicle Classifications
Drivers set their vehicle type and capacity, and provide identifying vehicle photos for street recognition:
* **Car (سيارة ملاكي / عمومي)**: 4 to 7 passenger seats.
* **Bus / Minibus (باص / ميكروباص)**: Variable passenger capacity.
* **Ajala (عجلة)**: A passenger car towing an open passenger cart—the predominant transit vehicle today. Capacity configured by the driver.

### 2.2 Routes & Stops
* Each driver operates **one main daily route** represented as an ordered sequence of stops.
* Routes run along key transit spines: **Salah al-Din Road (شارع صلاح الدين)**, **Al-Rashid Coastal Road (شارع الرشيد الساحلي)**, and cross-connecting connector streets.
* Every route defines a first-trip departure time and starting location.

### 2.3 Fares & Journeys
* Fares are calculated **per seat, per leg**, in Israeli New Shekels (**ILS / شيكل**), set directly by the driver.
* A rider's full journey may require transferring between multiple vehicles.

### 2.4 Special Requests (طلبات خاصة)
* Riders can post private trip requests specifying: origin, destination, departure date/time, and required seats.
* Private vehicle drivers reply with price offers.
* Riders see each offer with driver name, vehicle classification, photos, and contact phone number.

### 2.5 UI Language & Tone
* Natural **Palestinian Arabic (عربي فلسطيني)** in a right-to-left layout.
* Written for non-technical riders and drivers. Technical jargon belongs strictly in source code.

### 2.6 Privacy & Location Sensitivity
* Collect and store the absolute minimum location data.
* Driver phone numbers appear alongside offers. Rider phone numbers are revealed to drivers only after an accepted booking or offer.
* Live location is shared only after explicit per-trip confirmation. Never retain historical location traces once a trip concludes.

### 2.7 Geographic Places
* All place names, neighborhoods, and coordinates must strictly originate from **OpenStreetMap (OSM)** data for the Gaza Strip. Never invent synthetic locations or coordinates.

---

## 3. Offline-First PWA Architecture (`offline-first-pwa`)

### 3.1 Zero-Network Boot
* Core application shell, styling tokens, and last-known data load instantly via Serwist service worker precaching.
* Initial render never blocks on remote network requests.

### 3.2 IndexedDB Outbox Engine (Dexie.js)
* All writes (publishing trips, booking seats, sending offers) write to an IndexedDB `outbox` table first.
* Instant UI state transition with clear Palestinian Arabic reassurance:  
  `"محفوظ على هذا الهاتف، سيتم الإرسال فور الاتصال"` (Saved on this phone, will send when online).
* When network connectivity is restored (`window.addEventListener('online')`), the outbox worker drains pending mutations to `/api/sync` using unique client-generated UUID idempotency keys.

### 3.3 Delta Sync & Byte Budget
* Synchronizations exchange lightweight JSON diffs representing changes since the last sync timestamp.
* Hard payload limit: Maximum 10 KB per regular sync request/response.
* The UI prominently displays data age (e.g. `"آخر تحديث: منذ ١٥ دقيقة"`).

### 3.4 Photo Sync Rules
* Vehicle photos are excluded from the regular delta sync payload.
* Photos download and upload exclusively on Wi-Fi or unmetered connections.
* Since iPhone Safari does not expose metered connection state, photo sync defaults to **OFF**, accompanied by a manual `"تنزيل الصور الآن"` trigger and an `"على شبكة Wi-Fi فقط"` preference toggle.

### 3.5 Seat Conflict Resolution
* The central server resolves booking conflicts using first-come, first-served logic.
* If a seat was claimed by another rider while an offline request was pending, the local optimistic booking cleanly rolls back and alerts the user with an explanatory bottom banner.

---

## 4. Mobile Front-End & iOS Native Standards (`ios-native-feel`)

### 4.1 Viewport & Standalone Shell
* Dynamic viewport sizing (`h-[100dvh]`) to prevent height jumps when the Safari browser chrome toggles.
* Safe area padding rules: `pt-[env(safe-area-inset-top)]` on header; `pb-[env(safe-area-inset-bottom)]` on bottom navigation.
* Root background applies `overscroll-behavior-y: none` to disable rubber-band bouncing on the body.

### 4.2 Zoom & Touch Physics
* All input elements use `font-size: 16px` or larger to prevent Safari auto-zoom on focus.
* Screen boundaries strictly constrained to `100vw` (`max-w-full`, `overflow-x-hidden`).
* Interactive elements configure `touch-action: manipulation` to eliminate the 300ms double-tap delay.
* Minimum touch targets: `44px x 44px`.

### 4.3 Mobile UI Patterns
* Fixed bottom navigation tab bar:
  1. **استكشف (Explore)**: Map view & active public transit corridors.
  2. **اطرح مشوار (Offer)**: Driver route publishing workflow.
  3. **مشاويري (My Trips)**: Driver schedules, bookings & pending special requests.
  4. **حسابي (Profile)**: Offline status, Wi-Fi sync preferences & vehicle profile.
* Native gesture bottom sheets with snap points (peek, half, expanded) instead of desktop modal dialogs.
* Skeleton screen loaders instead of blocking spinners to avoid layout shifts.

### 4.4 Design Tokens (Transit Palette)
* **Canvas Background**: Light `#F8FAFC`, Dark `#030712`
* **Surface Cards**: Light `#FFFFFF`, Dark `#111827`
* **Transit Primary (Green Light)**: Light `#059669`, Dark `#10B981`
* **Amber Alert (Offline / Seats)**: Light `#D97706`, Dark `#F59E0B`
* **Typography**: Cairo font via `next/font/google`, with logical margin and padding (`ms-`, `me-`, `ps-`, `pe-`).

---

## 5. Map & Routing System (MapLibre GL)

* **Engine**: MapLibre GL JS with `@mapbox/mapbox-gl-rtl-text` for Arabic street names and labels.
* **Basemap**: OpenStreetMap / Carto Voyager raster/vector tiles precached along Gaza transit corridors (Salah al-Din & Al-Rashid).
* **Gestures**: 1-finger pan and pinch-zoom enabled; 2-finger pitch/tilt disabled for mobile ergonomics.
* **Camera Framing**: Auto-bounds camera with `padding: { bottom: 280 }` so bottom sheets do not occlude the route polyline.

---

## 6. Technical Stack & Data Models

### 6.1 Core Stack
* **Framework**: Next.js 15 (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS with logical properties
* **ORM & Database**: Prisma ORM with PostgreSQL directly (`DATABASE_URL`)
* **Auth**: NextAuth.js (Auth.js v5) with Google OAuth + QA Mode bypass
* **Local Offline DB**: Dexie.js (IndexedDB)
* **Service Worker**: Serwist (`@serwist/next`)
* **Unit Testing**: Vitest
* **E2E / Browser Testing**: Playwright (Mobile Safari emulation)

### 6.2 Prisma PostgreSQL Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum VehicleType {
  CAR
  BUS
  AJALA
}

enum TripStatus {
  ACTIVE
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
}

enum RequestStatus {
  OPEN
  OFFER_ACCEPTED
  FULFILLED
  CANCELLED
}

model User {
  id             String           @id @default(uuid())
  name           String?
  email          String           @unique
  phone          String?
  image          String?
  vehicleType    VehicleType?
  vehiclePhotos  String[]
  tripsOffered   Trip[]           @relation("DriverTrips")
  bookings       Booking[]        @relation("PassengerBookings")
  specialRequests SpecialRequest[] @relation("RiderRequests")
  specialOffers  SpecialOffer[]   @relation("DriverOffers")
  createdAt      DateTime         @default(now())
}

model Trip {
  id             String      @id @default(uuid())
  driverId       String
  driver         User        @relation("DriverTrips", fields: [driverId], references: [id])
  originName     String
  originLat      Float
  originLng      Float
  destName       String
  destLat        Float
  destLng        Float
  routePolyline  String
  departureTime  DateTime
  totalSeats     Int
  availableSeats Int
  pricePerSeat   Float
  status         TripStatus  @default(ACTIVE)
  bookings       Booking[]
  createdAt      DateTime    @default(now())

  @@index([status, departureTime])
}

model Booking {
  id          String        @id @default(uuid())
  tripId      String
  trip        Trip          @relation(fields: [tripId], references: [id])
  passengerId String
  passenger   User          @relation("PassengerBookings", fields: [passengerId], references: [id])
  seatsCount  Int           @default(1)
  status      BookingStatus @default(CONFIRMED)
  createdAt   DateTime      @default(now())

  @@unique([tripId, passengerId])
}

model SpecialRequest {
  id          String         @id @default(uuid())
  riderId     String
  rider       User           @relation("RiderRequests", fields: [riderId], references: [id])
  originName  String
  destName    String
  tripDate    DateTime
  seatsNeeded Int            @default(1)
  status      RequestStatus  @default(OPEN)
  offers      SpecialOffer[]
  createdAt   DateTime       @default(now())
}

model SpecialOffer {
  id          String         @id @default(uuid())
  requestId   String
  request     SpecialRequest @relation(fields: [requestId], references: [id])
  driverId    String
  driver      User           @relation("DriverOffers", fields: [driverId], references: [id])
  price       Float
  isAccepted  Boolean        @default(false)
  createdAt   DateTime       @default(now())

  @@unique([requestId, driverId])
}
```

---

## 7. Shipping, QA & Fleet Contract (`ship-safely` & `fleet-qa`)

### 7.1 Milestone Workflow
* Work proceeds strictly via milestone branches; direct pushes to `main` are blocked.
* Every PR description contains:
  1. What a user can now do.
  2. What was cut or deferred.
  3. How to see and verify the feature.
* Merge gate: Wait for Fleet QA status check and comment; never merge on red; never merge without Ahmed's confirmation.

### 7.2 Repository Contract for Fleet QA Runner
* **npm scripts**:
  * `npm run build`
  * `npm test`
  * `npm start` (honors `PORT`)
  * `npm run qa:seed` (optional)
  * `npm run qa:e2e` (optional)
* **PostgreSQL Database**: Fresh database provided via `DATABASE_URL` in CI; migrations applied via Prisma.
* **Routes to Photograph (`qa/routes.txt`)**:
  ```text
  guest / landing-view
  rider /trips available-trips
  driver /offer create-trip
  rider /requests special-request-view
  ```
* **QA Auth Endpoint (`GET /api/qa-login`)**:
  * Exists ONLY when `QA_MODE=1`. Returns 404 when unset.
  * Verified by an explicit unit test.
  * Launches cleanly in QA mode with zero Google OAuth credentials.

---

## 8. Live Recording Protocol (`on-air`)
* Voice commands run via `aq say "<text>"` or fallback `say "<text>"`.
* Speech is strictly English, < 25 words, plain words only. The identical sentence is displayed on screen.
* Spoken lines triggered only at task start, prompt finish, PR ready, or failure.
* External tasks require the `### NEEDED FROM AHMED` prompt box and spoken notification.
