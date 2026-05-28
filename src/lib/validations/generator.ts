import { z } from 'zod'
import { NICHOS } from '@/types'

export const generatorSchema = z.object({
  nombreNegocio: z.string().min(1, 'El nombre del negocio es requerido').trim(),
  pais: z.string().min(1, 'El país es requerido').trim(),
  ciudad: z.string().min(1, 'La ciudad es requerida').trim(),
  promocion: z.string().min(1, 'La promoción o servicio es requerido').trim(),
  tono: z.string().min(1, 'El tono de comunicación es requerido').trim(),
  objetivo: z.string().min(1, 'El objetivo es requerido').trim(),
})

export const generateRequestSchema = z.object({
  nicho: z.enum(NICHOS as [string, ...string[]]),
  nichoPersonalizado: z.string().optional(),
  formulario: generatorSchema,
})

export type GeneratorFormValues = z.infer<typeof generatorSchema>
