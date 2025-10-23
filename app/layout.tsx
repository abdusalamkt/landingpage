// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Bebas_Neue, Poppins } from 'next/font/google';
import Header from './components/Header';
import PageTransition from './components/PageTransition';
import SmoothScroll from './components/SmoothScroll'; 
import Footer from './components/Footer';
import ButtonToTop from './components/ButtonToTop';
import { Float } from '@react-three/drei';
import FloatingSidebar from './components/FloatingSidebar';
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/favicon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/icons/favicon.png',
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <body>
        <SmoothScroll /> 
        <Header />
        <FloatingSidebar />
        {/* <PageTransition /> */}
        {children}
        <SpeedInsights />
        <Footer />
        <ButtonToTop />
      </body>
    </html>
  );
}
