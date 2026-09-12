import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { checkAdminAuth, hashPassword } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await dbStore.getSettings();
  const admin = await dbStore.getAdmin();

  return NextResponse.json({
    ...settings,
    username: admin.username
  });
}

export async function PUT(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { youtubeChannelId, notificationEmail, newPassword, newUsername } = await req.json();

    if (youtubeChannelId !== undefined || notificationEmail !== undefined) {
      await dbStore.updateSettings({
        ...(youtubeChannelId !== undefined && { youtubeChannelId: youtubeChannelId.trim() }),
        ...(notificationEmail !== undefined && { notificationEmail: notificationEmail.trim() })
      });
    }

    if (newPassword && newPassword.trim().length >= 6) {
      const hashed = await hashPassword(newPassword.trim());
      await dbStore.updateAdminPassword(hashed, newUsername?.trim());
    } else if (newUsername && newUsername.trim().length > 0) {
      const admin = await dbStore.getAdmin();
      await dbStore.updateAdminPassword(admin.passwordHash, newUsername.trim());
    }

    const updatedSettings = await dbStore.getSettings();
    const updatedAdmin = await dbStore.getAdmin();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        ...updatedSettings,
        username: updatedAdmin.username
      }
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
