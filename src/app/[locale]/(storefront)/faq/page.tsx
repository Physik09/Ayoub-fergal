import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ';
  return { title };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ';
  const faqs =
    locale === 'ar'
      ? [
          { q: 'ما هي مدة التوصيل؟', a: 'تتراوح المدة بين 2 و 7 أيام عمل حسب مدينتك.' },
          { q: 'هل يمكنني إرجاع منتج؟', a: 'نعم، لديك 14 يومًا لإرجاع المنتج من تاريخ الاستلام.' },
          { q: 'كيف أتتبع طلبي؟', a: 'استخدم صفحة تتبع الطلب مع رقم الطلب وهاتفك.' },
          { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل الدفع عند الاستلام (COD) والدفع عبر الإنترنت ببطاقة بنكية.' },
          { q: 'هل تتوفر خدمة التوصيل إلى كل المغرب؟', a: 'نعم، نوصل إلى جميع المدن المغربية.' },
        ]
      : [
          { q: 'Quels sont les délais de livraison ?', a: 'Les délais varient de 2 à 7 jours ouvrés selon votre ville.' },
          { q: 'Puis-je retourner un article ?', a: 'Oui, vous disposez de 14 jours pour retourner un article à compter de la réception.' },
          { q: 'Comment suivre ma commande ?', a: 'Utilisez notre page de suivi avec votre numéro de commande et téléphone.' },
          { q: 'Quels modes de paiement acceptez-vous ?', a: 'Nous acceptons le paiement à la livraison (COD) et le paiement en ligne par carte bancaire.' },
          { q: 'Livrez-vous dans tout le Maroc ?', a: 'Oui, nous livrons dans toutes les villes du Maroc.' },
        ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{title}</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
