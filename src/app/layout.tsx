import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '@/src/context/NotificationContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { UserDataProvider } from '@/src/context/UserDataContext';
import { ThemeProvider } from '@/src/components/themeProvider';
import { ConfettiProvider } from '@/src/context/ConfettiContext'; // Add this import
import './globals.css';
import { SettingsProvider } from '../context/SettingsContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
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
                          padding: '16px',
                          fontSize: '14px',
                          maxWidth: '500px',
                        },
                        success: {
                          duration: 5000,
                          iconTheme: {
                            primary: '#10b981',
                            secondary: 'var(--toast-text)',
                          },
                        },
                        loading: {
                          duration: Infinity, // This ensures loading toasts persist
                          iconTheme: {
                            primary: '#8b5cf6',
                            secondary: 'var(--toast-text)',
                          },
                        },
                        error: {
                          duration: 6000,
                          iconTheme: {
                            primary: '#ef4444',
                            secondary: 'var(--toast-text)',
                          },
                        },
                      }}
                    />
                  </ConfettiProvider>{' '}
                </NotificationProvider>
              </SettingsProvider>
            </UserDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
