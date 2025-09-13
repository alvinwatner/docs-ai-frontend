import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Hotjar } from '@/components/analytics';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Docko - Document Automation',
  description: 'Automate document generation using familiar DOCX templates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth0Provider>
          {children}
        </Auth0Provider>
        <Hotjar />
      </body>
    </html>
  );
}
