const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return isNaN(date) ? '—' : dateFormatter.format(date)
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return isNaN(date) ? '—' : dateTimeFormatter.format(date)
}
