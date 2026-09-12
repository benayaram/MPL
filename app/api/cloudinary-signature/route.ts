import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await checkAdminAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      configured: false,
      message: 'Cloudinary API credentials are not set in environment variables. You can enter an image URL directly.'
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

  return NextResponse.json({
    configured: true,
    signature,
    timestamp,
    apiKey,
    cloudName
  });
}
