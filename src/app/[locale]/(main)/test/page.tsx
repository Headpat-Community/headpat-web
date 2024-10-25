'use client'

import PageLayout from '@/components/pageLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Test() {
  const handleClick = () => {
    toast.success('Your action was successful.')
  }

  const handleErrorClick = () => {
    toast.error('Something went wrong.')
  }

  const handleLoadingClick = () => {
    toast.loading('Please wait...')
  }

  return (
    <PageLayout title="Test">
      <div className="space-x-2">
        <Button onClick={handleClick}>Success</Button>
        <Button onClick={handleErrorClick}>Error</Button>
        <Button onClick={handleLoadingClick}>Loading</Button>
      </div>
    </PageLayout>
  )
}
