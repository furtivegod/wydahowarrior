import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Language } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, language } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!language || (language !== 'en' && language !== 'es')) {
      return NextResponse.json(
        { error: 'Valid language (en or es) is required' },
        { status: 400 }
      );
    }

    // Update session language
    const { data, error } = await supabase
      .from('sessions')
      .update({ language: language as Language })
      .eq('id', sessionId)
      .select('id, language')
      .single();

    if (error) {
      console.error('Error updating session language:', error);
      return NextResponse.json(
        { error: 'Failed to update session language', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: data.id,
      language: data.language,
    });
  } catch (error) {
    console.error('Error in update-language API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

