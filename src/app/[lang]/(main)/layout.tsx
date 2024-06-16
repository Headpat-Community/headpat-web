import Header from '@/components/header/header-server'

export default function LocaleLayout({ children, params: { lang } }) {
  return (
    <div>
      <Header lang={lang}>{children}</Header>
    </div>
  )
}
