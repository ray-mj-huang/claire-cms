import { format } from 'date-fns'

export const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
} 