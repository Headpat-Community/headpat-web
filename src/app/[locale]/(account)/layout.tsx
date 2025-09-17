import { createSessionServerClient } from "@/app/appwrite-session"
import { redirect } from "next/navigation"

export default async function Layout(props: { children: React.ReactNode }) {
  const { account } = await createSessionServerClient()
  try {
    await account.get()
    return props.children
  } catch (error: any) {
    if (error?.type === "general_unauthorized_scope") {
      redirect("/login")
    } else {
      redirect("/login/mfa")
    }
  }
}
