import PageLayout from '@/components/pageLayout'
import UploadImage from '@/components/gallery/uploadImage'

export const runtime = 'edge'

export default function Page() {
  return (
    <PageLayout title={'Upload'}>
      <UploadImage />
    </PageLayout>
  )
}
