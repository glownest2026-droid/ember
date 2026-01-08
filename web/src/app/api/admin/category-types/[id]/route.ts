import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { isAdminEmail } from '../../../../../lib/admin';

export const dynamic = 'force-dynamic';

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// PATCH: Update category type
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const admin = isAdminEmail(user.email);
    if (!admin) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new NextResponse(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build update object
    const updateData: any = {};
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return new NextResponse(JSON.stringify({ success: false, error: 'Name cannot be empty' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const nameValue = body.name.trim();
      updateData.name = nameValue;
      updateData.label = nameValue; // Keep label in sync with name (legacy column)
      // Auto-generate slug if name changed and slug not explicitly provided
      if (body.slug === undefined) {
        updateData.slug = generateSlug(body.name);
      }
    }
    if (body.slug !== undefined) {
      updateData.slug = body.slug.trim();
    }
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }
    if (body.image_url !== undefined) {
      updateData.image_url = body.image_url?.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      return new NextResponse(JSON.stringify({ success: false, error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create service role client for admin writes
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from('pl_category_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Category type not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ success: false, error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

