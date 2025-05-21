import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700'>
      <div className='max-w-3xl mx-auto text-center px-4'>
        <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
          Content Calendar
          <span className='block text-indigo-200'>Powered by AI</span>
        </h1>
        <p className='mt-3 text-base text-indigo-100 sm:mt-5 sm:text-xl'>
          Plan, create, and optimize your content strategy with the help of
          advanced AI tools. Streamline your workflow and improve your content
          performance.
        </p>
        <div className='mt-8 sm:mt-12'>
          <div className='rounded-md shadow'>
            <Link
              href='/dashboard'
              className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10'
            >
              Go to Dashboard
            </Link>
          </div>
          <div className='mt-3'>
            <Link
              href='/login'
              className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
