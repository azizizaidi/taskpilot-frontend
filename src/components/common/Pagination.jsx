import Button from './Button'

function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <Button
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
