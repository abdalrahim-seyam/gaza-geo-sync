# Fleet QA Runner Contract Reference

## QA Login Route Implementation Pattern (`src/app/api/qa-login/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (process.env.QA_MODE !== '1') {
    return new NextResponse(null, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // 'driver' | 'rider'
  
  if (role !== 'driver' && role !== 'rider') {
    return NextResponse.json({ error: 'Invalid role parameter' }, { status: 400 });
  }

  // Issue demo session cookie without requiring Google OAuth
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('qa_demo_user', role, { httpOnly: true, path: '/' });
  return response;
}
```

## Mandatory QA Security Unit Test (`tests/unit/qa-login.test.ts`)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('GET /api/qa-login Security Gate', () => {
  beforeEach(() => {
    delete process.env.QA_MODE;
  });

  it('must return 404 Not Found when QA_MODE is not set to 1', async () => {
    // Assert endpoint returns 404
  });
});
```
