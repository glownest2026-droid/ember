import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { isAdminEmail } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

// GET: List all products
export async function GET(req: NextRequest) {
  try {
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

    const { data, error } = await supabase
      .from('products')
      .select('*, pl_category_types(id, name, slug)')
      .order('name', { ascending: true });

    if (error) {
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
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

// POST: Create product
export async function POST(req: NextRequest) {
  try {
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

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!body.age_band || typeof body.age_band !== 'string' || body.age_band.trim() === '') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Age band is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create service role client for admin writes
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Build insert object
    const insertData: any = {
      name: body.name.trim(),
      age_band: body.age_band.trim(),
      image_url: body.image_url?.trim() || null,
      why_it_matters: body.why_it_matters?.trim() || null,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      category_type_id: body.category_type_id?.trim() || null,
      affiliate_url: body.affiliate_url?.trim() || body.deep_link_url?.trim() || null,
    };

    // Handle rating: optional, but if provided must be >= 4
    if (body.rating !== undefined && body.rating !== null && body.rating !== '') {
      const ratingNum = Number(body.rating);
      if (!isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 5) {
        insertData.rating = ratingNum;
      } else {
        return new NextResponse(JSON.stringify({ success: false, error: 'Rating must be between 0 and 5' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      insertData.rating = null;
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(insertData)
      .select('*, pl_category_types(id, name, slug)')
      .single();

    if (error) {
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ success: false, error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

