import { createSessionClient } from "@/app/appwrite-session"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (
    request.headers
      .get("referer")
      ?.includes(process.env.NEXT_PUBLIC_DOMAIN as string)
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { account } = await createSessionClient(request)

  try {
    const user = await account.get()
    return Response.json(user)
  } catch (error) {
    return Response.json(error)
  }
}
