# TASKS — Creator IA LATAM

Estado: `[ ]` pendiente · `[~]` en progreso · `[x]` completado

---

## Fase 0: Setup del Proyecto

- [ ] 0.1 Inicializar proyecto Next.js 14 con TypeScript y App Router
- [ ] 0.2 Configurar Tailwind CSS y shadcn/ui (tema dark mode)
- [ ] 0.3 Instalar dependencias: `@supabase/ssr`, `groq`, `zod`, `react-hook-form`, `fast-check`
- [ ] 0.4 Configurar variables de entorno (`.env.local`, `.env.example`)
- [ ] 0.5 Configurar Vitest y React Testing Library
- [ ] 0.6 Configurar ESLint y TypeScript strict mode

---

## Fase 1: Base de Datos y Auth (Supabase)

- [ ] 1.1 Crear proyecto en Supabase
- [ ] 1.2 Ejecutar SQL de creación de tabla `generations` (ver `SCHEMA.md`)
- [ ] 1.3 Configurar políticas RLS (select, insert, delete)
- [ ] 1.4 Crear índice `idx_generations_user_created`
- [ ] 1.5 Configurar clientes Supabase: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`
- [ ] 1.6 Implementar middleware de auth (`src/middleware.ts`)

---

## Fase 2: Autenticación

- [ ] 2.1 Crear Server Actions de auth (`actions/auth.ts`): `login`, `register`, `logout`
- [ ] 2.2 Implementar página de login (`app/(auth)/login/page.tsx`) con `LoginForm`
- [ ] 2.3 Implementar página de registro (`app/(auth)/register/page.tsx`) con `RegisterForm`
- [ ] 2.4 Manejar errores de Supabase no disponible (Req 1.6)
- [ ] 2.5 Tests unitarios: login válido, credenciales inválidas, logout
- [ ] 2.6 Property tests: Props 1, 2, 3, 4

---

## Fase 3: Layout del Dashboard

- [ ] 3.1 Implementar layout del dashboard (`app/(dashboard)/layout.tsx`) con Sidebar
- [ ] 3.2 Implementar componente `Sidebar` con navegación: Dashboard, Historial
- [ ] 3.3 Configurar dark mode como tema predeterminado
- [ ] 3.4 Hacer el layout responsivo (mínimo 320px)
- [ ] 3.5 Implementar animaciones de transición (máx 300ms)

---

## Fase 4: Selección de Nicho y Formulario

- [ ] 4.1 Implementar `NichoSelector` con los 6 nichos y sus emojis
- [ ] 4.2 Implementar `GeneratorForm` con los 6 campos obligatorios
- [ ] 4.3 Configurar opciones predefinidas para `tono` y `objetivo`
- [ ] 4.4 Implementar validación con Zod + react-hook-form
- [ ] 4.5 Limpiar formulario al cambiar nicho (Req 2.4)
- [ ] 4.6 Habilitar botón de generación solo con formulario completo (Req 3.5)
- [ ] 4.7 Tests unitarios: 6 nichos presentes, campos requeridos, opciones predefinidas
- [ ] 4.8 Property tests: Props 5, 6, 7

---

## Fase 5: Prompt Templates

- [ ] 5.1 Implementar template base con estructura JSON esperada
- [ ] 5.2 Implementar template `odontologo.ts`
- [ ] 5.3 Implementar template `peluqueria.ts`
- [ ] 5.4 Implementar template `inmobiliaria.ts`
- [ ] 5.5 Implementar template `gimnasio.ts`
- [ ] 5.6 Implementar template `mecanico.ts`
- [ ] 5.7 Implementar template `restaurante.ts`
- [ ] 5.8 Implementar `buildPrompt(nicho, formData)` en `lib/prompts/index.ts`
- [ ] 5.9 Property tests: Prop 8

---

## Fase 6: Generación con Groq API

- [ ] 6.1 Configurar cliente Groq (`lib/groq/client.ts`)
- [ ] 6.2 Implementar `generateContent` wrapper con timeout de 30s (`lib/groq/generate.ts`)
- [ ] 6.3 Implementar Route Handler `POST /api/generate` con validación Zod
- [ ] 6.4 Parsear respuesta JSON de Groq y validar los 6 campos
- [ ] 6.5 Persistir generación en Supabase tras éxito
- [ ] 6.6 Manejar errores: timeout, error de Groq, error de Supabase
- [ ] 6.7 Implementar `LoadingState` durante la generación
- [ ] 6.8 Tests unitarios: timeout de Groq (edge case), error handling
- [ ] 6.9 Property tests: Props 9, 15

---

## Fase 7: Visualización de Resultados

- [ ] 7.1 Implementar `GenerationResult` con los 6 elementos en secciones
- [ ] 7.2 Implementar `ContentCard` con botón de copia individual
- [ ] 7.3 Implementar página de resultados (`app/(dashboard)/generate/page.tsx`)
- [ ] 7.4 Tests unitarios: renderizado de 6 elementos, funcionalidad de copia
- [ ] 7.5 Property tests: Prop 10

---

## Fase 8: Historial

- [ ] 8.1 Implementar Server Action `getHistory` (`actions/history.ts`)
- [ ] 8.2 Implementar Server Action `getGeneration` para detalle
- [ ] 8.3 Implementar página de historial como RSC (`app/(dashboard)/history/page.tsx`)
- [ ] 8.4 Implementar `HistoryList` y `HistoryItem`
- [ ] 8.5 Implementar estado vacío con enlace al formulario (Req 5.6)
- [ ] 8.6 Tests unitarios: estado vacío, renderizado de campos requeridos
- [ ] 8.7 Property tests: Props 11, 12, 13, 14

---

## Fase 9: Seguridad y Hardening

- [ ] 9.1 Verificar que `GROQ_API_KEY` no está en el bundle del cliente
- [ ] 9.2 Revisar todas las Server Actions tienen validación de sesión
- [ ] 9.3 Revisar sanitización de inputs en Route Handler
- [ ] 9.4 Configurar headers de seguridad en `next.config.ts`
- [ ] 9.5 Tests: API key no expuesta en cliente (Req 7.1)
- [ ] 9.6 Property tests: Prop 15

---

## Fase 10: Deploy

- [ ] 10.1 Configurar proyecto en Vercel
- [ ] 10.2 Configurar variables de entorno en Vercel
- [ ] 10.3 Configurar dominio personalizado (opcional)
- [ ] 10.4 Smoke test en producción: registro, generación, historial
