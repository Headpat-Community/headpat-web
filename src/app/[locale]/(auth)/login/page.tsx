import Client from "./page.client"

export const metadata = {
  title: "Login",
  description: "Login or Register to your account.",
  keywords: "login, account, sign in, register",
}

export default async function LoginPage() {
  return (
    <>
      <Client />
    </>
  )
}
