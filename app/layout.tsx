// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Bebas_Neue, Poppins } from 'next/font/google'
import Header from './components/Header';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap'
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: 'Landing Page',
  description: 'Built with Next.js and WordPress',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <body><Header />{children}</body>
    </html>
  )
}