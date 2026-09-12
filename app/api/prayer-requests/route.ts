import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth } from '@/lib/auth/jwt';
import { sendPrayerRequestNotification } from '@/lib/services/email';

export async function GET(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  const includePrivate = Boolean(auth);
  
  const requests = dbStore.getPrayerRequests(includePrivate);
  
  // Extra security check: Ensure no private requests leak to non-admins even if getPrayerRequests has bug
  if (!includePrivate) {
    const sanitized = requests
      .filter(r => !r.isPrivate)
      .map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt
      }));
    return NextResponse.json(sanitized);
  }

  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, category, message, isPrivate, honeypot } = body;

    // Honeypot spam check - if honeypot field is filled, silently ignore or reject
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('Spam detected via honeypot field');
      return NextResponse.json({ success: true, message: 'Prayer request submitted successfully' });
    }

    if (!name || !message || !category) {
      return NextResponse.json({ error: 'Name, Category, and Message are required fields' }, { status: 400 });
    }

    const created = dbStore.createPrayerRequest({
      name: name.trim(),
      contact: (contact || 'Not provided').trim(),
      category,
      message: message.trim(),
      isPrivate: Boolean(isPrivate)
    });

    // Send admin email notification asynchronously
    const settings = dbStore.getSettings();
    const adminEmail = settings.notificationEmail || 'ministriesmpl7@gmail.com';
    sendPrayerRequestNotification(created, adminEmail).catch(err => {
      console.error('Background notification error:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Your prayer request has been received. Our team will stand in prayer with you.',
      id: created.id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating prayer request:', error);
    return NextResponse.json({ error: 'Failed to submit prayer request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !['new', 'prayed', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Valid id and status (new, prayed, archived) required' }, { status: 400 });
    }

    const updated = dbStore.updatePrayerRequestStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Prayer request not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating prayer request:', error);
    return NextResponse.json({ error: 'Failed to update prayer request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Prayer request id parameter required' }, { status: 400 });
  }

  const deleted = dbStore.deletePrayerRequest(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Prayer request not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Prayer request deleted' });
}
