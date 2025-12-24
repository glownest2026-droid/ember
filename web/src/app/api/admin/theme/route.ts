import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { isAdmin } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new NextResponse('Invalid JSON', { status: 400 });
    }

    // Validate and extract theme values
    const primary = body?.primary && typeof body.primary === 'string' ? body.primary.trim() : null;
    const accent = body?.accent && typeof body.accent === 'string' ? body.accent.trim() : null;
    const fontPair = body?.fontPair && typeof body.fontPair === 'string' ? body.fontPair.trim() : null;

    // Validate hex colors if provided
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primary && !hexRegex.test(primary)) {
      return new NextResponse('Invalid primary color format', { status: 400 });
    }
    if (accent && !hexRegex.test(accent)) {
      return new NextResponse('Invalid accent color format', { status: 400 });
    }

    // Validate font pair if provided
    const validFontPairs = ['inter_plusjakarta', 'dmSans_spaceGrotesk', 'nunito_sourceSans'];
    if (fontPair && !validFontPairs.includes(fontPair)) {
      return new NextResponse('Invalid font pair', { status: 400 });
    }

    // Build theme object (only include provided values)
    const themeUpdate: any = {};
    if (primary) themeUpdate.primary = primary;
    if (accent) themeUpdate.accent = accent;
    if (fontPair) themeUpdate.fontPair = fontPair;

    // Get current theme to merge
    const { data: current } = await supabase
      .from('site_settings')
      .select('theme')
      .eq('id', 'global')
      .single();

    const currentTheme = (current?.theme as any) || {};
    const mergedTheme = { ...currentTheme, ...themeUpdate };

    // Update site_settings
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        theme: mergedTheme,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', 'global');

    if (updateError) {
      // If row doesn't exist, try to insert
      if (updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({
            id: 'global',
            theme: mergedTheme,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          });

        if (insertError) {
          return new NextResponse(insertError.message, { status: 500 });
        }
      } else {
        return new NextResponse(updateError.message, { status: 500 });
      }
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new NextResponse(err.message || 'Internal server error', { status: 500 });
  }
}

