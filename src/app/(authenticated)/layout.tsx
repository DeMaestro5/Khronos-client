'use client';

import Navbar from '../../components/layout/NavBar';
import Sidebar from '../../components/layout/SideBar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
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
              <div className='h-screen flex overflow-hidden bg-theme-secondary w-full transition-colors duration-200'>
                <Sidebar />

                <div className='flex flex-col w-full md:w-0 md:flex-1 overflow-hidden'>
                  <Navbar />

                  <main className='flex-1 relative overflow-y-auto focus:outline-none bg-theme-primary transition-colors duration-200 pb-16 md:pb-0'>
                    {children}
                  </main>
                </div>
              </div>
              <MobileBottomNav />
              <GlobalCreationIndicator />
              <AIChatModal />
            </CalendarProvider>
          </AIChatProvider>
        </ContentCreationProvider>
      </ConfettiProvider>
    </AuthGuard>
  );
}
