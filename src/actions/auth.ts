'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { error: 'El servicio no está disponible temporalmente. Intenta de nuevo en unos minutos.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' }
  }

  redirect('/dashboard')
}

export async function register(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { error: 'El servicio no está disponible temporalmente. Intenta de nuevo en unos minutos.' }
  }

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error('Supabase signUp error:', error.message, error.status)
    return { error: 'No se pudo crear la cuenta. Intenta con otro correo o más tarde.' }
  }

  redirect('/dashboard')
}

export async function loginWithGoogle(): Promise<{ error: string } | undefined> {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { error: 'El servicio no está disponible temporalmente.' }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: 'No se pudo iniciar sesión con Google. Intenta de nuevo.' }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // ignore errors on logout
  }
  redirect('/login')
}
