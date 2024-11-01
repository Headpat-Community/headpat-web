'use client'
import { Community } from '@/utils/types/models'
import { TabsContent } from '@/components/ui/tabs'
import CommunityAdminMain from '@/components/community/admin/main'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { useEffect, useState } from 'react'
import NoAccess from '@/components/static/noAccess'
import { hasAdminPanelAccess } from '@/utils/actions/community/checkRoles'
import { toast } from 'sonner'
import CommunityAdminSettings from '@/components/community/admin/settings'

export default function PageClient({
  community,
}: {
  community: Community.CommunityDocumentsType
}) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getOwnerStatus = async () => {
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community/isFollowing?communityId=${community.$id}`,
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)

      if (response.code === 500) {
        toast.error('Error fetching community data. Please try again later.')
      }

      setHasPermission(await hasAdminPanelAccess(response.roles))
    } catch (error) {
      toast.error('Error fetching community data. Please try again later.')
    }
  }

  useEffect(() => {
    getOwnerStatus().then(() => setIsLoading(false))
  }, [community])

  if (!isLoading && !hasPermission) {
    return <NoAccess />
  }

  return (
    <>
      <TabsContent value="general">
        <CommunityAdminMain community={community} />
      </TabsContent>
      <TabsContent value="settings">
        <CommunityAdminSettings community={community} />
      </TabsContent>
    </>
  )
}
