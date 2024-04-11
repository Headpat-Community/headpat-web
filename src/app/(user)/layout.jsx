import Header from '../../components/header/header-server'
import Footer from '../../components/footer'

export default function LocaleLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
