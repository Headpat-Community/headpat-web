import Client from './page.client'

export const metadata = {
  title: 'Login',
  description: 'Hier kannst du dich anmelden für die Headpat Community',
  url: 'https://headpat.de/login',
  keywords: 'login, account, sign in, anmelden',
}

export const runtime = 'edge'

export default async function LoginPage () {

  return (
    <>
      <Client/>
    </>
  )
}
