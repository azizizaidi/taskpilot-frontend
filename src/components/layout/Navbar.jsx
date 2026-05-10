function Navbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Welcome</span>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
          U
        </div>
      </div>
    </header>
  )
}

export default Navbar
