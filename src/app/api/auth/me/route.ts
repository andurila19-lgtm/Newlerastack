// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { dbService } from '@/lib/dbService';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('nwl_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    const user = await dbService.getUserByEmail(decoded.email);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
