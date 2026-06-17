'use client';

interface PaymentSelectorProps {
  value: 'COD' | 'ONLINE';
  onChange: (method: 'COD' | 'ONLINE') => void;
}

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div className="border border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Moyen de paiement
      </h2>
      <div className="space-y-3">
        <label
          className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
            value === 'COD'
              ? 'border-brand-gold bg-brand-gold/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={value === 'COD'}
            onChange={() => onChange('COD')}
            className="mt-0.5 accent-brand-gold"
          />
          <div>
            <p className="text-sm font-medium">Paiement à la livraison (COD)</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Payez en espèces à la réception de votre commande.
            </p>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
            value === 'ONLINE'
              ? 'border-brand-gold bg-brand-gold/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={value === 'ONLINE'}
            onChange={() => onChange('ONLINE')}
            className="mt-0.5 accent-brand-gold"
          />
          <div>
            <p className="text-sm font-medium">Payer en ligne (Carte bancaire)</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Payez par carte bancaire en ligne (CB/CMI).
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
