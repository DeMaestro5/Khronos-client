import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KHRONOS - AI-Powered Content Calendar',
  description:
    'Plan, create, and analyze your content with AI assistance. The ultimate content management platform.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Toaster
          position='top-center'
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #475569',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              maxWidth: '500px',
            },
            success: {
              duration: 5000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#f1f5f9',
              },
            },
            loading: {
              duration: Infinity,
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#f1f5f9',
              },
            },
            error: {
              duration: 6000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f1f5f9',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
