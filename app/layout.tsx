import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'DiscoveryOS - Product Intelligence',
  description: 'AI-powered Product Discovery & User Research Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
