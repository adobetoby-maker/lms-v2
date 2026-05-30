import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LMS — Learning Management System',
  description: 'Complete your training courses and track your progress.',
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
