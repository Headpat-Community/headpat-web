'use client'
import PageLayout from '@/components/pageLayout'

export const runtime = 'edge'

export default function Page() {
  return (
    <PageLayout title={'Verify your email'}>
      Hi, please verify your email.
    </PageLayout>
  )
}
