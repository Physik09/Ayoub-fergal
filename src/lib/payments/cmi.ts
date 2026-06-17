import type { PaymentProvider, PaymentOrder, PaymentResult } from './index';

async function generateHash(data: Record<string, string>, storeKey: string): Promise<string> {
  const sorted = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join('&');
  const encoder = new TextEncoder();
  const keyData = encoder.encode(storeKey);
  const msgData = encoder.encode(sorted);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export class CMIProvider implements PaymentProvider {
  name = 'cmi';

  async processPayment(order: PaymentOrder): Promise<PaymentResult> {
    const isSandbox = process.env.CMI_SANDBOX !== 'false';
    const storeKey = process.env.CMI_STORE_KEY || 'MOCK_STORE_KEY_2024';
    const clientId = process.env.CMI_CLIENT_ID || 'MOCK_CLIENT';

    await new Promise((r) => setTimeout(r, 300));

    const reference = `CMI-${order.orderNumber}-${Date.now()}`;

    const hash = await generateHash(
      {
        clientId,
        orderId: order.orderNumber,
        amount: order.amount.toFixed(2),
        currency: order.currency,
      },
      storeKey
    );

    const paymentData = {
      clientId,
      orderId: order.orderNumber,
      amount: order.amount.toFixed(2),
      currency: order.currency,
      callbackUrl: `${
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }/api/payments/callback`,
      description: order.description,
      hash,
    };

    console.log(`[CMI] Processing payment for ${order.orderNumber} (${isSandbox ? 'SANDBOX' : 'PRODUCTION'})`);

    const success = Math.random() > 0.15;

    if (success) {
      return {
        success: true,
        redirectUrl: isSandbox
          ? `/paiement/success?reference=${reference}&orderNumber=${order.orderNumber}`
          : `https://cmi.payment-gateway.com/pay?${new URLSearchParams(paymentData)}`,
        reference,
        status: 'PAID',
      };
    }

    return {
      success: false,
      redirectUrl: `/paiement/failed?orderNumber=${order.orderNumber}`,
      error: 'Transaction refusée par la banque',
      status: 'FAILED',
    };
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 200));

    const parts = reference.split('-');
    const orderNumber = parts[1] || 'unknown';

    return {
      success: true,
      reference,
      status: 'PAID',
      redirectUrl: `/commande/${orderNumber}`,
    };
  }
}
