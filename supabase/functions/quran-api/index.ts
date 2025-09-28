import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const chapter = url.searchParams.get('chapter')
    const verse = url.searchParams.get('verse')

    let apiUrl = ''
    
    switch (action) {
      case 'chapters':
        // Get list of all chapters
        apiUrl = 'https://api.quran.com/api/v4/chapters'
        break
      case 'verses':
        if (!chapter) {
          throw new Error('Chapter number is required for verses')
        }
        // Get verses for a specific chapter
        apiUrl = `https://api.quran.com/api/v4/verses/by_chapter/${chapter}?words=true&translations=20,131&audio=7&tafsirs=169`
        break
      case 'chapter-info':
        if (!chapter) {
          throw new Error('Chapter number is required for chapter info')
        }
        // Get detailed info about a chapter
        apiUrl = `https://api.quran.com/api/v4/chapters/${chapter}?language=en`
        break
      case 'recitations':
        // Get available recitations
        apiUrl = 'https://api.quran.com/api/v4/resources/recitations'
        break
      case 'audio':
        if (!chapter) {
          throw new Error('Chapter number is required for audio')
        }
        // Get audio for specific chapter
        apiUrl = `https://api.quran.com/api/v4/chapter_recitations/7/${chapter}`
        break
      default:
        throw new Error('Invalid action parameter')
    }

    console.log(`Fetching from: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Quran API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})