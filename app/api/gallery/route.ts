import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';

export async function GET() {
  const events = await dbStore.getEvents();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const event = await dbStore.createEvent(name.trim(), description?.trim());
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
