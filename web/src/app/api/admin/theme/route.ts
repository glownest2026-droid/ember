import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { isAdmin } from '../../../../lib/admin';
import { mergeTheme } from '../../../../lib/theme';
import { revalidatePath } from 'next/cache';

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
          return new NextResponse(JSON.stringify({ success: false, error: insertError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else {
        return new NextResponse(JSON.stringify({ success: false, error: updateError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Verify the write actually happened by selecting back the row
    const { data: saved, error: selectError } = await supabase
      .from('site_settings')
      .select('theme, updated_at')
      .eq('id', 'global')
      .single();

    if (selectError || !saved) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Failed to verify theme save' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Revalidate paths to clear cache
    revalidatePath('/', 'layout');
    revalidatePath('/app', 'layout');
    revalidatePath('/signin', 'layout');

    return new NextResponse(JSON.stringify({ 
      success: true, 
      updated_at: saved.updated_at,
      theme: saved.theme 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new NextResponse(err.message || 'Internal server error', { status: 500 });
  }
}

