import { type NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite-preview-06-17']

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

const BRAND_ANALYSIS_PROMPT = `Analiza estas imágenes de referencia de un negocio y extrae una descripción concisa de su identidad visual para usar como contexto en la generación de imágenes publicitarias.

Describe en 3-5 oraciones cortas:
- Colores corporativos predominantes (exactos si es posible: tonos, saturación)
- Estilo visual y estética general (moderno, rústico, minimalista, colorido, etc.)
- Elementos visuales característicos del negocio (tipo de instalaciones, uniformes, productos, decoración)
- Ambiente y sensación que transmiten las imágenes

Responde ÚNICAMENTE con la descripción visual, sin títulos, sin listas, sin formato adicional. La descripción será usada directamente como contexto para un generador de imágenes.`

async function analyzeWithModel(modelId: string, imagesParts: { inlineData: { data: string; mimeType: string } }[]) {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({ model: modelId })

  const result = await model.generateContent([
    BRAND_ANALYSIS_PROMPT,
    ...imagesParts,
  ])

  const text = result.response.text().trim()
  if (!text) throw new Error(`Model ${modelId} returned empty response`)
  return text
}

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Gemini API key not configured' },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 })
  }

  const imageFiles = formData.getAll('images') as File[]
  if (!imageFiles.length) {
    return NextResponse.json({ success: false, error: 'No images provided' }, { status: 400 })
  }

  if (imageFiles.length > 4) {
    return NextResponse.json({ success: false, error: 'Maximum 4 images allowed' }, { status: 400 })
  }

  // Convert images to base64 inline data parts
  const imagesParts: { inlineData: { data: string; mimeType: string } }[] = []
  for (const file of imageFiles) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Tipo de archivo no soportado: ${file.type}` },
        { status: 400 }
      )
    }
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    imagesParts.push({ inlineData: { data: base64, mimeType: file.type } })
  }

  let lastError = ''
  for (const modelId of GEMINI_MODELS) {
    try {
      const brandContext = await analyzeWithModel(modelId, imagesParts)
      return NextResponse.json({ success: true, brandContext })
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.warn(`Gemini model ${modelId} failed:`, lastError)
    }
  }

  return NextResponse.json(
    { success: false, error: 'No se pudo analizar las imágenes. Intenta de nuevo.' },
    { status: 500 }
  )
}
