// src/app/api/purchases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check search parameter first as a fallback query
    const { searchParams } = request.nextUrl;
    const queryUserId = searchParams.get('userId');

    let userId = queryUserId;

    if (!userId) {
      const token = request.cookies.get('nwl_auth_token')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token session' }, { status: 401 });
      }
      userId = decoded.userId;
    }

    const purchases = await dbService.getPurchasesByUser(userId);
    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Failed to get purchases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
