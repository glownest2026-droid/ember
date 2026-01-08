import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { isAdminEmail } from '../../../../../lib/admin';

export const dynamic = 'force-dynamic';

// PATCH: Update product
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
      updateData.name = body.name.trim();
    }
    if (body.age_band !== undefined) {
      if (typeof body.age_band !== 'string' || body.age_band.trim() === '') {
        return new NextResponse(JSON.stringify({ success: false, error: 'Age band cannot be empty' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      updateData.age_band = body.age_band.trim();
    }
    if (body.image_url !== undefined) {
      updateData.image_url = body.image_url?.trim() || null;
    }
    if (body.why_it_matters !== undefined) {
      updateData.why_it_matters = body.why_it_matters?.trim() || null;
    }
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);
    }
    if (body.category_type_id !== undefined) {
      updateData.category_type_id = body.category_type_id?.trim() || null;
    }
    if (body.rating !== undefined) {
      updateData.rating = body.rating ? Number(body.rating) : null;
    }
    if (body.affiliate_url !== undefined) {
      updateData.affiliate_url = body.affiliate_url?.trim() || null;
    }
    if (body.deep_link_url !== undefined) {
      updateData.affiliate_url = body.deep_link_url?.trim() || null;
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
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*, pl_category_types(id, name, slug)')
      .single();

    if (error) {
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Product not found' }), {
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

