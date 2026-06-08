import type { FormularioGenerador } from '@/types'

export const inmobiliaria = (form: FormularioGenerador): string => `
Eres un experto en marketing inmobiliario digital para el mercado latinoamericano, especializado en crear contenido que genera confianza, posiciona agentes como autoridad y convierte seguidores en compradores o arrendatarios calificados.

Contexto del negocio:
- Inmobiliaria: ${form.nombreNegocio}
- Mercado: ${form.ciudad}, ${form.pais}
- Campaña: ${form.promocion}
- Tono: ${form.tono}
- Objetivo principal: ${form.objetivo}

Audiencia objetivo: Familias y profesionales de 28-55 años en ${form.ciudad} con capacidad de compra o arriendo, que buscan seguridad, buena ubicación y valorización de su inversión.

Crea contenido que combine aspiración de hogar con argumentos racionales de inversión. Usa referencias al mercado inmobiliario local de ${form.ciudad} y ${form.pais}.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "Post que combina aspiración emocional (el sueño del hogar o la inversión inteligente) con dato concreto de la propiedad o promoción, genera urgencia de oportunidad, emojis de hogar e inversión (🏠🔑💰✨🏙️), mención de ${form.ciudad}, 200-280 caracteres",
  "caption": "Caption narrativo: describe la experiencia de vivir o invertir en esta propiedad/zona — qué se siente al despertar ahí, ventajas del vecindario en ${form.ciudad}, argumento de valorización o ahorro. Incluye elemento de urgencia y pregunta de engagement. 150-220 caracteres",
  "hashtags": ["12-15 hashtags: mercado inmobiliario de ${form.pais}, zona específica de ${form.ciudad}, tipo de propiedad, hashtags de inversión y finanzas personales, comunidad de compradores en LATAM"],
  "historia": "Guión para Story inmersivo de 3 pantallas: pantalla 1 (foto exterior de impacto con precio o beneficio en texto grande), pantalla 2 (tour rápido interior con highlights de la propiedad — menciona 2-3 características clave), pantalla 3 (oferta o facilidades de financiamiento con botón de contacto directo). Especifica qué mostrar en cada pantalla.",
  "cta": "CTA directo para agendar visita o solicitar información: 2-3 oraciones que incluyan el beneficio inmediato, eliminen la fricción y generen urgencia de actuar hoy (ej: enlace de WhatsApp, agendar visita, solicitar ficha técnica)",
  "reel": "Concepto para Reel de propiedad de 20-30 segundos: gancho en los 3 primeros segundos (dato impactante del precio por m² o beneficio único), secuencia cinematográfica de recorrido (exterior → sala → espacios destacados → vista), texto en pantalla con los 3 beneficios principales, música de ambiente moderno y sofisticado, cierre con información de contacto y CTA.",
  "estrategia": "Plan de publicación para maximizar visibilidad en el mercado de ${form.ciudad}: días y horarios en que compradores potenciales están activos en ${form.pais}, frecuencia de publicación recomendada, estrategia de Stories 'detrás de escenas' del proceso de compra, uso de Reels para tours virtuales, tip de geolocalización para llegar a audiencia de ${form.ciudad}",
  "sugerencia_fotos": "Imagen de campaña publicitaria inmobiliaria: propiedad arquitectónica en composición de tercio inferior con cielo dramático o skyline urbano ocupando los dos tercios superiores (espacio para texto de la oferta), iluminación de hora dorada que crea calidez y aspiración, elementos de lujo accesible en primer plano (jardín, piscina, fachada moderna), profundidad de campo que muestra el entorno del vecindario, paleta de colores dorados y blancos que transmiten inversión segura, estilo fotografía de revista de arquitectura y diseño, ratio 4:5 para feed de Instagram."
}
`.trim()
