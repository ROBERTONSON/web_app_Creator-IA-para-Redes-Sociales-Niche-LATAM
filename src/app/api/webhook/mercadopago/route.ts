import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  let body: { type?: string; data?: { id?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Only process payment notifications
  if (body.type !== 'payment' || !body.data?.id) {
    return NextResponse.json({ ok: true })
  }

  // Fetch payment details from MP
  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  })

  if (!paymentRes.ok) {
    return NextResponse.json({ error: 'Could not fetch payment' }, { status: 500 })
  }

  const payment = await paymentRes.json()

  if (payment.status === 'approved') {
    const userId = payment.external_reference ?? payment.metadata?.user_id
    if (!userId) {
      return NextResponse.json({ error: 'No user_id in payment' }, { status: 400 })
    }

    const supabase = await createClient()
    await supabase.rpc('upgrade_to_premium', {
      p_user_id: userId,
      p_payment_id: String(body.data.id),
    })
  }

  return NextResponse.json({ ok: true })
}
