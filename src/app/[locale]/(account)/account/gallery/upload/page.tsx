import Client from './page.client'
import PageLayout from '@/components/pageLayout'

export const metadata = {
  title: 'Upload',
}

export const runtime = 'edge'

export default function UploadPage() {
  return (
    <PageLayout title={'Upload Gallery Image'}>
      <Client />
    </PageLayout>
  )
}
