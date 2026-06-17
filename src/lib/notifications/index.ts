import { sendEmail, orderConfirmationEmail, shippingUpdateEmail } from './email';
import { sendSMS, orderConfirmationSMS, shippingUpdateSMS } from './sms';

type Order = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  total: number;
};

export async function notifyOrderConfirmed(order: Order) {
  const results: { email?: boolean; sms?: boolean } = {};

  if (order.customerEmail) {
    const emailData = orderConfirmationEmail(order);
    const emailRes = await sendEmail(emailData);
    results.email = emailRes.success;
  }

  const smsData = orderConfirmationSMS(order);
  const smsRes = await sendSMS(smsData);
  results.sms = smsRes.success;

  return results;
}

export async function notifyOrderShipped(order: Order) {
  const results: { email?: boolean; sms?: boolean } = {};

  if (order.customerEmail) {
    const emailData = shippingUpdateEmail(order);
    const emailRes = await sendEmail(emailData);
    results.email = emailRes.success;
  }

  const smsData = shippingUpdateSMS(order);
  const smsRes = await sendSMS(smsData);
  results.sms = smsRes.success;

  return results;
}
