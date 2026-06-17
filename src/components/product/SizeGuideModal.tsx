'use client';

import { Modal } from '@/components/ui/Modal';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'S', chest: '88-96', waist: '76-82', length: '66-68' },
  { size: 'M', chest: '96-104', waist: '82-88', length: '68-70' },
  { size: 'L', chest: '104-112', waist: '88-96', length: '70-72' },
  { size: 'XL', chest: '112-120', waist: '96-104', length: '72-74' },
  { size: 'XXL', chest: '120-128', waist: '104-112', length: '74-76' },
];

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Guide des tailles">
      <p className="text-sm text-gray-600 mb-4">
        Mesures en centimètres. Si vous hésitez entre deux tailles, choisissez la plus grande.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-xs text-gray-500">Taille</th>
              <th className="text-left py-2 font-medium text-xs text-gray-500">Poitrine</th>
              <th className="text-left py-2 font-medium text-xs text-gray-500">Taille</th>
              <th className="text-left py-2 font-medium text-xs text-gray-500">Longueur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SIZE_CHART.map((row) => (
              <tr key={row.size}>
                <td className="py-2 font-medium">{row.size}</td>
                <td className="py-2 text-gray-600">{row.chest}</td>
                <td className="py-2 text-gray-600">{row.waist}</td>
                <td className="py-2 text-gray-600">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
