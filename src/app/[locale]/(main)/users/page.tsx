import PageLayout from '@/components/pageLayout'
import PageClient from './page.client'

export const runtime = 'edge'

export default async function Users({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <PageLayout title={'Users'}>
      <PageClient />
    </PageLayout>
  )
}
