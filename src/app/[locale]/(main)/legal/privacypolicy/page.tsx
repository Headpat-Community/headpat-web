import PrivacyPolicy from './privacypolicy.mdx'
import PageLayout from '@/components/pageLayout'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <PageLayout title={'Privacy Policy'}>
      <PrivacyPolicy />
    </PageLayout>
  )
}
