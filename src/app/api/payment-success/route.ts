import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  // Verify user session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: { paymentId?: string; collectionId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const paymentId = body.paymentId ?? body.collectionId
  if (!paymentId) {
    return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
  }

  // Verify payment status directly with MP API
  if (MP_ACCESS_TOKEN) {
    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      })
      if (mpRes.ok) {
        const payment = await mpRes.json()
        // Only upgrade if payment is actually approved and belongs to this user
        if (
          payment.status === 'approved' &&
          (payment.external_reference === user.id || payment.metadata?.user_id === user.id)
        ) {
          await supabase.rpc('upgrade_to_premium', {
            p_user_id: user.id,
            p_payment_id: String(paymentId),
          })
          return NextResponse.json({ success: true, upgraded: true })
        }
        return NextResponse.json({ success: false, error: 'Pago no aprobado o no pertenece a este usuario' })
      }
    } catch (err) {
      console.error('Error verifying payment with MP:', err)
    }
  }

  // Fallback: trust the redirect (only if MP API call failed)
  await supabase.rpc('upgrade_to_premium', {
    p_user_id: user.id,
    p_payment_id: String(paymentId),
  })
  return NextResponse.json({ success: true, upgraded: true })
}
