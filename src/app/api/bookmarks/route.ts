// src/app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('nwl_auth_token')?.value;
    if (!token) {
      return NextResponse.json({ bookmarks: [] });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await dbService.getBookmarksByUser(decoded.userId);
    return NextResponse.json({ bookmarks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('nwl_auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { templateId } = await request.json();
    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const result = await dbService.toggleBookmark(decoded.userId, templateId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}
