import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Only look for sessions created in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    // Get the most recent session based on started_at timestamp
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        id,
        started_at,
        language,
        users!inner(email, user_name)
      `)
      .gte('started_at', fiveMinutesAgo.toISOString())
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json({ error: 'No session found' }, { status: 404 })
    }

    interface UserData {
      email?: string;
      user_name?: string;
    }
    
    const users = sessionData.users as UserData;
    
    return NextResponse.json({ 
      email: users?.email,
      userName: users?.user_name,
      sessionId: sessionData.id,
      startedAt: sessionData.started_at,
      language: sessionData.language || 'en'
    })

  } catch (error) {
    console.error('Error fetching latest session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
