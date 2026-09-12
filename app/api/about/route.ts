import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';

export async function GET() {
  const data = dbStore.getAbout();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = dbStore.updateAbout(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
