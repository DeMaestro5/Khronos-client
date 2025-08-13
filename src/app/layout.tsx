import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '@/src/context/NotificationContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { UserDataProvider } from '@/src/context/UserDataContext';
import { ThemeProvider } from '@/src/components/themeProvider';
import { ConfettiProvider } from '@/src/context/ConfettiContext'; // Add this import
import './globals.css';
import { SettingsProvider } from '../context/SettingsContext';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} bg-bg-primary text-text-primary theme-transition`}
      >
        <ThemeProvider>
          <AuthProvider>
            <UserDataProvider>
              <SettingsProvider>
                <NotificationProvider>
                  <ConfettiProvider>
                    {children}
                    <Toaster
                      position='top-center'
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--toast-bg)',
                          color: 'var(--toast-text)',
                          border: '1px solid var(--toast-border)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          maxWidth: '400px',
                          minWidth: '280px',
                          boxShadow:
                            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        },
                        success: {
                          duration: 5000,
                          iconTheme: {
                            primary: '#10b981',
                            secondary: 'var(--toast-text)',
                          },
                          style: {
                            background: 'var(--toast-bg)',
                            color: 'var(--toast-text)',
                            border: '1px solid var(--toast-border)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            maxWidth: '400px',
                            minWidth: '280px',
                            boxShadow:
                              '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
                          },
                        },
                        loading: {
                          duration: Infinity,
                        },
                      }}
                    />
                  </ConfettiProvider>
                </NotificationProvider>
              </SettingsProvider>
            </UserDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
