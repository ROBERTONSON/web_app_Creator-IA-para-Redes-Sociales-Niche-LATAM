import { type NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

// Fallback order — sdxl-lightning handles no-text instruction better than flux
const MODELS = [
  '@cf/bytedance/stable-diffusion-xl-lightning',
  '@cf/black-forest-labs/flux-1-schnell',
  '@cf/stabilityai/stable-diffusion-xl-base-1.0',
]

// Strong composition and style suffix for advertisement-quality images
const NEGATIVE_SUFFIX = ', dramatic cinematic lighting with strong directional shadows, dynamic camera angle, bold color contrast, deep depth of field, advertisement composition with clear visual hierarchy, aspirational mood, professional commercial photography quality, hero shot style. Absolutely no text, no words, no letters, no numbers, no digits, no typography, no captions, no watermarks, no logos, no signs, no labels, no banners, no overlaid graphics, no speech bubbles, no price tags, no discount signs. Pure photographic image only, completely text-free.'

async function translatePromptToEnglish(spanishPrompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return spanishPrompt

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent(
      `Translate this image generation prompt from Spanish to English. Return ONLY the translated prompt, no explanations, no quotes:\n\n${spanishPrompt}`
    )
    const translated = result.response.text().trim()
    return translated || spanishPrompt
  } catch {
    // If translation fails, use original prompt
    return spanishPrompt
  }
}

async function tryModel(model: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, num_steps: 4 }),
      signal: AbortSignal.timeout(60_000),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Model ${model} failed: ${res.status} ${text}`)
  }

  const contentType = res.headers.get('content-type') ?? ''

  if (contentType.includes('image/')) {
    const buffer = await res.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  }

  const json = await res.json() as {
    result?: { image?: string }
    success?: boolean
    errors?: unknown[]
  }

  if (!json.success || !json.result?.image) {
    throw new Error(`Model ${model} returned no image: ${JSON.stringify(json.errors)}`)
  }

  return json.result.image
}

export async function POST(request: NextRequest) {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return NextResponse.json(
      { success: false, error: 'Cloudflare credentials not configured' },
      { status: 500 }
    )
  }

  let body: { prompt?: string; brandContext?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const prompt = body.prompt?.trim()
  if (!prompt) {
    return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
  }

  // Combine prompt with brand context if available
  const brandContext = body.brandContext?.trim()
  const combinedPrompt = brandContext
    ? `${prompt} Brand identity context: ${brandContext}`
    : prompt

  // Translate to English for better image quality, then add strong negative suffix
  const translatedPrompt = await translatePromptToEnglish(combinedPrompt)
  const finalPrompt = translatedPrompt + NEGATIVE_SUFFIX

  let lastError = ''

  for (const model of MODELS) {
    try {
      const base64 = await tryModel(model, finalPrompt)
      const usedModel = model.split('/').pop() ?? model

      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${base64}`,
        model: usedModel,
      })
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.error(`Image generation failed for ${model}:`, lastError)
    }
  }

  return NextResponse.json(
    { success: false, error: 'No se pudo generar la imagen. Intenta de nuevo en unos momentos.' },
    { status: 500 }
  )
}
