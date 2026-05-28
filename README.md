# Creator IA LATAM

SaaS web que genera contenido para redes sociales con IA, especializado por nicho para negocios de América Latina.

## Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL)
- **IA**: Groq API (`llama-3.1-8b-instant`) — 100% gratuito
- **Deploy**: Vercel

## Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
GROQ_API_KEY=tu-groq-api-key
```

### Cómo obtener cada variable

- **Supabase**: [supabase.com](https://supabase.com) → Tu proyecto → Settings → API
- **Groq**: [console.groq.com](https://console.groq.com) → API Keys → Create API Key (gratis, sin tarjeta)

## Base de Datos

Ejecuta el SQL de `SCHEMA.md` en el SQL Editor de tu proyecto Supabase antes de iniciar la app.

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Environment Variables**, agrega las 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY` — marca esta como **Server-only** (sin prefijo NEXT_PUBLIC)
3. Deploy automático en cada push a `main`

## Nichos soportados

🦷 Odontólogo · ✂️ Peluquería · 🏠 Inmobiliaria · 💪 Gimnasio · 🔧 Mecánico · 🍽️ Restaurante
