'use client';

import { Input } from '@/components/ui/Input';

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  value: CustomerFormData;
  onChange: (data: CustomerFormData) => void;
}

export function CustomerForm({ value, onChange }: CustomerFormProps) {
  return (
    <div className="border border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Vos informations
      </h2>
      <div className="space-y-4">
        <Input
          label="Nom complet"
          required
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
        <Input
          label="Téléphone"
          type="tel"
          required
          placeholder="06 XX XX XX XX"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
        <Input
          label="Email (optionnel)"
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </div>
    </div>
  );
}
