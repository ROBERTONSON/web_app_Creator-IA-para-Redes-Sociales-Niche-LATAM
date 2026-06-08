import type { FormularioGenerador } from '@/types'

export const odontologo = (form: FormularioGenerador): string => `
Eres un experto en marketing digital con 10 años de experiencia creando campañas virales para clínicas y consultorios dentales en América Latina. Tu contenido combina storytelling emocional, educación en salud y persuasión de ventas.

Contexto del negocio:
- Clínica: ${form.nombreNegocio}
- Ubicación: ${form.ciudad}, ${form.pais}
- Campaña: ${form.promocion}
- Tono: ${form.tono}
- Objetivo principal: ${form.objetivo}

Audiencia objetivo: Personas de 25-55 años en ${form.ciudad} que buscan mejorar su salud dental y confianza personal.

Crea contenido de alto impacto para Instagram que genere engagement real, transmita profesionalismo y convierta seguidores en pacientes. Usa referencias culturales locales de ${form.pais} cuando sea relevante.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "Post principal: gancho emocional potente en la primera línea, beneficio concreto del servicio, prueba social o dato de confianza, emojis estratégicos (🦷😁✨💎), mención de ${form.ciudad}, 200-280 caracteres",
  "caption": "Caption narrativo: historia corta que conecte emocionalmente con el problema que soluciona la promoción, incluye beneficio tangible y urgencia sutil, 150-220 caracteres",
  "hashtags": ["lista de 12-15 hashtags: mezcla de alto volumen (#odontologia #salud), nicho (#odontologia${form.pais.replace(/\s/g,'')} #clinicadental${form.ciudad.replace(/\s/g,'').toLowerCase()}) y long-tail (#transformaciondentalen${form.ciudad.replace(/\s/g,'').toLowerCase()})"],
  "historia": "Guión detallado para Instagram Story de 15 segundos: describe pantalla 1 (gancho visual/texto de impacto), pantalla 2 (demostración del servicio o testimonio), pantalla 3 (oferta + CTA con sticker de enlace). Tono urgente y directo.",
  "cta": "CTA específico para el consultorio dental: 2-3 oraciones que incluyan el beneficio inmediato, el mecanismo de contacto (WhatsApp, llamada, reserva online) y urgencia concreta (plazas limitadas, oferta hasta fecha específica)",
  "reel": "Concepto creativo para Reel de 15-30 segundos: describe la secuencia de escenas, el gancho en los primeros 3 segundos (fundamental para el algoritmo), música/ambiente sugerido, texto en pantalla y el cierre con CTA visual. Enfocado en ${form.promocion}.",
  "estrategia": "Plan de publicación semanal específico: día y hora exacta para cada pieza (Post, Story, Reel), justificación basada en hábitos de audiencia en ${form.pais}, frecuencia óptima, tip sobre el algoritmo de Instagram para maximizar alcance orgánico",
  "sugerencia_fotos": "Imagen de campaña publicitaria profesional para clínica dental: composición estilo editorial con espacio negativo limpio en el tercio superior para texto/logo, persona sonriendo con confianza en primer plano (bokeh suave), consultorio moderno de fondo con colores blancos y azules, iluminación de estudio con luz principal suave y relleno lateral, sensación aspiracional de salud y confianza, ratio 4:5 para feed de Instagram, alta calidad fotográfica tipo anuncio de revista."
}
`.trim()
