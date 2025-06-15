'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '@/src/context/NotificationContext';
import { AuthProvider } from '@/src/context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
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
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
