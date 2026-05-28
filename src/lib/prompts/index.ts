import type { Nicho, FormularioGenerador } from '@/types'
import { odontologo } from './templates/odontologo'
import { peluqueria } from './templates/peluqueria'
import { inmobiliaria } from './templates/inmobiliaria'
import { gimnasio } from './templates/gimnasio'
import { mecanico } from './templates/mecanico'
import { restaurante } from './templates/restaurante'
import { otro } from './templates/otro'

const templates: Record<Nicho, (form: FormularioGenerador) => string> = {
  odontologo,
  peluqueria,
  inmobiliaria,
  gimnasio,
  mecanico,
  restaurante,
  otro,
}

export function buildPrompt(nicho: Nicho, form: FormularioGenerador): string {
  return templates[nicho](form)
}
