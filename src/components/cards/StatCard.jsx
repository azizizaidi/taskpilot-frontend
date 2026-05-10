function StatCard({ label, value, sub = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {sub.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {sub.map((item) => (
            <span key={item.label} className="text-xs text-gray-400">
              {item.label}:{' '}
              <span className="text-gray-600 font-medium">{item.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatCard
