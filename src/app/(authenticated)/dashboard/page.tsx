import {
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiTrendingUp,
} from 'react-icons/fi';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold text-purple-800'>
        Khronos Dashboard
      </h1>

      {/* Quick stats */}
      <div className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-indigo-500 rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Content
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900'>
                      24
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Scheduled Posts
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900'>
                      8
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-500 rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Avg. Engagement
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900'>
                      12.4%
                    </div>
                    <span className='ml-2 text-sm font-medium text-green-600'>
                      +2.3%
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 rounded-md p-3'>
                <FiTrendingUp className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Content Ideas
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900'>
                      16
                    </div>
                    <span className='ml-2 text-sm font-medium text-blue-600'>
                      AI Generated
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content sections */}
      <div className='mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* Upcoming content */}
        <div className='bg-white shadow rounded-lg'>
          <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Upcoming Content
            </h3>
          </div>
          <ul className='divide-y divide-gray-200'>
            {[1, 2, 3].map((item: number) => (
              <li key={item} className='px-4 py-4 sm:px-6 hover:bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                      <FiFileText className='h-5 w-5 text-indigo-600' />
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-indigo-600'>
                        Marketing Strategy Blog Post {item}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Scheduled for May {20 + item}, 2025
                      </div>
                    </div>
                  </div>
                  <div className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
                    Scheduled
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className='px-4 py-4 border-t border-gray-200 sm:px-6'>
            <Link
              href='/dashboard/calendar'
              className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
            >
              View full calendar
            </Link>
          </div>
        </div>

        {/* AI Content Suggestions */}
        <div className='bg-white shadow rounded-lg'>
          <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              AI Content Suggestions
            </h3>
          </div>
          <ul className='divide-y divide-gray-200'>
            {[1, 2, 3].map((item: number) => (
              <li key={item} className='px-4 py-4 sm:px-6 hover:bg-gray-50'>
                <div>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center'>
                      <FiMessageSquare className='h-5 w-5 text-purple-600' />
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-purple-600'>
                        Top {7 - item} AI Tools for Content Creators in 2025
                      </div>
                      <div className='mt-1 text-sm text-gray-500 flex items-center'>
                        <span className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 mr-2'>
                          Trending Topic
                        </span>
                        <span>Recommended for next week</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 flex'>
                    <button className='mr-2 bg-white hover:bg-gray-50 text-purple-700 font-semibold py-1 px-3 border border-purple-500 rounded text-sm'>
                      Create Content
                    </button>
                    <button className='bg-white hover:bg-gray-50 text-gray-500 font-semibold py-1 px-3 border border-gray-300 rounded text-sm'>
                      Save Idea
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className='px-4 py-4 border-t border-gray-200 sm:px-6'>
            <Link
              href='/dashboard/ai-chat'
              className='text-sm font-medium text-purple-600 hover:text-purple-500'
            >
              Generate more ideas with AI
            </Link>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className='mt-6'>
        <h2 className='text-lg font-medium text-gray-900'>Quick Access</h2>
        <div className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          <Link
            href='/dashboard/content/new'
            className='bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-indigo-500 rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Create Content
                </h3>
                <p className='text-sm text-gray-500'>
                  Add new content to your calendar
                </p>
              </div>
            </div>
          </Link>

          <Link
            href='/dashboard/calendar'
            className='bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  View Calendar
                </h3>
                <p className='text-sm text-gray-500'>
                  Manage your content schedule
                </p>
              </div>
            </div>
          </Link>

          <Link
            href='/dashboard/ai-chat'
            className='bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-500 rounded-md p-3'>
                <FiMessageSquare className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900'>AI Chat</h3>
                <p className='text-sm text-gray-500'>
                  Get content ideas and assistance
                </p>
              </div>
            </div>
          </Link>

          <Link
            href='/dashboard/analytics'
            className='bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900'>Analytics</h3>
                <p className='text-sm text-gray-500'>
                  Track content performance
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
