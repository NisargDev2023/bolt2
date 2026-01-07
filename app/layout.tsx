import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import ClientInstallListener from './listnerhook';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Add to Home Screen App',
  description: 'Next.js PWA with Add to Home Screen functionality',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'A2H App',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ClientInstallListener />
        {children}
      </body>
    </html>
  );
}