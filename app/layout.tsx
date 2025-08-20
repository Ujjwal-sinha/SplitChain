import type { Metadata } from 'next'
import './globals.css'
import '@/styles/matrix.css'
import { CivicAuthProvider } from '@civic/auth-web3/nextjs'
import { WalletProvider } from '@/components/wallet-provider'

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
      <body>
        <CivicAuthProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </CivicAuthProvider>
      </body>
    </html>
  )
}
