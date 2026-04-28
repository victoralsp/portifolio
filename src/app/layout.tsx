import type { Metadata } from 'next'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Victor Pinheiro — Desenvolvedor Frontend',
  description: 'Portfólio de Victor Pinheiro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
