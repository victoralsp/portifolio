import type { Metadata } from 'next'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Victor Alves — Desenvolvedor Frontend',
  description: 'Portifólio',
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
