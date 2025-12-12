import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import ClientProviders from '@/components/providers/ClientProviders';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VetClinic - Pet Care Management System',
  description: 'Modern veterinary clinic management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}