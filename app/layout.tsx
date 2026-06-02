import type { Metadata } from 'next'
import './globals.css'
import brand from '@/lib/brand'

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: `Staff compliance training powered by ${brand.company}.`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a18] text-white">
        {children}
      </body>
    </html>
  )
}
