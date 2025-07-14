import type { Metadata } from 'next'
import './globals.css'
import '@/styles/matrix.css'

export const metadata: Metadata = {
  title: 'Splitwise',
  description: 'Build By Ujjwal Sinha',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
