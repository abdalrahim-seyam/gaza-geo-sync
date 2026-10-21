# mMshwar (مشوار)

منصة نقل وتشارك المشاوير في قطاع غزة - تعمل بدون إنترنت أولاً.
Offline-first, native-feeling PWA for public transit & carpooling across the Gaza Strip.

## Fleet QA Contract
- `npm run build`: Production compilation
- `npm test`: Executes all Vitest unit tests
- `npm start`: Runs application honoring `$PORT` (default 3000)
- `GET /api/qa-login?role=driver|rider`: Authenticates demo users when `QA_MODE=1` (returns 404 in production)
- `qa/routes.txt`: Screenshot routing matrix for automated visual validation

## Tech Stack
- Next.js 15 (App Router, React 19)
- Tailwind CSS with logical properties (Palestinian Arabic RTL)
- Prisma ORM (PostgreSQL)
- Vitest for unit testing & TDD
