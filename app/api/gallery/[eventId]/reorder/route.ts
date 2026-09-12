import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';

interface Context {
  params: Promise<{ eventId: string }>;
}

export async function POST(req: NextRequest, context: Context) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { eventId } = await context.params;

  try {
    const { imageIds } = await req.json();
    if (!Array.isArray(imageIds)) {
      return NextResponse.json({ error: 'imageIds array is required' }, { status: 400 });
    }

    const updatedEvent = await dbStore.reorderEventImages(eventId, imageIds);
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error reordering images:', error);
    return NextResponse.json({ error: 'Failed to reorder images' }, { status: 500 });
  }
}
