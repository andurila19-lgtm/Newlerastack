// src/app/api/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';

// Helper to check admin access
async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('nwl_auth_token')?.value;
  if (!token) return false;
  
  const decoded = await verifyToken(token);
  return decoded?.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let templates = await dbService.getTemplates();
    
    // Apply client filters if present
    if (category && category !== 'All') {
      templates = templates.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    
    if (search) {
      const query = search.toLowerCase();
      templates = templates.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.techStack.some((tech: string) => tech.toLowerCase().includes(query))
      );
    }
    
    return NextResponse.json({ templates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, slug, description, price, category, screenshots, features, techStack, changelog, videoUrl, liveDemoUrl, downloadUrl } = body;
    
    if (!title || !slug || !description || !price || !category || !downloadUrl) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }
    
    // Validate slug uniqueness
    const existing = await dbService.getTemplateBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    
    const newTemplate = await dbService.createTemplate({
      title,
      slug,
      description,
      price: parseFloat(price),
      category,
      screenshots: screenshots || [],
      features: features || [],
      techStack: techStack || [],
      changelog: changelog || [],
      videoUrl,
      liveDemoUrl,
      downloadUrl,
      isTrending: body.isTrending || false,
      isNew: body.isNew || true
    });
    
    return NextResponse.json({ success: true, template: newTemplate });
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
