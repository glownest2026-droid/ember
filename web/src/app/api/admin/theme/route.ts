import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { isAdminEmail } from '../../../../lib/admin';
import { mergeTheme } from '../../../../lib/theme';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

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
      return new NextResponse('Invalid JSON', { status: 400 });
    }

    // Validate and extract theme values
    const themeUpdate: any = {};

    // Colors
    if (body.colors) {
      themeUpdate.colors = {};
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const colorFields = ['primary', 'accent', 'background1', 'background2', 'surface', 'section1', 'section2', 'text', 'muted', 'border', 'primaryForeground', 'accentForeground', 'scrollbarThumb'] as const;
      for (const field of colorFields) {
        const value = body.colors[field];
        if (value && typeof value === 'string') {
          if (!hexRegex.test(value.trim())) {
            return new NextResponse(`Invalid ${field} color format`, { status: 400 });
          }
          themeUpdate.colors[field] = value.trim();
        }
      }
    }

    // Typography
    if (body.typography) {
      themeUpdate.typography = {};
      const validFontPairs = ['inter_plusjakarta', 'dmsans_inter', 'manrope_inter', 'worksans_inter', 'nunito_sourcesans3', 'lexend_inter', 'outfit_inter', 'inter_outfit', 'sourcesans3_sourcesans3', 'inter_inter', 'fraunces_inter', 'inter_fraunces'];
      if (body.typography.fontHeading && validFontPairs.includes(body.typography.fontHeading)) {
        themeUpdate.typography.fontHeading = body.typography.fontHeading;
      }
      if (body.typography.fontSubheading && validFontPairs.includes(body.typography.fontSubheading)) {
        themeUpdate.typography.fontSubheading = body.typography.fontSubheading;
      }
      if (body.typography.fontBody && validFontPairs.includes(body.typography.fontBody)) {
        themeUpdate.typography.fontBody = body.typography.fontBody;
      }
      if (body.typography.baseFontSize && typeof body.typography.baseFontSize === 'number') {
        const size = Math.max(12, Math.min(72, body.typography.baseFontSize));
        themeUpdate.typography.baseFontSize = size;
      }
    }

    // Components
    if (body.components) {
      themeUpdate.components = {};
      if (body.components.radius && typeof body.components.radius === 'number') {
        const radius = Math.max(0, Math.min(24, body.components.radius));
        themeUpdate.components.radius = radius;
      }
    }

    // Get current theme to merge
    const { data: current } = await supabase
      .from('site_settings')
      .select('theme')
      .eq('id', 'global')
      .single();

    const currentTheme = (current?.theme as any) || {};
    
    // Use mergeTheme helper to ensure defaults and proper merging
    const mergedTheme = mergeTheme({
      ...currentTheme,
      colors: { ...currentTheme.colors, ...themeUpdate.colors },
      typography: { ...currentTheme.typography, ...themeUpdate.typography },
      components: { ...currentTheme.components, ...themeUpdate.components },
    });

    // Create service role client to bypass RLS for admin writes
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update-first approach (avoids insert-policy edge cases)
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('site_settings')
      .update({
        theme: mergedTheme,
        updated_by: user.id,
      })
      .eq('id', 'global')
      .select('id, theme, updated_at, updated_by')
      .single();

    let savedData = updatedData;

    // If update returned no row, insert as fallback
    if (updateError || !savedData) {
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('site_settings')
        .insert({
          id: 'global',
          theme: mergedTheme,
          updated_by: user.id,
        })
        .select('id, theme, updated_at, updated_by')
        .single();

      if (insertError) {
        return new NextResponse(JSON.stringify({ success: false, error: insertError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!insertedData) {
        return new NextResponse(JSON.stringify({ success: false, error: 'No row returned from insert' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      savedData = insertedData;
    }

    if (!savedData) {
      return new NextResponse(JSON.stringify({ success: false, error: 'No row returned from database write' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Revalidate paths to clear cache
    revalidatePath('/', 'layout');
    revalidatePath('/app', 'layout');
    revalidatePath('/signin', 'layout');
    revalidatePath('/cms', 'layout');

    return new NextResponse(JSON.stringify({ 
      success: true, 
      theme: savedData.theme,
      updated_at: savedData.updated_at
    }), {
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

