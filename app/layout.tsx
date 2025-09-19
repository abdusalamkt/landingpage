// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Bebas_Neue, Poppins } from 'next/font/google';
import Header from './components/Header';
import PageTransition from './components/PageTransition';
import SmoothScroll from './components/SmoothScroll'; 
import Footer from './components/Footer';
import ButtonToTop from './components/ButtonToTop';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'GFI UAE',
  description: 'Leaders in Space Management Solutions',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <head>
        <script src="https://cdn.weglot.com/weglot.min.js"></script>
        {/* ✅ Weglot initialization*/}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              Weglot.initialize({
                api_key: "wg_a36b2435d66010382216734bfbed933e2"
              });
            `,
          }}
        />
      </head>
      <body>
        <SmoothScroll /> 
        <Header />
        {children}
        <Footer />
        <ButtonToTop />
      </body>
    </html>
  );
}
