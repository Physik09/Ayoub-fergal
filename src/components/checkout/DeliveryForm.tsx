'use client';

import { MOROCCAN_CITIES } from '@/lib/constants';
import { Select } from '@/components/ui/Select';

interface DeliveryFormData {
  city: string;
  address: string;
}

interface DeliveryFormProps {
  value: DeliveryFormData;
  onChange: (data: DeliveryFormData) => void;
}

export function DeliveryForm({ value, onChange }: DeliveryFormProps) {
  return (
    <div className="border border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Adresse de livraison
      </h2>
      <div className="space-y-4">
        <Select
          label="Ville"
          required
          placeholder="Sélectionnez une ville"
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          options={MOROCCAN_CITIES.map((c) => ({ value: c, label: c }))}
        />
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Adresse complète <span className="text-red-500">*</span>
          </label>
          <textarea
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            required
            rows={3}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none"
            placeholder="Rue, quartier, immeuble, étage..."
          />
        </div>
      </div>
    </div>
  );
}
