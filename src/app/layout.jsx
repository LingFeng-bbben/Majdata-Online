/* eslint-disable react/prop-types */
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata= {
  title: 'Majdata Online',
  description: 'Majdata Online is a place to share maimai fanmade charts',
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
