import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

export const getMonthName = (month: number) => {
  const date = new Date()
  date.setDate(1)
  date.setMonth(month)

  return format(date, 'MMM', { locale: enUS })
}
