'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { generatorSchema, type GeneratorFormValues } from '@/lib/validations/generator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Nicho } from '@/types'

const TONOS = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'amigable', label: 'Amigable' },
  { value: 'urgente', label: 'Urgente' },
  { value: 'inspirador', label: 'Inspirador' },
]

const OBJETIVOS = [
  { value: 'atraer_clientes', label: 'Atraer clientes' },
  { value: 'promocionar_oferta', label: 'Promocionar oferta' },
  { value: 'generar_confianza', label: 'Generar confianza' },
  { value: 'aumentar_seguidores', label: 'Aumentar seguidores' },
]

interface GeneratorFormProps {
  nicho: Nicho
  onSubmit: (data: GeneratorFormValues) => Promise<void>
  isLoading: boolean
}

export default function GeneratorForm({ nicho, onSubmit, isLoading }: GeneratorFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre del negocio */}
      <div className="space-y-1.5">
        <Label htmlFor="nombreNegocio">Nombre del negocio</Label>
        <Input
          id="nombreNegocio"
          placeholder="Ej: Clínica Dental Sonrisa"
          {...register('nombreNegocio')}
          aria-invalid={!!errors.nombreNegocio}
        />
        {errors.nombreNegocio && (
          <p className="text-xs text-destructive">{errors.nombreNegocio.message}</p>
        )}
      </div>

      {/* País y Ciudad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pais">País</Label>
          <Input
            id="pais"
            placeholder="Ej: Colombia"
            {...register('pais')}
            aria-invalid={!!errors.pais}
          />
          {errors.pais && (
            <p className="text-xs text-destructive">{errors.pais.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            placeholder="Ej: Bogotá"
            {...register('ciudad')}
            aria-invalid={!!errors.ciudad}
          />
          {errors.ciudad && (
            <p className="text-xs text-destructive">{errors.ciudad.message}</p>
          )}
        </div>
      </div>

      {/* Promoción o servicio */}
      <div className="space-y-1.5">
        <Label htmlFor="promocion">Promoción o servicio a destacar</Label>
        <Textarea
          id="promocion"
          placeholder="Ej: Limpieza dental + blanqueamiento por $150.000"
          rows={3}
          {...register('promocion')}
          aria-invalid={!!errors.promocion}
        />
        {errors.promocion && (
          <p className="text-xs text-destructive">{errors.promocion.message}</p>
        )}
      </div>

      {/* Tono */}
      <div className="space-y-1.5">
        <Label>Tono de comunicación</Label>
        <Controller
          name="tono"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tono" />
              </SelectTrigger>
              <SelectContent>
                {TONOS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tono && (
          <p className="text-xs text-destructive">{errors.tono.message}</p>
        )}
      </div>

      {/* Objetivo */}
      <div className="space-y-1.5">
        <Label>Objetivo de la publicación</Label>
        <Controller
          name="objetivo"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un objetivo" />
              </SelectTrigger>
              <SelectContent>
                {OBJETIVOS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.objetivo && (
          <p className="text-xs text-destructive">{errors.objetivo.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generando contenido...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generar contenido
          </>
        )}
      </Button>
    </form>
  )
}
