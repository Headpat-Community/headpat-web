import PageLayout from '@/components/pageLayout'
import PageClient from './page.client'

export const runtime = 'edge'

export default async function Page() {
  return (
    <PageLayout title={'Map'}>
      <PageClient />
    </PageLayout>
  )
}
