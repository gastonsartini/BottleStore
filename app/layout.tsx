import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { MetaPixel } from '@/components/MetaPixel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BottleStore - Botellas de Agua Premium',
  description: 'Descubre nuestra colección de botellas de agua metálicas y plásticas con diseños únicos. Ideal para mantenerte hidratado con estilo.',
  keywords: 'botellas de agua, botellas metálicas, botellas plásticas, hidratación, botellas reutilizables',
  openGraph: {
    title: 'BottleStore - Botellas de Agua Premium',
    description: 'Descubre nuestra colección de botellas de agua metálicas y plásticas con diseños únicos.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID_HERE');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <MetaPixel />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
