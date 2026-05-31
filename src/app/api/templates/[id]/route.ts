// src/app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('nwl_auth_token')?.value;
  if (!token) return false;
  
  const decoded = await verifyToken(token);
  return decoded?.role === 'ADMIN';
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify template exists
    const existing = await dbService.getTemplateById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const updatedTemplate = await dbService.updateTemplate(id, body);
    return NextResponse.json({ success: true, template: updatedTemplate });
  } catch (error: any) {
    console.error('Failed to update template:', error);
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;

    // Verify template exists
    const existing = await dbService.getTemplateById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const success = await dbService.deleteTemplate(id);
    if (success) {
      return NextResponse.json({ success: true, message: 'Template deleted' });
    } else {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to delete template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
