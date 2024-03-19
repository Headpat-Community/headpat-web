'use client'
import { Button } from '@/components/ui/button'

export function CopyUrl() {
  return (
    <>
      <Button
        className="hidden sm:block"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        Copy URL
      </Button>
    </>
  )
}
