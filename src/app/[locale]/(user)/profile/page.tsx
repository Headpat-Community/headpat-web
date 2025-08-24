import { redirect } from "next/navigation"
import { getUserData } from "@/utils/server-api/user/getUserData"

export const dynamic = "auto"

export default async function Profile() {
  const user = await getUserData()

  if (!user?.$id) return redirect("/login")

  redirect(`/user/${user.profileUrl}`)
}
