import Button from './Button'

function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
