import type { FormularioGenerador } from '@/types'

export const otro = (form: FormularioGenerador): string => `
Eres un experto en marketing digital para pequeños negocios en América Latina.
Tu especialidad es crear contenido que genere confianza, atraiga clientes y posicione el negocio en redes sociales.

Datos del negocio:
- Nombre: ${form.nombreNegocio}
- Tipo de negocio: ${(form as FormularioGenerador & { nichoPersonalizado?: string }).nichoPersonalizado || 'Negocio local'}
- País: ${form.pais}
- Ciudad: ${form.ciudad}
- Promoción/Servicio: ${form.promocion}
- Tono: ${form.tono}
- Objetivo: ${form.objetivo}

Genera contenido para redes sociales en español latinoamericano, adaptado a ${form.ciudad}, ${form.pais}.
Adapta el lenguaje y referencias al tipo de negocio indicado.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "texto del post con emojis, 150-300 caracteres",
  "caption": "caption más detallado, 100-200 caracteres",
  "hashtags": ["hashtag1", "hashtag2"],
  "historia": "idea para story en 2-3 oraciones",
  "cta": "llamada a la acción en 1 oración",
  "reel": "concepto de reel en 2-3 oraciones",
  "estrategia": "plan de 3-4 pasos sobre cuándo y cómo publicar este contenido durante la semana, incluyendo días y horarios recomendados para LATAM",
  "sugerencia_fotos": "descripción detallada de 3 tipos de fotos ideales para acompañar este contenido, con indicaciones de iluminación, ángulo y elementos a incluir"
}

Instrucciones:
- hashtags: 10-15 hashtags en español, mezcla locales (${form.pais}) y generales del sector, sin el símbolo #
- estrategia: menciona días específicos (lunes, martes...) y horarios en zona horaria LATAM
- sugerencia_fotos: sé específico, describe fotos reales que el dueño del negocio pueda tomar con su celular
`.trim()
