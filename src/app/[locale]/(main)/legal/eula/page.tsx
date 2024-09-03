import Eula from './eula.mdx'
import PageLayout from '@/components/pageLayout'

export const metadata = {
  title: 'EULA',
}

export const runtime = 'edge'

export default function Page() {
  return (
    <PageLayout title={'EULA'}>
      <Eula />
    </PageLayout>
  )
}
