"use client"

import { functions } from "@/app/appwrite-client"
import { ExecutionMethod } from "node-appwrite"

export async function addFollow(followerId: string) {
  const data = await functions.createExecution(
    "user-endpoints",
    "",
    false,
    `/user/follow?followerId=${followerId}`,
    ExecutionMethod.POST
  )

  return JSON.parse(data.responseBody)
}
