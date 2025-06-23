'use client';

import Navbar from '../../components/layout/NavBar';
import Sidebar from '../../components/layout/SideBar';
import { CalendarProvider } from '../../context/CalendarContext';
import { ConfettiProvider } from '../../context/ConfettiContext';
import { ContentCreationProvider } from '../../context/ContentCreationContext';
import { AIChatProvider } from '../../context/AIChatContext';
import GlobalCreationIndicator from '../../components/ui/global-creation-indicator';
import AIChatModal from '../../components/ai/ai-chat-modal';
import AuthGuard from '../../components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ConfettiProvider>
        <ContentCreationProvider>
          <AIChatProvider>
            <CalendarProvider>
              <div className='h-screen flex overflow-hidden bg-gray-50 dark:bg-slate-950 w-full transition-colors duration-200'>
                <Sidebar />

                <div className='flex flex-col w-0 flex-1 overflow-hidden'>
                  <Navbar />

                  <main className='flex-1 relative overflow-y-auto focus:outline-none bg-white dark:bg-slate-900 transition-colors duration-200'>
                    {children}
                  </main>
                </div>
              </div>
              <GlobalCreationIndicator />
              <AIChatModal />
            </CalendarProvider>
          </AIChatProvider>
        </ContentCreationProvider>
      </ConfettiProvider>
    </AuthGuard>
  );
}
