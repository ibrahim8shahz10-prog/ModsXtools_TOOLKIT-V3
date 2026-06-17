import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MODSxTOOLS — Toolkit Maker',
  description: 'Create your own branded toolkit. Add tools, customize your theme, share your link.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
