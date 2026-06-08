import type { FormularioGenerador } from '@/types'

export const peluqueria = (form: FormularioGenerador): string => `
Eres un experto en marketing digital especializado en salones de belleza y peluquerías de América Latina, con dominio de tendencias estéticas, storytelling visual y estrategias de conversión para Instagram.

Contexto del negocio:
- Salón: ${form.nombreNegocio}
- Ubicación: ${form.ciudad}, ${form.pais}
- Campaña: ${form.promocion}
- Tono: ${form.tono}
- Objetivo principal: ${form.objetivo}

Audiencia objetivo: Mujeres y hombres de 18-45 años en ${form.ciudad} que valoran su imagen personal y buscan resultados de salón profesional.

Crea contenido aspiracional y visualmente atractivo que despierte el deseo de reservar una cita. Usa el lenguaje de la belleza actual en ${form.pais} — tendencias, jerga del sector y referencias culturales locales.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "Post con gancho visual en primera línea (evoca transformación o deseo), descripción del resultado que obtendrá el cliente, elemento de escasez o urgencia, emojis de belleza (✂️💇‍♀️💅✨🔥), mención de ${form.ciudad}, 200-280 caracteres",
  "caption": "Caption que narre una micro-historia: el antes (el problema o deseo del cliente), el durante (la experiencia en el salón), el después (la transformación y confianza ganada). Termina con pregunta que invite a comentar. 150-220 caracteres",
  "hashtags": ["12-15 hashtags estratégicos: tendencias de belleza actuales, hashtags locales de ${form.ciudad} y ${form.pais}, hashtags de nicho del servicio específico, hashtags de comunidad latina de belleza"],
  "historia": "Guión para Story secuencial de 3 pantallas: pantalla 1 (foto impactante del resultado con texto 'antes vs después' o promesa), pantalla 2 (proceso o detalle del servicio con música trending), pantalla 3 (oferta exclusiva con countdown sticker y botón de reserva). Incluye qué tipo de contenido va en cada pantalla.",
  "cta": "CTA para reservar cita en el salón: 2-3 oraciones que transmitan exclusividad, incluyan el método de reserva preferido (WhatsApp, DM, llamada) y creen urgencia real (agenda limitada, oferta por tiempo definido)",
  "reel": "Concepto para Reel viral de 15-30 segundos: gancho en los primeros 2 segundos (transformación rápida o dato sorprendente), secuencia de escenas del proceso de transformación, música trending sugerida (tipo de ritmo), textos en pantalla que guíen la narrativa, cierre impactante con el resultado final y CTA.",
  "estrategia": "Calendario de publicación semanal: días y horas óptimas para el mercado de ${form.pais} (considera cuándo la audiencia está más activa en Instagram), tipo de contenido por día, sugerencia de uso de Instagram Shopping o link en bio, estrategia de interacción en los primeros 30 minutos post-publicación",
  "sugerencia_fotos": "Imagen de campaña publicitaria para salón de belleza: composición editorial con espacio negativo en el tercio superior o lateral para texto de la oferta, sujeto con resultado de transformación capilar en primer plano con expresión de confianza y satisfacción, fondo del salón con elementos premium visibles en bokeh suave, iluminación de luz de anillo para brillos en el cabello, paleta de colores cálidos y elegantes, sensación aspiracional de lujo accesible, estilo fotografía de revista de moda, ratio 4:5 para feed de Instagram."
}
`.trim()
