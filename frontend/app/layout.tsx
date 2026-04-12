import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cartContext'
import { AuthProvider } from '@/lib/authContext'
import { SiteChrome } from '@/components/site-chrome'
import './globals.css'

export const metadata: Metadata = {
  title: 'Persomith - Print On Demand',
  description: 'Custom print-on-demand products for your business. T-shirts, mugs, posters, and more with high-quality printing.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
        <AuthProvider>
          <CartProvider>
            <SiteChrome>
              {children}
            </SiteChrome>
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
