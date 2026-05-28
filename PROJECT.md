# Creator IA LATAM — Visión General del Proyecto

## ¿Qué es?

SaaS web que permite a pequeños negocios latinoamericanos generar contenido optimizado para redes sociales mediante IA. El usuario selecciona su nicho, completa un formulario con datos de su negocio y recibe 6 piezas de contenido listas para publicar: post de Instagram, caption, hashtags, historia, CTA e idea de Reel.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth + PostgreSQL) |
| IA | Groq API (`llama-3.1-8b-instant`) — 100% gratuito |
| Deploy | Vercel |
| Testing | Vitest, React Testing Library, fast-check |

## Nichos Soportados

🦷 Odontólogo · ✂️ Peluquería/Salón · 🏠 Inmobiliaria · 💪 Gimnasio · 🔧 Mecánico · 🍽️ Restaurante

## Estructura del Proyecto

```
creator-ia-latam/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rutas públicas: login, register
│   │   ├── (dashboard)/        # Rutas protegidas: dashboard, generate, history
│   │   └── api/generate/       # Route Handler para Groq API
│   ├── components/             # Componentes React
│   ├── lib/                    # Utilidades: supabase, gemini, prompts, validaciones
│   ├── actions/                # Server Actions (auth, history)
│   ├── types/                  # Tipos TypeScript compartidos
│   └── middleware.ts           # Auth guard para rutas protegidas
├── tests/
│   ├── unit/                   # Unit tests con Vitest
│   └── properties/             # Property-based tests con fast-check
├── .kiro/specs/creator-ia-latam/  # Especificaciones del proyecto
├── PROJECT.md                  # Este archivo
├── TASKS.md                    # Lista de tareas de implementación
├── SCHEMA.md                   # Schema de base de datos
├── PROMPTS.md                  # Templates de prompts por nicho
└── DECISIONS.md                # Decisiones técnicas y su justificación
```

## Variables de Entorno Requeridas

```bash
NEXT_PUBLIC_SUPABASE_URL=       # URL pública de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Anon key de Supabase (segura con RLS)
GROQ_API_KEY=                   # API key de Groq (solo servidor) — gratis en console.groq.com
```

## Comandos Principales

```bash
npm run dev          # Servidor de desarrollo (ejecutar manualmente)
npm run build        # Build de producción
npm run test         # Tests unitarios (vitest --run)
npm run test:props   # Property-based tests (vitest --run tests/properties)
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Documentación

- `SCHEMA.md` — Schema completo de la base de datos Supabase
- `PROMPTS.md` — Templates de prompts por nicho con instrucciones de localización
- `DECISIONS.md` — Decisiones técnicas clave y sus justificaciones
- `TASKS.md` — Lista de tareas de implementación con estado
- `.kiro/specs/creator-ia-latam/requirements.md` — Requisitos funcionales
- `.kiro/specs/creator-ia-latam/design.md` — Diseño técnico completo
