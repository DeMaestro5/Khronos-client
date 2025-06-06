import Navbar from '../../components/layout/NavBar';
import Sidebar from '../../components/layout/SideBar';
import { CalendarProvider } from '../../context/CalendarContext';
import { ConfettiProvider } from '../../context/ConfettiContext';
import { ContentCreationProvider } from '../../context/ContentCreationContext';
import GlobalCreationIndicator from '../../components/ui/global-creation-indicator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfettiProvider>
      <ContentCreationProvider>
        <CalendarProvider>
          <div className='h-screen flex overflow-hidden bg-gray-50 w-full'>
            <Sidebar />

            <div className='flex flex-col w-0 flex-1 overflow-hidden '>
              <Navbar />

              <main className='flex-1 relative overflow-y-auto focus:outline-none '>
                {children}
              </main>
            </div>
          </div>
          <GlobalCreationIndicator />
        </CalendarProvider>
      </ContentCreationProvider>
    </ConfettiProvider>
  );
}
