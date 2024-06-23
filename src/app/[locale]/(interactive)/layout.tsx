import Header from '@/components/header/header-server'

export default function LocaleLayout({ children, params: { locale } }) {
  return (
    <div>
      <Header locale={locale}>{children}</Header>
    </div>
  )
}
