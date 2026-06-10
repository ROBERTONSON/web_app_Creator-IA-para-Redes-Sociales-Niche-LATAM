'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { login, loginWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setGoogleError(null)
    const result = await loginWithGoogle()
    if (result?.error) {
      setGoogleError(result.error)
      setGoogleLoading(false)
    }
    // If no error, redirect happens server-side
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="mb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} />
            Volver al inicio
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
        <CardDescription>Accede a tu cuenta para generar contenido</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google OAuth button */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-3"
          onClick={handleGoogleLogin}
          disabled={googleLoading || pending}
        >
          {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
          {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
        </Button>

        {googleError && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {googleError}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">o con correo</span>
          <Separator className="flex-1" />
        </div>

        {state?.error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" placeholder="tu@correo.com" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full" disabled={pending || googleLoading}>
            {pending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">Regístrate</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
