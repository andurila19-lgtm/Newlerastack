// src/app/api/users/route.ts
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

    const users = await dbService.getAllUsers();
    // Strip password hashes from response
    const sanitizedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { userId, role } = await request.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }

    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
    }

    const updatedUser = await dbService.updateUserRole(userId, role);
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 505 });
  }
}
