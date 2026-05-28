export type Nicho =
  | 'odontologo'
  | 'peluqueria'
  | 'inmobiliaria'
  | 'gimnasio'
  | 'mecanico'
  | 'restaurante'
  | 'otro';

export const NICHOS: Nicho[] = ['odontologo', 'peluqueria', 'inmobiliaria', 'gimnasio', 'mecanico', 'restaurante', 'otro'];

export const NICHOS_CONFIG: Record<Nicho, { label: string; emoji: string }> = {
  odontologo:   { label: 'Odontólogo',              emoji: '🦷' },
  peluqueria:   { label: 'Peluquería / Salón',       emoji: '✂️' },
  inmobiliaria: { label: 'Inmobiliaria',             emoji: '🏠' },
  gimnasio:     { label: 'Gimnasio',                 emoji: '💪' },
  mecanico:     { label: 'Mecánico',                 emoji: '🔧' },
  restaurante:  { label: 'Restaurante',              emoji: '🍽️' },
  otro:         { label: 'Otro negocio',             emoji: '🏢' },
};

export type TonoComunicacion =
  | 'profesional'
  | 'amigable'
  | 'urgente'
  | 'inspirador'
  | string;

export type ObjetivoPublicacion =
  | 'atraer_clientes'
  | 'promocionar_oferta'
  | 'generar_confianza'
  | 'aumentar_seguidores'
  | string;

export interface FormularioGenerador {
  nombreNegocio: string;
  pais: string;
  ciudad: string;
  promocion: string;
  tono: TonoComunicacion;
  objetivo: ObjetivoPublicacion;
}

export interface GeneracionContenido {
  postInstagram: string;
  caption: string;
  hashtags: string[];
  historia: string;
  cta: string;
  reel: string;
  estrategia: string;
  sugerenciaFotos: string;
}

export interface Generacion {
  id: string;
  userId: string;
  nicho: Nicho;
  formulario: FormularioGenerador;
  contenido: GeneracionContenido;
  createdAt: string;
}

export interface GenerateRequest {
  nicho: Nicho;
  formulario: FormularioGenerador;
}

export interface GenerateResponse {
  success: boolean;
  generation?: Generacion;
  error?: string;
}
