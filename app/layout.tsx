// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Bebas_Neue, Poppins } from 'next/font/google';
import Header from './components/Header';
import PageTransition from './components/PageTransition';
import SmoothScroll from './components/SmoothScroll'; 
import Footer from './components/Footer';
import ButtonToTop from './components/ButtonToTop';
// import BackButton from './components/BackButton';


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
  viewport: 'width=device-width, initial-scale=1', // ✅ VERY IMPORTANT
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <body>
        <SmoothScroll /> 
        <Header />
        {/* <BackButton /> */}
        {/* <PageTransition /> */}
        {children}
        <Footer />
        <ButtonToTop />
      </body>
    </html>
  );
}
