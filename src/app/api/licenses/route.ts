// src/app/api/licenses/route.ts
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

    const licenses = await dbService.getAllLicenses();
    return NextResponse.json({ licenses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { licenseKey, status } = await request.json();
    if (!licenseKey || !status) {
      return NextResponse.json({ error: 'License key and status are required' }, { status: 400 });
    }

    const updatedLicense = await dbService.updateLicenseStatus(licenseKey, status);
    return NextResponse.json({ success: true, license: updatedLicense });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update license' }, { status: 500 });
  }
}
