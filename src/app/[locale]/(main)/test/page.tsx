'use client'

import PageLayout from '@/components/pageLayout'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function Test() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: 'Scheduled: Catch up',
      description: 'Friday, February 10, 2023 at 5:57 PM',
      variant: 'destructive',
    })
  }

  return (
    <PageLayout title="Test">
      <Button onClick={handleClick}>Click me!</Button>
    </PageLayout>
  )
}
