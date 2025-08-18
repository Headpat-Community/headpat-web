'use client'
import { ReactNode, useMemo, useCallback, memo } from 'react'
import { useFeatureStatus } from '@/hooks/useFeatureStatus'
import { useUser } from '@/components/contexts/UserContext'
import { useRouter } from 'next/navigation'
import Maintenance from '@/components/static/maintenance'
import NoAccess from '@/components/static/noAccess'

interface FeatureAccessProps {
  featureName: string
  children: ReactNode
}

const FeatureAccess = memo(function FeatureAccess({
  featureName,
  children
}: FeatureAccessProps) {
  const featureStatus = useFeatureStatus(featureName)
  const { current } = useUser()
  const router = useRouter()

  // Memoize user labels to prevent unnecessary recalculations
  const userLabels = useMemo(() => current?.labels || [], [current?.labels])

  // Memoize feature access checks to prevent unnecessary recalculations
  const accessChecks = useMemo(() => {
    if (!featureStatus)
      return {
        hasAccess: false,
        shouldRedirect: false,
        showMaintenance: false,
        showNoAccess: false
      }

    const isDev = userLabels.includes('dev')
    const isStaff = userLabels.includes('staff') || isDev
    const hasFeatureBeta = userLabels.includes(`${featureName}Beta`) || isDev

    // Early access check
    if (featureStatus.type === 'earlyaccess' && !hasFeatureBeta) {
      return {
        hasAccess: false,
        shouldRedirect: false,
        showMaintenance: false,
        showNoAccess: true
      }
    }

    // Staff access check
    if (featureStatus.type === 'staff' && !isStaff) {
      return {
        hasAccess: false,
        shouldRedirect: false,
        showMaintenance: false,
        showNoAccess: true
      }
    }

    // Dev access check
    if (featureStatus.type === 'dev' && !isDev) {
      return {
        hasAccess: false,
        shouldRedirect: false,
        showMaintenance: false,
        showNoAccess: true
      }
    }

    // Feature enabled check
    if (!featureStatus.isEnabled && !isDev) {
      return {
        hasAccess: false,
        shouldRedirect: false,
        showMaintenance: true,
        showNoAccess: false
      }
    }

    // Public access check
    if (featureStatus.type !== 'public' && !current) {
      return {
        hasAccess: false,
        shouldRedirect: true,
        showMaintenance: false,
        showNoAccess: false
      }
    }

    return {
      hasAccess: true,
      shouldRedirect: false,
      showMaintenance: false,
      showNoAccess: false
    }
  }, [featureStatus, userLabels, featureName, current])

  // Memoize redirect handler to prevent unnecessary re-renders
  const handleRedirect = useCallback(() => {
    if (accessChecks.shouldRedirect) {
      router.push('/login')
    }
  }, [accessChecks.shouldRedirect, router])

  // Handle redirect effect
  if (accessChecks.shouldRedirect) {
    handleRedirect()
    return null
  }

  // Show maintenance page
  if (accessChecks.showMaintenance) {
    return <Maintenance />
  }

  // Show no access page
  if (accessChecks.showNoAccess) {
    return <NoAccess />
  }

  // Feature is accessible
  if (accessChecks.hasAccess) {
    return <>{children}</>
  }

  // Fallback - no access
  return null
})

export default FeatureAccess
