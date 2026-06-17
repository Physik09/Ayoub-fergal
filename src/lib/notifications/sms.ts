interface SMSData {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SMSData): Promise<{ success: boolean; id?: string }> {
  const provider = process.env.SMS_PROVIDER;

  if (provider === 'twilio' && process.env.SMS_API_KEY) {
    return sendViaTwilio({ to, message });
  }

  return sendMockSMS({ to, message });
}

async function sendViaTwilio({ to, message }: SMSData) {
  const accountSid = process.env.SMS_API_KEY;
  const authToken = process.env.SMS_SENDER;
  const from = process.env.SMS_FROM || 'AyoubFergal';

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: message,
      }),
    }
  );

  if (!res.ok) {
    console.error('[Twilio] Failed:', await res.text());
    return { success: false };
  }

  const data = await res.json();
  return { success: true, id: data.sid };
}

async function sendMockSMS({ to, message }: SMSData): Promise<{ success: boolean; id?: string }> {
  console.log('--- [Mock SMS] ---');
  console.log('To:', to);
  console.log('Message:', message);
  console.log('---');
  return { success: true, id: `mock-${Date.now()}` };
}

export function orderConfirmationSMS(order: {
  orderNumber: string;
  customerPhone: string;
}): SMSData {
  return {
    to: order.customerPhone,
    message: `Ayoub Fergal: Votre commande ${order.orderNumber} est confirmée. Merci pour votre achat !`,
  };
}

export function shippingUpdateSMS(order: {
  orderNumber: string;
  customerPhone: string;
}): SMSData {
  return {
    to: order.customerPhone,
    message: `Ayoub Fergal: Votre commande ${order.orderNumber} a été expédiée. Livraison sous 2-7 jours.`,
  };
}
