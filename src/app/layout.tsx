import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Victor Pinheiro — Desenvolvedor Frontend',
  description: 'Portfólio de Victor Pinheiro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <p>teste</p>
      </body>
    </html>
  )
}
