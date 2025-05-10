import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  DocumentTextIcon, 
  Cog6ToothIcon,
  ChartBarIcon,
  PencilSquareIcon,
  GlobeAltIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavigationItem[] = [
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon }
]

const AdminLayout = (): React.ReactElement => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 側邊欄 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link to="/admin" className="text-xl font-bold text-gray-900">
            Admin
          </Link>
        </div>

        {/* New Post Button */}
        <div className="px-3 mt-2">
          <Link
            to="/admin/posts/new"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
          >
            <PencilSquareIcon
              className="mr-3 h-6 w-6 flex-shrink-0"
              aria-hidden="true"
            />
            New Post
          </Link>
        </div>

        {/* 分隔線 */}
        <div className="mt-2 px-3">
          <hr className="border-gray-200" />
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* View Website Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <GlobeAltIcon
              className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
            View Website
          </a>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="pl-64">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout; 