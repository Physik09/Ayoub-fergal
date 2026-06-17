import type { PaymentProvider, PaymentOrder, PaymentResult } from './index';

export class MockPaymentProvider implements PaymentProvider {
  name = 'mock';

  async processPayment(order: PaymentOrder): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 500));
    const success = Math.random() > 0.1;
    const reference = `MOCK-${order.orderNumber}-${Date.now()}`;
    if (success) {
      return {
        success: true,
        redirectUrl: `/paiement/success?reference=${reference}&orderNumber=${order.orderNumber}`,
        reference,
        status: 'PAID',
      };
    }
    return {
      success: false,
      redirectUrl: `/paiement/failed?orderNumber=${order.orderNumber}`,
      error: 'Paiement refusé (simulation)',
      status: 'FAILED',
    };
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      reference,
      status: 'PAID',
    };
  }
}
