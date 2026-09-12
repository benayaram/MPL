import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';

interface Context {
  params: Promise<{ eventId: string }>;
}

export async function GET(req: NextRequest, context: Context) {
  const { eventId } = await context.params;
  const event = dbStore.getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

// Add image to event (Admin only)
export async function POST(req: NextRequest, context: Context) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { eventId } = await context.params;

  try {
    const { url, caption, publicId } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const updatedEvent = dbStore.addImageToEvent(eventId, url, caption, publicId);
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error adding image to event:', error);
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

// Delete event or single image (Admin only)
export async function DELETE(req: NextRequest, context: Context) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { eventId } = await context.params;
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get('imageId');

  if (imageId) {
    const updated = dbStore.deleteImageFromEvent(eventId, imageId);
    if (!updated) {
      return NextResponse.json({ error: 'Event or image not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } else {
    const deleted = dbStore.deleteEvent(eventId);
    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Event deleted' });
  }
}
