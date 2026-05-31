// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('nwl_auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session. Please login again.' }, { status: 401 });
    }

    const { templateId } = await request.json();
    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const template = await dbService.getTemplateById(templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Check if already purchased
    const alreadyPurchased = await dbService.checkUserPurchase(decoded.userId, templateId);
    if (alreadyPurchased) {
      return NextResponse.json({ error: 'You have already purchased this template' }, { status: 400 });
    }

    // Create the mock purchase
    const purchase = await dbService.createPurchase(decoded.userId, templateId, template.price);

    return NextResponse.json({
      success: true,
      message: 'Purchase completed successfully',
      purchase: {
        id: purchase.id,
        templateTitle: template.title,
        amount: purchase.amount,
        licenseKey: purchase.licenseKey,
        purchaseDate: purchase.purchaseDate
      }
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
