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
    expect(res.status).toBe(307);
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
