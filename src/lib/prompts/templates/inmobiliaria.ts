import type { FormularioGenerador } from '@/types'

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
  "reel": "concepto de reel en 2-3 oraciones",
  "estrategia": "plan de 3-4 pasos sobre cuándo y cómo publicar este contenido durante la semana, incluyendo días y horarios recomendados para LATAM",
  "sugerencia_fotos": "descripción detallada de 3 tipos de fotos ideales para acompañar este contenido, con indicaciones de iluminación, ángulo y elementos a incluir"
}

Instrucciones:
- post_instagram: incluye emojis de hogar/ciudad (🏠🏙️🔑✨), menciona ${form.ciudad}
- hashtags: 10-15 hashtags en español, incluye zona geográfica de ${form.ciudad} y ${form.pais}, sin el símbolo #
- historia: puede ser un tour virtual, tip de inversión, o destacar características de la propiedad
- reel: idea visual como "tour de la propiedad", "el vecindario de ${form.ciudad}", "proceso de compra"
- estrategia: menciona días específicos (lunes, martes...) y horarios en zona horaria LATAM
- sugerencia_fotos: sé específico, describe fotos reales de propiedades que el agente pueda tomar con su celular
`.trim()
