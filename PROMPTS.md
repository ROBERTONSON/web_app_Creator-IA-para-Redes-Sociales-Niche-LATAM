# PROMPTS — Templates de Generación por Nicho

## Estructura General

Todos los prompts siguen la misma estructura base y producen una respuesta JSON con exactamente 6 campos. La diferencia entre nichos está en el contexto de industria, vocabulario especializado y ejemplos de contenido relevante.

### Respuesta JSON Esperada de Groq

```json
{
  "post_instagram": "Texto principal del post (150-300 caracteres, con emojis)",
  "caption": "Descripción más larga para el caption (100-200 caracteres)",
  "hashtags": ["hashtag1", "hashtag2", "..."],
  "historia": "Idea creativa para Instagram Story (2-3 oraciones)",
  "cta": "Llamada a la acción directa y específica (1 oración)",
  "reel": "Concepto creativo para Reel de 15-30 segundos (2-3 oraciones)"
}
```

> Los hashtags se devuelven **sin** el símbolo `#`. El frontend los agrega al mostrarlos.

---

## Template Base (Función `buildPrompt`)

```typescript
// lib/prompts/index.ts
import { Nicho, FormularioGenerador } from '@/types';
import { templates } from './templates';

export function buildPrompt(nicho: Nicho, form: FormularioGenerador): string {
  return templates[nicho](form);
}
```

---

## Templates por Nicho

### 🦷 Odontólogo

```typescript
// lib/prompts/templates/odontologo.ts
export const odontologo = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para clínicas y consultorios dentales en América Latina.
Tu especialidad es crear contenido que genere confianza, eduque a los pacientes y atraiga nuevos clientes.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado culturalmente a ${form.ciudad}, ${form.pais}.
Usa terminología dental accesible (no demasiado técnica), menciona beneficios concretos y genera confianza profesional.
Incluye referencias locales cuando sea relevante.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de dientes/salud (🦷😁✨), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, mezcla locales (${form.pais}) y generales de odontología
- historia: puede ser un tip dental, antes/después, o promoción del servicio
- reel: idea visual como "proceso de limpieza dental", "transformación de sonrisa", "tips de higiene"
`;
```

---

### ✂️ Peluquería / Salón de Belleza

```typescript
// lib/prompts/templates/peluqueria.ts
export const peluqueria = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para peluquerías y salones de belleza en América Latina.
Tu especialidad es crear contenido visual y aspiracional que muestre transformaciones y atraiga clientes.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado a ${form.ciudad}, ${form.pais}.
Usa lenguaje de moda y belleza, menciona tendencias actuales, genera deseo y urgencia de reservar.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de belleza (✂️💇‍♀️💅✨), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, mezcla locales y de belleza/peluquería
- historia: puede ser un antes/después, tutorial rápido, o promoción del servicio
- reel: idea visual como "transformación de cabello", "proceso de coloración", "tutorial de peinado"
`;
```

---

### 🏠 Inmobiliaria

```typescript
// lib/prompts/templates/inmobiliaria.ts
export const inmobiliaria = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para agencias inmobiliarias en América Latina.
Tu especialidad es crear contenido que genere confianza, muestre propiedades y atraiga compradores o arrendatarios.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado al mercado inmobiliario de ${form.ciudad}, ${form.pais}.
Usa lenguaje de inversión y hogar, menciona beneficios de la zona, genera aspiración y urgencia.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de hogar/ciudad (🏠🏙️🔑✨), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, incluye zona geográfica de ${form.ciudad} y ${form.pais}
- historia: puede ser un tour virtual, tip de inversión, o destacar características de la propiedad
- reel: idea visual como "tour de la propiedad", "el vecindario de ${form.ciudad}", "proceso de compra"
`;
```

---

### 💪 Gimnasio

```typescript
// lib/prompts/templates/gimnasio.ts
export const gimnasio = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para gimnasios y centros de fitness en América Latina.
Tu especialidad es crear contenido motivacional que inspire a entrenar y atraiga nuevos miembros.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado a ${form.ciudad}, ${form.pais}.
Usa lenguaje motivacional y de fitness, menciona resultados concretos, genera energía y urgencia de inscribirse.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de fitness (💪🏋️‍♂️🔥⚡), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, mezcla fitness general y locales de ${form.pais}
- historia: puede ser un reto del día, transformación de miembro, o promoción de membresía
- reel: idea visual como "rutina de 60 segundos", "transformación en 30 días", "tour del gimnasio"
`;
```

---

### 🔧 Mecánico / Taller Automotriz

```typescript
// lib/prompts/templates/mecanico.ts
export const mecanico = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para talleres mecánicos y servicios automotrices en América Latina.
Tu especialidad es crear contenido que genere confianza, eduque sobre mantenimiento y atraiga clientes.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado a ${form.ciudad}, ${form.pais}.
Usa lenguaje técnico accesible, menciona beneficios de mantenimiento preventivo, genera confianza y urgencia.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de autos/herramientas (🔧🚗⚙️🛠️), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, mezcla automotriz general y locales de ${form.pais}
- historia: puede ser un tip de mantenimiento, antes/después de reparación, o promoción del servicio
- reel: idea visual como "proceso de cambio de aceite", "diagnóstico en tiempo real", "tips de mantenimiento"
`;
```

---

### 🍽️ Restaurante

```typescript
// lib/prompts/templates/restaurante.ts
export const restaurante = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para restaurantes y negocios de gastronomía en América Latina.
Tu especialidad es crear contenido que despierte el apetito, muestre la experiencia y atraiga comensales.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado a la gastronomía de ${form.ciudad}, ${form.pais}.
Usa lenguaje sensorial y gastronómico, menciona ingredientes locales cuando sea relevante, genera antojo y urgencia de visitar.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones"
}

Instrucciones específicas:
- post_instagram: incluye emojis de comida (🍽️😋🔥👨‍🍳), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, mezcla gastronomía local de ${form.pais} y generales de foodie
- historia: puede ser un proceso de preparación, plato del día, o promoción especial
- reel: idea visual como "preparación del plato estrella", "tour del restaurante", "reacción de clientes"
`;
```

---

## Configuración de Groq para JSON Mode

```typescript
// lib/groq/generate.ts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateContent(prompt: string): Promise<GroqResponseSchema> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }, // Fuerza respuesta JSON
      temperature: 0.8,                          // Creatividad moderada
      max_tokens: 1024,
    });
    clearTimeout(timeout);
    const text = completion.choices[0]?.message?.content ?? '{}';
    return JSON.parse(text) as GroqResponseSchema;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}
```

## Notas de Localización

- Todos los prompts instruyen al modelo a usar **español latinoamericano** (no castellano de España).
- El país y ciudad se inyectan directamente en el prompt para referencias culturales locales.
- Los hashtags deben incluir variantes locales del país (ej: `colombia`, `bogota`, `medellin`).
- El tono y objetivo del formulario se pasan directamente al prompt para personalización adicional.
- Groq con `llama-3.1-8b-instant` es completamente gratuito — obtén tu API key en [console.groq.com](https://console.groq.com) sin tarjeta de crédito.
