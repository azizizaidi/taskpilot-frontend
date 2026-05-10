import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-bold text-blue-600">TaskPilot</span>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
