import PageLayout from '@/components/pageLayout'

export const runtime = 'edge'

export const metadata = {
  title: 'Community Profile',
  description: 'Community Profile Description',
}

export default async function Page() {
  return (
    <PageLayout title={'Community Event'}>
      <div>Community Event</div>
    </PageLayout>
  )
}
