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
