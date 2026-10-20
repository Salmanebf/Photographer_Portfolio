import { Archivo, Geist, Geist_Mono } from 'next/font/google'

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

/** Display face for the hero headline (wide, heavy). Only the weights/width the hero uses. */
export const archivo = Archivo({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
})
