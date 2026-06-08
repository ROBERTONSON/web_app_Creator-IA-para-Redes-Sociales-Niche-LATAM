import type { FormularioGenerador } from '@/types'

export const restaurante = (form: FormularioGenerador): string => `
Eres un experto en marketing gastronómico digital para el mercado latinoamericano, especializado en crear contenido que activa los sentidos a través de la pantalla, genera antojo irresistible y convierte visualizaciones en reservas y visitas.

Contexto del negocio:
- Restaurante: ${form.nombreNegocio}
- Ubicación: ${form.ciudad}, ${form.pais}
- Campaña: ${form.promocion}
- Tono: ${form.tono}
- Objetivo principal: ${form.objetivo}

Audiencia objetivo: Foodlovers, familias y parejas de 20-50 años en ${form.ciudad} que buscan experiencias gastronómicas memorables, buen ambiente y relación calidad-precio.

Crea contenido que haga agua la boca y genere la sensación de "tengo que ir ahora". Usa el lenguaje gastronómico de ${form.pais} — ingredientes locales, platos típicos de la región, referencias culturales de ${form.ciudad}.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto adicional):
{
  "post_instagram": "Post que active múltiples sentidos en texto (describe sabor, textura, aroma, temperatura), genera antojo inmediato con la promoción, crea urgencia de visita, emojis gastronómicos (🍽️😋🔥👨‍🍳🌶️), mención de ${form.ciudad}, 200-280 caracteres",
  "caption": "Caption sensorial narrativo: describe la experiencia completa de visitar el restaurante — el momento en que llegas, el aroma que te recibe, el primer bocado, la atmósfera. Conecta emocionalmente con momentos especiales (fechas, celebraciones, antojo nocturno). Incluye dato del ingrediente local o técnica culinaria especial. Termina con pregunta de engagement gastronómico. 150-220 caracteres",
  "hashtags": ["12-15 hashtags: gastronomía de ${form.pais}, foodie community de ${form.ciudad}, tipo de cocina específica, ingredientes locales, experiencias gastronómicas en LATAM, hashtags de antojo y comida trending"],
  "historia": "Guión para Story gastronómica de 3 pantallas: pantalla 1 (foto o video del plato estrella en primer plano cinematográfico con texto de la oferta — genera antojo inmediato), pantalla 2 (detrás de escenas: chef preparando el plato o ingredientes frescos del día — transmite calidad y autenticidad), pantalla 3 (tabla de precios o la oferta específica con botón de reserva o ubicación en mapa). Ritmo visual lento y apetitoso.",
  "cta": "CTA gastronómico irresistible: 2-3 oraciones que activen el antojo y la urgencia de visitar hoy, incluyan el mecanismo de reserva o llegada (reserva por WhatsApp, visita sin reserva, pedir a domicilio), el beneficio específico de la promoción y un elemento de escasez",
  "reel": "Concepto para Reel gastronómico viral de 15-25 segundos: gancho en 2-3 segundos (el momento más apetitoso del plato — queso derritiéndose, corte perfecto, vapor de comida caliente), secuencia de preparación en cámara rápida o proceso del chef, texto en pantalla con los ingredientes estrella o el nombre del plato, música ambiental de ambiente del restaurante o trending gastronómica, cierre con plato terminado + precio de la oferta y ubicación en ${form.ciudad}.",
  "estrategia": "Calendario gastronómico para ${form.ciudad}: días y horas óptimas para publicar (antes del almuerzo y cena cuando el hambre activa el algoritmo), Stories diarias de plato del día o especial, Reels semanales de preparación o técnica culinaria, estrategia de contenido de temporada según festividades de ${form.pais}, cómo usar la ubicación de Instagram para capturar búsquedas de restaurantes en ${form.ciudad}",
  "sugerencia_fotos": "Imagen de campaña gastronómica estilo revista: plato estrella en primer plano perfectamente emplatado con composición en regla de tercios, espacio negativo en zona superior o lateral para texto de la oferta o nombre del restaurante, iluminación lateral suave que resalta texturas y colores del alimento, elementos de mesa premium en el fondo (desfocados), vapor sutil o elemento dinámico que transmite frescura, paleta de colores cálidos y apetitosos, fondo de madera oscura o mármol, estilo fotografía de revista gastronómica internacional, ratio 4:5 para feed de Instagram."
}
`.trim()
