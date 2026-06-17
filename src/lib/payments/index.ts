export interface PaymentProvider {
  name: string;
  processPayment(order: PaymentOrder): Promise<PaymentResult>;
  verifyPayment(reference: string): Promise<PaymentResult>;
}

export interface PaymentOrder {
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  redirectUrl?: string;
  reference?: string;
  error?: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export const CURRENCY = 'MAD';
