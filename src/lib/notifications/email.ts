interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData): Promise<{ success: boolean; id?: string }> {
  const provider = process.env.EMAIL_PROVIDER;

  if (provider === 'resend' && process.env.EMAIL_API_KEY) {
    return sendViaResend({ to, subject, html });
  }

  return sendMockEmail({ to, subject, html });
}

async function sendViaResend({ to, subject, html }: EmailData) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'noreply@ayoubfergal.com',
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Resend] Failed:', err);
    return { success: false };
  }

  const data = await res.json();
  return { success: true, id: data.id };
}

async function sendMockEmail({ to, subject }: EmailData): Promise<{ success: boolean; id?: string }> {
  console.log('--- [Mock Email] ---');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('---');
  return { success: true, id: `mock-${Date.now()}` };
}

export function orderConfirmationEmail(order: {
  orderNumber: string;
  customerEmail?: string | null;
  customerName: string;
  total: number;
}): EmailData {
  return {
    to: order.customerEmail || '',
    subject: `Confirmation de commande ${order.orderNumber} — Ayoub Fergal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A0A0A; font-size: 24px;">Merci pour votre commande !</h1>
        <p>Bonjour ${order.customerName},</p>
        <p>Votre commande <strong>${order.orderNumber}</strong> a été confirmée.</p>
        <p>Montant total : <strong>${order.total.toLocaleString('fr-FR')} DH</strong></p>
        <p>Nous vous tiendrons informé de son expédition.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Ayoub Fergal — Vêtements homme Maroc</p>
      </div>
    `,
  };
}

export function shippingUpdateEmail(order: {
  orderNumber: string;
  customerEmail?: string | null;
  customerName: string;
}): EmailData {
  return {
    to: order.customerEmail || '',
    subject: `Votre commande ${order.orderNumber} a été expédiée — Ayoub Fergal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A0A0A; font-size: 24px;">Votre commande est en route !</h1>
        <p>Bonjour ${order.customerName},</p>
        <p>Votre commande <strong>${order.orderNumber}</strong> a été expédiée.</p>
        <p>Vous recevrez votre colis sous 2 à 7 jours ouvrés.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Ayoub Fergal — Vêtements homme Maroc</p>
      </div>
    `,
  };
}
