import { notFound } from 'next/navigation'
import { locales } from '@/navigation'

export default async function LocaleLayout({ children, params: { locale } }) {
  return children
}
