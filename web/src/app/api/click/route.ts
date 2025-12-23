import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse(null, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      // Fallback: try text parse if JSON fails
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        return new NextResponse(null, { status: 400 });
      }
    }

    // Validate product_id (required, must be string and resemble UUID)
    const productId = body?.product_id;
    if (!productId || typeof productId !== 'string') {
      return new NextResponse(null, { status: 400 });
    }
    
    // Basic UUID format check (8-4-4-4-12 hex pattern)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      return new NextResponse(null, { status: 400 });
    }

    // Extract optional fields
    const childId = body?.child_id && typeof body.child_id === 'string' && uuidRegex.test(body.child_id) 
      ? body.child_id 
      : null;
    const ageBand = body?.age_band && typeof body.age_band === 'string' 
      ? body.age_band 
      : null;
    const destHost = body?.dest_host && typeof body.dest_host === 'string' 
      ? body.dest_host 
      : null;
    const source = body?.source && typeof body.source === 'string' 
      ? body.source 
      : 'recs_v0';

    // Build insert object
    const insertData: any = {
      user_id: user.id,
      product_id: productId,
      child_id: childId,
      age_band: ageBand,
      dest_host: destHost,
      source: source,
    };

    // Best-effort insert: if table missing or RLS blocks, swallow error
    try {
      const { error: insertError } = await supabase
        .from('product_clicks')
        .insert(insertData);
      
      // Log error but don't fail the request (best-effort)
      if (insertError) {
        console.error('[click] Insert failed:', insertError.message);
      }
    } catch (err) {
      // Table might not exist, RLS might block, etc. Swallow and continue.
      console.error('[click] Insert exception:', err);
    }

    // Always return 204 on success (even if insert failed)
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    // Unexpected error: still return 204 to not block navigation
    console.error('[click] Unexpected error:', err);
    return new NextResponse(null, { status: 204 });
  }
}

