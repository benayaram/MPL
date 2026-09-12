import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';

export async function GET() {
  const data = await dbStore.getContact();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await dbStore.updateContact(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}
