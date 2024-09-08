import PageLayout from '@/components/pageLayout'

export const runtime = 'edge'

export default async function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return <PageLayout title={'hi'}>Test</PageLayout>
}
