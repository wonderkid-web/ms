import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import {Toaster} from "react-hot-toast"
import './globals.css'

export const metadata: Metadata = {
  title: 'Treaceabily Customers - PT. Mahkota Group, Tbk',
  description: 'The Application to check Tracking Customers PT. Mahkota Group, Tbk',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
        <body>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
