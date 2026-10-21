# Milestone 1: Core Foundation & Fleet QA Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Next.js 15 project repository, establish the PostgreSQL Prisma database schema, implement the iOS Safari RTL application shell, and fully satisfy the automated Fleet QA runner contract.

**Architecture:** A Next.js 15 App Router application with Tailwind CSS logical properties configured for Palestinian Arabic (RTL). The backend uses Prisma ORM connected to PostgreSQL. The testing suite uses Vitest for unit tests, enforcing the security isolation of the `GET /api/qa-login` endpoint and guaranteeing the app boots cleanly in QA mode with zero external dependencies.

**Architecture Diagram:**
```mermaid
graph TD
    subgraph "Fleet QA Runner Contract"
        QA_ROUTES[qa/routes.txt] --> RUNNER[Fleet QA Runner]
        QA_AUTH[GET /api/qa-login] -->|QA_MODE=1| DEMO_SESSION[Demo Driver/Rider Session]
        TESTS[npm test - Vitest] -->|Proves 404 when QA_MODE unset| SECURITY_GATE[Security Gate]
    end

    subgraph "Next.js 15 App Shell (iOS Safari Native)"
        ROOT_LAYOUT[src/app/layout.tsx] -->|lang='ar' dir='rtl'| CAIRO_FONT[Cairo Font & Tokens]
        ROOT_LAYOUT --> SAFE_AREA[Safe Area Insets & 100dvh]
        SAFE_AREA --> BOTTOM_NAV[Bottom Tab Bar]
    end

    subgraph "Data & Persistence"
        PRISMA[prisma/schema.prisma] -->|DATABASE_URL| POSTGRES[(PostgreSQL)]
        MODELS[User, Trip, Booking, SpecialRequest] --> PRISMA
    end
```

**Tech Stack:**
* Next.js 15 (App Router, React 19, TypeScript)
* Tailwind CSS (Logical Properties, Cairo typography)
* Prisma ORM (PostgreSQL)
* Vitest (Unit Testing & TDD)
* Lucide React / SVG icons

**Spec:** [`docs/superpowers/specs/2026-10-21-gaza-transit-pwa-design.md`](file:///Users/abood/Downloads/mMshwar/docs/superpowers/specs/2026-10-21-gaza-transit-pwa-design.md)

## Global Constraints
* Node.js runtime >= 20.x
* Database: PostgreSQL via `DATABASE_URL`
* Port configuration: `npm start` MUST honor `PORT` env var (e.g. `PORT=8080 next start -p $PORT`)
* UI Language: Palestinian Arabic, strictly RTL (`dir="rtl"`), zero English UI labels
* Safari styling: `viewport-fit=cover`, dynamic viewport `100dvh`, input font size >= 16px, `touch-action: manipulation`
* Security: `GET /api/qa-login` MUST return 404 when `QA_MODE !== '1'`
* Shipping: Branch `milestone-1-core-scaffold`, never push directly to `main`

---

### Task 1: Repository Initialization & npm Scripts Contract

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Consumes: None
- Produces: Runnable scripts `build`, `test`, `start` honoring `PORT`

- [ ] **Step 1: Write `.gitignore` and `.env.example`**

```bash
cat > .gitignore << 'EOF'
node_modules
.next
out
build
dist
.env
.env.local
coverage
*.log
.DS_Store
EOF

cat > .env.example << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mmshwar?schema=public"
NEXTAUTH_SECRET="development-secret-key-at-least-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
QA_MODE="0"
PORT="3000"
EOF
```

- [ ] **Step 2: Create `package.json` with exact fleet runner script signatures**

```json
{
  "name": "mmshwar",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "test": "vitest run",
    "test:watch": "vitest",
    "qa:seed": "node scripts/qa-seed.js"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "next": "15.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/node": "^22.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.49",
    "prisma": "^6.0.0",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json` and `next.config.ts`**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Initialize Git and checkout Milestone 1 branch**

Run:
```bash
git init
git checkout -b main
git checkout -b milestone-1-core-scaffold
```

- [ ] **Step 5: Install dependencies and verify build toolchain**

Run: `npm install`
Expected: `added packages ... in X s`

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json next.config.ts .gitignore .env.example
git commit -m "chore: scaffold Next.js 15 project structure and fleet scripts"
```

---

### Task 2: Fleet QA Runner Contract & QA Login Route (`GET /api/qa-login`)

**Files:**
- Create: `qa/routes.txt`
- Create: `tests/unit/qa-login.test.ts`
- Create: `src/app/api/qa-login/route.ts`

**Interfaces:**
- Consumes: `process.env.QA_MODE`
- Produces: `GET /api/qa-login?role=driver|rider` returning 302 with session cookie when `QA_MODE=1`, or 404 when unset

- [ ] **Step 1: Create `qa/routes.txt`**

```text
guest / landing-screen
driver /offer create-trip-screen
rider /trips available-trips-screen
rider /bookings my-bookings-screen
```

- [ ] **Step 2: Write failing unit test for `GET /api/qa-login` security gate**

```typescript
// tests/unit/qa-login.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/qa-login/route';

describe('GET /api/qa-login Security Gate', () => {
  const originalEnv = process.env.QA_MODE;

  beforeEach(() => {
    delete process.env.QA_MODE;
  });

  afterEach(() => {
    process.env.QA_MODE = originalEnv;
  });

  it('must return 404 Not Found when QA_MODE is unset', async () => {
    const req = new NextRequest('http://localhost:3000/api/qa-login?role=driver');
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it('must return 404 Not Found when QA_MODE is set to 0', async () => {
    process.env.QA_MODE = '0';
    const req = new NextRequest('http://localhost:3000/api/qa-login?role=driver');
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it('signs in a demo driver when QA_MODE=1 and redirects to /', async () => {
    process.env.QA_MODE = '1';
    const req = new NextRequest('http://localhost:3000/api/qa-login?role=driver');
    const res = await GET(req);
    expect(res.status).toBe(307); // NextResponse.redirect default
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('qa_user_role=driver');
  });

  it('signs in a demo rider when QA_MODE=1 and redirects to /', async () => {
    process.env.QA_MODE = '1';
    const req = new NextRequest('http://localhost:3000/api/qa-login?role=rider');
    const res = await GET(req);
    expect(res.status).toBe(307);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('qa_user_role=rider');
  });

  it('returns 400 Bad Request if role parameter is invalid when QA_MODE=1', async () => {
    process.env.QA_MODE = '1';
    const req = new NextRequest('http://localhost:3000/api/qa-login?role=hacker');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/unit/qa-login.test.ts`
Expected: FAIL with module `@/app/api/qa-login/route` not found.

- [ ] **Step 4: Implement minimal code for `src/app/api/qa-login/route.ts`**

```typescript
// src/app/api/qa-login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (process.env.QA_MODE !== '1') {
    return new NextResponse(null, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  if (role !== 'driver' && role !== 'rider') {
    return NextResponse.json({ error: 'Invalid role parameter' }, { status: 400 });
  }

  const redirectUrl = new URL('/', request.url);
  const response = NextResponse.redirect(redirectUrl);

  // Set QA demo cookie
  response.cookies.set('qa_user_role', role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
```

- [ ] **Step 5: Run tests to verify all 5 test cases pass**

Run: `npx vitest run tests/unit/qa-login.test.ts`
Expected: PASS (5 passed)

- [ ] **Step 6: Commit**

```bash
git add qa/routes.txt tests/unit/qa-login.test.ts src/app/api/qa-login/route.ts
git commit -m "feat(qa): implement GET /api/qa-login with strict 404 security gate and routes.txt"
```

---

### Task 3: Prisma Schema & Database Models

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db/prisma.ts`
- Create: `tests/unit/schema.test.ts`

**Interfaces:**
- Consumes: `process.env.DATABASE_URL`
- Produces: Prisma Client types for `User`, `Trip`, `Booking`, `SpecialRequest`, `SpecialOffer`

- [ ] **Step 1: Write `prisma/schema.prisma` with PostgreSQL provider**

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
  id              String           @id @default(uuid())
  name            String?
  email           String           @unique
  phone           String?
  image           String?
  vehicleType     VehicleType?
  vehiclePhotos   String[]         @default([])
  tripsOffered    Trip[]           @relation("DriverTrips")
  bookings        Booking[]        @relation("PassengerBookings")
  specialRequests SpecialRequest[] @relation("RiderRequests")
  specialOffers   SpecialOffer[]   @relation("DriverOffers")
  createdAt       DateTime         @default(now())
}

model Trip {
  id             String        @id @default(uuid())
  driverId       String
  driver         User          @relation("DriverTrips", fields: [driverId], references: [id])
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
  status         TripStatus    @default(ACTIVE)
  bookings       Booking[]
  createdAt      DateTime      @default(now())

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

- [ ] **Step 2: Create singleton client in `src/lib/db/prisma.ts`**

```typescript
// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Generate Prisma client**

Run: `npx prisma generate`
Expected: `✔ Generated Prisma Client`

- [ ] **Step 4: Write unit test validating schema model types**

```typescript
// tests/unit/schema.test.ts
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
```

- [ ] **Step 5: Run unit tests**

Run: `npx vitest run tests/unit/schema.test.ts`
Expected: PASS (3 passed)

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma src/lib/db/prisma.ts tests/unit/schema.test.ts
git commit -m "feat(db): configure Prisma schema with PostgreSQL models and enums"
```

---

### Task 4: iOS Safari Native App Shell & RTL Layout

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `tests/unit/layout.test.ts`

**Interfaces:**
- Consumes: Next.js metadata, Cairo font, Tailwind logical classes
- Produces: Root layout honoring `lang="ar" dir="rtl"`, safe-area insets, dynamic `100dvh`, and bottom tab navigation

- [ ] **Step 1: Configure `tailwind.config.ts` and `postcss.config.mjs`**

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
  },
};
export default config;
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8FAFC',
          dark: '#030712',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        transit: {
          DEFAULT: '#059669',
          dark: '#10B981',
        },
        alert: {
          DEFAULT: '#D97706',
          dark: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Create `src/app/globals.css` with iOS Safari safe-area and touch-action rules**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --sat: env(safe-area-inset-top);
  --sab: env(safe-area-inset-bottom);
}

html,
body {
  height: 100dvh;
  margin: 0;
  padding: 0;
  overscroll-behavior-y: none;
  -webkit-tap-highlight-color: transparent;
}

/* Force minimum 16px font-size to eliminate iOS Safari focus zoom */
input,
textarea,
select {
  font-size: 16px !important;
  touch-action: manipulation;
}

button {
  touch-action: manipulation;
  min-height: 44px;
}
```

- [ ] **Step 3: Create `src/components/layout/BottomNav.tsx`**

```tsx
// src/components/layout/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, PlusCircle, CalendarCheck, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'استكشف', href: '/trips', icon: Compass },
    { label: 'اطرح مشوار', href: '/offer', icon: PlusCircle },
    { label: 'مشاويري', href: '/bookings', icon: CalendarCheck },
    { label: 'حسابي', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/trips' && pathname === '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create `src/app/layout.tsx` and `src/app/page.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مشوار | مواصلات غزة',
  description: 'منصة نقل وتشارك المشاوير في قطاع غزة - تعمل بدون إنترنت',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'مشوار',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col`}>
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
          <div className="flex justify-between items-center h-12 px-4 max-w-md mx-auto">
            <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">مشوار</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
              غزة
            </span>
          </div>
        </header>

        <main className="flex-1 pb-20 max-w-md w-full mx-auto px-4 pt-4">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          أهلاً بك في مشوار
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          خطوط المواصلات العامة بين مدن قطاع غزة على شارعي صلاح الدين والرشيد.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">عجلة</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">الوسيلة الأكثر انتشاراً</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">سيارات وباصات</div>
          <div className="text-xs text-slate-500 mt-1">خطوط رئيسية يومية</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Test layout metadata and viewport exports**

```typescript
// tests/unit/layout.test.ts
import { describe, it, expect } from 'vitest';
import { metadata, viewport } from '@/app/layout';

describe('Root Layout Configuration', () => {
  it('configures Apple Web App standalone capabilities', () => {
    expect(metadata.appleWebApp).toEqual({
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'مشوار',
    });
  });

  it('configures iOS Safari viewport fit cover and prevents zoom', () => {
    expect(viewport.viewportFit).toBe('cover');
    expect(viewport.maximumScale).toBe(1);
    expect(viewport.userScalable).toBe(false);
  });
});
```

- [ ] **Step 6: Run tests to verify**

Run: `npx vitest run tests/unit/layout.test.ts`
Expected: PASS (2 passed)

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts postcss.config.mjs src/app/globals.css src/components/layout/BottomNav.tsx src/app/layout.tsx src/app/page.tsx tests/unit/layout.test.ts
git commit -m "feat(ui): implement iOS Safari native shell with RTL and Cairo font"
```

---

### Task 5: Build Verification & Milestone 1 Fleet QA Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Execute production build**

Run: `npm run build`
Expected: `✔ Compiled successfully` with route `GET /api/qa-login` and page `/` generated.

- [ ] **Step 2: Run all unit tests**

Run: `npm test`
Expected: All test suites pass (10+ tests).

- [ ] **Step 3: Update `README.md` with Fleet QA verification instructions**

```markdown
# mMshwar (مشوار)

Public transit & carpooling PWA for the Gaza Strip.

## Fleet QA Contract
- `npm run build`: Production compilation
- `npm test`: Executes all Vitest unit tests
- `npm start`: Runs application honoring `$PORT`
- `GET /api/qa-login?role=driver|rider`: Authenticates demo users when `QA_MODE=1` (returns 404 in production)
- `qa/routes.txt`: Screenshot routing matrix
```

- [ ] **Step 4: Commit and finalize Milestone 1 branch**

```bash
git add README.md
git commit -m "docs: document fleet QA contract and verify production build"
```
