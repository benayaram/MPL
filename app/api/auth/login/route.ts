import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { comparePassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = dbStore.getAdmin();

    if (username.toLowerCase() !== admin.username.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken(admin.username);
    const response = NextResponse.json({
      success: true,
      user: { username: admin.username, role: 'admin' }
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
