import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Mercado Pago no configurado' }, { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  // Create Mercado Pago preference
  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: 'Creator IA LATAM — Plan Premium',
          description: 'Generaciones ilimitadas de contenido e imágenes para redes sociales',
          quantity: 1,
          currency_id: 'CLP',
          unit_price: 5990,
        },
      ],
      back_urls: {
        success: `${siteUrl}/dashboard?payment=success`,
        failure: `${siteUrl}/dashboard?payment=failure`,
        pending: `${siteUrl}/dashboard?payment=pending`,
      },
      // auto_return only works with public HTTPS URLs — skip in local dev
      ...(siteUrl.startsWith('https://') ? { auto_return: 'approved' } : {}),
      notification_url: `${siteUrl}/api/webhook/mercadopago`,
      metadata: { user_id: user.id },
      external_reference: user.id,
    }),
  })

  if (!res.ok) {
    console.error('MP error:', await res.text())
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point })
}
