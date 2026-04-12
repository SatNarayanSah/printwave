import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cartContext'
import { AuthProvider } from '@/lib/authContext'
import { ThreeBackground } from '@/components/three-background'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Printwave - Print On Demand',
  description: 'Custom print-on-demand products for your business. T-shirts, mugs, posters, and more with high-quality printing.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThreeBackground />
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
