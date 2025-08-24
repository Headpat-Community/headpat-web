"use client"

import { Button } from "@/components/ui/button"
import type { AccountType } from "@/utils/types/models"
import Link from "next/link"

export function UploadButton({ current }: { current: AccountType }) {
  return (
    <Link href={current?.$id ? `/gallery/upload` : "/login"}>
      <Button>Upload</Button>
    </Link>
  )
}
