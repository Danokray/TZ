import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechZ Project',
  description: 'Test project with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* Preload критических ресурсов */}
        <link rel="preload" href="/images/icons/dashbo.png" as="image" />
        <link rel="preload" href="/images/icons/profile.png" as="image" />
        <link rel="preload" href="/images/icons/ord.png" as="image" />
        <link rel="preload" href="/images/icons/pay.png" as="image" />
        <link rel="preload" href="/images/icons/video.png" as="image" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
