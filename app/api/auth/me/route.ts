import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, AUTH_COOKIE_NAME } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const payload = await checkAdminAuth(req);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { username: payload.username, role: payload.role }
  });
}
