import Navbar from '../../components/layout/NavBar';
import Sidebar from '../../components/layout/SideBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex overflow-hidden bg-gray-50 w-full'>
      <Sidebar />

      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <Navbar />

        <main className='flex-1 relative overflow-y-auto focus:outline-none'>
          <div className='py-6'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
