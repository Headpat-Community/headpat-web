'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function CopyUrl() {
  const toast = useToast()
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
