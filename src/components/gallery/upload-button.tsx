'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function UploadButton() {
  return (
    <Link href={'/gallery/upload'}>
      <Button>Upload</Button>
    </Link>
  )
}
