'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const { initFromStorage } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Shine Native - Find Your Next Chapter. Smartly.</title>
        <meta name="description" content="AI-powered property search and virtual tours across India. Shine Native." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <AIChat />
      </body>
    </html>
  );
}
