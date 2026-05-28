# DECISIONS — Decisiones Técnicas

Registro de decisiones técnicas clave, su contexto y justificación.

---

## D1: Next.js App Router con Route Groups

**Decisión**: Usar route groups `(auth)` y `(dashboard)` para separar rutas públicas de protegidas.

**Contexto**: Next.js 14 App Router permite agrupar rutas sin afectar la URL usando paréntesis.

**Justificación**:
- El layout del dashboard (sidebar, auth check) se aplica solo a rutas protegidas sin duplicar código.
- Las rutas de auth tienen su propio layout minimalista (sin sidebar).
- El middleware de auth puede proteger todo el grupo `(dashboard)` con una sola regla.

**Alternativa descartada**: Proteger cada página individualmente con `getServerSideProps` — más verboso y propenso a errores.

---

## D2: Groq API solo desde el servidor (Route Handler)

**Decisión**: Todas las llamadas a Groq API se hacen exclusivamente desde `app/api/generate/route.ts`.

**Contexto**: La `GROQ_API_KEY` es un secreto que no debe exponerse en el cliente.

**Justificación**:
- Variables sin prefijo `NEXT_PUBLIC_` solo están disponibles en el servidor en Next.js.
- Un Route Handler centraliza la lógica de generación, validación y persistencia.
- Permite implementar rate limiting y logging en un solo punto en el futuro.

**Alternativa descartada**: Server Actions para la generación — las Server Actions son ideales para mutaciones de formularios, pero un Route Handler es más apropiado para operaciones con timeout largo (30s) y respuestas estructuradas.

---

## D3: `@supabase/ssr` para manejo de sesiones

**Decisión**: Usar el paquete `@supabase/ssr` en lugar de `@supabase/supabase-js` directamente.

**Contexto**: Next.js App Router requiere manejo especial de cookies para que la sesión funcione en Server Components, Client Components y middleware.

**Justificación**:
- `@supabase/ssr` es el paquete oficial recomendado por Supabase para Next.js App Router.
- Maneja automáticamente la sincronización de cookies entre cliente y servidor.
- Evita el problema de "hydration mismatch" con el estado de auth.

**Alternativa descartada**: `@supabase/auth-helpers-nextjs` — deprecado en favor de `@supabase/ssr`.

---

## D4: Historial como React Server Component (RSC)

**Decisión**: La página de historial se implementa como RSC que hace fetch directo a Supabase.

**Contexto**: El historial es contenido que se lee pero no se modifica en tiempo real.

**Justificación**:
- Los RSC eliminan el waterfall de datos: el HTML llega al cliente ya con los datos.
- No se necesita estado del cliente para mostrar el historial.
- Mejor SEO y performance inicial (aunque el historial está detrás de auth).
- Reduce el JavaScript enviado al cliente.

**Alternativa descartada**: Client Component con `useEffect` + fetch — añade complejidad innecesaria y un estado de carga adicional.

---

## D5: Zod para validación en servidor y cliente

**Decisión**: Usar Zod para definir el schema del formulario, compartido entre cliente (react-hook-form) y servidor (Route Handler).

**Contexto**: La validación debe ocurrir en ambas capas: cliente para UX inmediata, servidor para seguridad.

**Justificación**:
- Un único schema Zod en `lib/validations/generator.ts` es la fuente de verdad.
- `react-hook-form` con `zodResolver` usa el mismo schema en el cliente.
- El Route Handler usa el mismo schema para validar el body del request.
- Garantiza consistencia entre validación de cliente y servidor.

**Alternativa descartada**: Validación manual con `if/else` — más verboso, propenso a inconsistencias.

---

## D6: `llama-3.1-8b-instant` via Groq como modelo de IA

**Decisión**: Usar Groq API con `llama-3.1-8b-instant` en lugar de Gemini API.

**Contexto**: El MVP necesita una solución 100% gratuita sin riesgo de cobros inesperados.

**Justificación**:
- Groq API es completamente gratuita — no requiere tarjeta de crédito para obtener la API key.
- `llama-3.1-8b-instant` es extremadamente rápido (Groq usa hardware LPU especializado).
- La calidad es suficiente para generación de contenido de marketing en español.
- Soporta `response_format: { type: 'json_object' }` para respuestas JSON estructuradas.
- Obtener la API key en [console.groq.com](https://console.groq.com) toma menos de 2 minutos.

**Alternativa descartada**: Gemini API — requiere cuenta de Google Cloud con tarjeta de crédito registrada, lo cual introduce riesgo de cobros aunque tenga free tier.

---

## D7: `response_format: json_object` en Groq

**Decisión**: Configurar Groq para responder en JSON mode en lugar de parsear texto libre.

**Contexto**: La respuesta del modelo debe tener exactamente 6 campos con estructura predefinida.

**Justificación**:
- JSON mode garantiza que la respuesta sea JSON válido, eliminando errores de parsing.
- Evita que el modelo añada texto explicativo antes o después del JSON.
- Reduce la necesidad de prompts complejos para forzar formato JSON.
- Hace el parsing de la respuesta trivial: `JSON.parse(completion.choices[0].message.content)`.

**Alternativa descartada**: Parsear JSON de texto libre con regex — frágil y propenso a errores.

---

## D8: RLS como única capa de aislamiento de datos

**Decisión**: Confiar en las políticas RLS de Supabase como mecanismo principal de aislamiento de datos entre usuarios.

**Contexto**: Cada usuario solo debe ver sus propias generaciones.

**Justificación**:
- RLS opera a nivel de base de datos, es imposible bypassearlo desde la aplicación.
- Las políticas usan `auth.uid()` que Supabase valida automáticamente con el JWT.
- Simplifica el código de la aplicación: no se necesitan filtros `WHERE user_id = ?` explícitos en cada query (aunque se añaden por claridad).
- Protege contra bugs de aplicación que podrían exponer datos de otros usuarios.

**Alternativa descartada**: Solo filtrar por `user_id` en la aplicación — vulnerable a bugs de código.

---

## D9: fast-check para property-based testing

**Decisión**: Usar `fast-check` como librería de property-based testing.

**Contexto**: El diseño especifica 15 propiedades de corrección que deben verificarse con PBT.

**Justificación**:
- `fast-check` es la librería PBT más madura para TypeScript/JavaScript.
- Integración nativa con Vitest mediante `fc.assert` + `fc.property`.
- Generadores ricos: `fc.string`, `fc.record`, `fc.constantFrom`, `fc.array`, etc.
- Shrinking automático: cuando falla, reduce el contraejemplo al mínimo.
- Configuración simple: `fc.configureGlobal({ numRuns: 100 })`.

**Alternativa descartada**: Implementar PBT desde cero — innecesario cuando existe una librería madura.

---

## D10: Dark mode con `class` strategy en Tailwind

**Decisión**: Configurar Tailwind con `darkMode: 'class'` y aplicar dark mode por defecto.

**Contexto**: El requisito especifica dark mode como tema predeterminado.

**Justificación**:
- `class` strategy permite control programático del tema (vs `media` que depende del OS).
- Se puede añadir toggle de tema en el futuro sin cambiar la arquitectura.
- shadcn/ui usa CSS variables que se adaptan automáticamente con la clase `dark` en el `<html>`.
- Aplicar `dark` class en el root layout garantiza dark mode por defecto.

**Alternativa descartada**: `darkMode: 'media'` — no permite override programático del tema.
