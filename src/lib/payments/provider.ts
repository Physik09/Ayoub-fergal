import { MockPaymentProvider } from './mock';
import { CMIProvider } from './cmi';
import type { PaymentProvider } from './index';

const PAYMENT_PROVIDERS: Record<string, PaymentProvider> = {
  mock: new MockPaymentProvider(),
  cmi: new CMIProvider(),
};

export function getPaymentProvider(name: string = 'mock'): PaymentProvider {
  const provider = PAYMENT_PROVIDERS[name];
  if (!provider) {
    console.warn(`Payment provider "${name}" not found, falling back to mock`);
    return PAYMENT_PROVIDERS.mock;
  }
  return provider;
}

export { MockPaymentProvider } from './mock';
export { CMIProvider } from './cmi';
