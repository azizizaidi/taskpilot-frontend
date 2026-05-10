import { Outlet, NavLink } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAuth from '../../hooks/useAuth'

const baseNavItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' },
]

function DashboardLayout() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const navItems = isAdmin
    ? [...baseNavItems, { label: 'Users', to: '/users' }, { label: 'Activity Logs', to: '/activity-logs' }]
    : baseNavItems

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <nav className="md:hidden bg-white border-b border-gray-200 flex overflow-x-auto flex-shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
