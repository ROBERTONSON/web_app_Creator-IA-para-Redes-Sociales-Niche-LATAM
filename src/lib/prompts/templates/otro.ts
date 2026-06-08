import type { FormularioGenerador } from '@/types'

export const otro = (form: FormularioGenerador): string => `
Eres un experto en marketing digital con experiencia en múltiples industrias de América Latina. Tu especialidad es identificar rápidamente el lenguaje, las motivaciones y los puntos de dolor de cualquier audiencia para crear contenido de alto impacto que convierta seguidores en clientes.

Contexto del negocio:
- Negocio: ${form.nombreNegocio}
- Tipo: ${(form as FormularioGenerador & { nichoPersonalizado?: string }).nichoPersonalizado || 'Negocio local'}
- Ubicación: ${form.ciudad}, ${form.pais}
- Campaña: ${form.promocion}
- Tono: ${form.tono}
- Objetivo principal: ${form.objetivo}

Adapta completamente el contenido al tipo de negocio indicado — usa el vocabulario, emojis, referencias culturales y argumentos de venta específicos de esa industria en ${form.pais}.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "Post con gancho poderoso en primera línea adaptado al tipo de negocio, beneficio concreto de la promoción, elemento de diferenciación o propuesta de valor única, emojis relevantes al sector, mención de ${form.ciudad}, 200-280 caracteres",
  "caption": "Caption narrativo: problema real que enfrenta el cliente objetivo de este tipo de negocio, cómo la promoción lo resuelve de forma concreta, elemento de confianza (garantía, experiencia, número de clientes), pregunta de engagement relevante al sector. 150-220 caracteres",
  "hashtags": ["12-15 hashtags estratégicos: sector específico del negocio en ${form.pais}, hashtags locales de ${form.ciudad}, hashtags de la industria en español latinoamericano, hashtags de la promoción específica, hashtags de comunidad del nicho"],
  "historia": "Guión para Story de conversión de 3 pantallas adaptado al negocio: pantalla 1 (problema o deseo que el cliente tiene — texto impactante con elemento visual relevante al sector), pantalla 2 (solución que ofrece el negocio con demostración o testimonio del servicio/producto), pantalla 3 (oferta de la promoción con precio o beneficio claro y botón de contacto directo). Especifica el tipo de contenido visual para cada pantalla.",
  "cta": "CTA adaptado al tipo de negocio y objetivo: 2-3 oraciones que incluyan el beneficio central de la promoción, el canal de contacto preferido del sector (WhatsApp, reserva, visita, llamada) y urgencia genuina que motive la acción inmediata",
  "reel": "Concepto para Reel de 15-30 segundos completamente adaptado al sector del negocio: gancho en los primeros 3 segundos (elemento más impactante o sorprendente del producto/servicio), secuencia de escenas que muestren el proceso o resultado, textos en pantalla con los beneficios clave, música apropiada al ambiente del negocio, cierre con la oferta y CTA de acción inmediata.",
  "estrategia": "Plan de publicación adaptado al ciclo de compra de los clientes de este tipo de negocio en ${form.pais}: días y horas óptimas según los hábitos de la audiencia objetivo, frecuencia recomendada, tipo de contenido para cada día de la semana, estrategia específica para maximizar el alcance en ${form.ciudad}",
  "sugerencia_fotos": "Imagen de campaña publicitaria profesional adaptada al sector del negocio: composición editorial con espacio negativo claro en el tercio superior o lateral para superponer texto de la oferta o nombre del negocio, elemento principal del producto o servicio en primer plano con bokeh en el fondo, iluminación profesional que resalte la propuesta de valor, paleta de colores coherente con la identidad del sector, sensación aspiracional y de confianza que active el deseo de compra, estilo fotografía de campaña publicitaria de marca reconocida, ratio 4:5 para feed de Instagram."
}
`.trim()
