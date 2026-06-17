import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://ayoubfergal.com';

export const metadata: Metadata = {
  title: {
    default: 'Ayoub Fergal — Vêtements Homme Maroc',
    template: '%s | Ayoub Fergal',
  },
  description: 'Vêtements homme premium au Maroc. Streetwear, hoodies, sweatpants, t-shirts et accessoires. Livraison partout au Maroc.',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: {
      fr: '/fr',
      ar: '/ar',
    },
  },
  openGraph: {
    title: 'Ayoub Fergal — Vêtements Homme',
    description: 'Vêtements homme premium au Maroc. Streetwear, hoodies, sweatpants, t-shirts et accessoires.',
    url: BASE_URL,
    siteName: 'Ayoub Fergal',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
