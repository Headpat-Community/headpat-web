'use client'
import { ReactNode } from 'react'
import { useFeatureStatus } from '@/hooks/useFeatureStatus'
import { useUser } from '@/components/contexts/UserContext'
import { useRouter } from '@/i18n/routing'
import Maintenance from '@/components/static/maintenance'
import NoAccess from '@/components/static/noAccess'

interface FeatureAccessProps {
  featureName: string
  children: ReactNode
}

const FeatureAccess = ({ featureName, children }: FeatureAccessProps) => {
  const featureStatus = useFeatureStatus(featureName)
  const { current } = useUser()
  const router = useRouter()

  if (!featureStatus) {
    return null
  }

  if (!current) {
    router.push('/login')
    return null
  }

  if (!featureStatus?.isEnabled && !current.labels?.includes('dev')) {
    return <Maintenance />
  } else if (
    featureStatus?.type === 'earlyaccess' &&
    (!current.labels?.includes(`${featureName}Beta`) ||
      !current.labels?.includes('dev'))
  ) {
    return <NoAccess />
  } else if (
    featureStatus?.type === 'staff' &&
    (!current.labels?.includes('staff') || !current.labels?.includes('dev'))
  ) {
    return <NoAccess />
  } else if (
    featureStatus?.type === 'dev' &&
    !current.labels?.includes('dev')
  ) {
    return <NoAccess />
  }

  return children
}

export default FeatureAccess
