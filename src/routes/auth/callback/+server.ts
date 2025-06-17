import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const GET: PageServerLoad = async ({ url, request }) => {
    const { searchParams, origin } = url
    const code = searchParams.get('code')
  
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Erro ao trocar código por sessão:', error);
        throw redirect(303, '/');
      }
    }
  
    throw redirect(303, '/dashboard')
  }
