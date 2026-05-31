// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('nwl_auth_token')?.value;
  if (!token) return false;
  
  const decoded = await verifyToken(token);
  return decoded?.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const data = await dbService.getAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
