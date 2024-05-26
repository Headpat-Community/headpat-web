import Header from '@/components/header/header-server'

export default function LocaleLayout({ children }) {
  return (
    <div>
      <Header>{children}</Header>
    </div>
  )
}
