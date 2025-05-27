import Client from './page.client'

export const metadata = {
  title: 'Forgot password?',
  description: "Don't remember your password? Reset it here!",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/forgot-password`,
    languages: {
      en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/forgot-password`,
      de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/forgot-password`,
      nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/forgot-password`
    }
  }
}

export default async function Page() {
  return <Client />
}
