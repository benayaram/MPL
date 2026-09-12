import { NextResponse } from 'next/server';
import { fetchLiveStatus } from '@/lib/services/youtube';

export async function GET() {
  try {
    const status = await fetchLiveStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error in live-status route:', error);
    return NextResponse.json({ error: 'Failed to fetch live status' }, { status: 500 });
  }
}
