'use client'
import { databases, functions } from '@/app/appwrite-client'
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { ExecutionMethod } from 'node-appwrite'
import {
  CommunityDocumentsType,
  CommunitySettingsDocumentsType,
} from '@/utils/types/models'

const communitySchema = z.object({
  isFindable: z.boolean(),
  hasPublicPage: z.boolean(),
  nsfw: z.boolean(),
})

export default function CommunityAdminSettings({
  community,
}: {
  community: CommunityDocumentsType
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [communitySettings, setCommunitySettings] =
    useState<CommunitySettingsDocumentsType>(null)

  const getSettings = useCallback(async () => {
    const data: CommunitySettingsDocumentsType = await databases.getDocument(
      'hp_db',
      'community-settings',
      community.$id
    )
    setCommunitySettings(data)
  }, [community.$id])

  useEffect(() => {
    getSettings().then(() => setIsLoading(false))
  }, [community, getSettings])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = communitySchema.safeParse(communitySettings)
    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message)
      })
      return
    }

    const loadingToast = toast.loading('Updating community data...')
    try {
      await databases.updateDocument(
        'hp_db',
        'community-settings',
        community.$id,
        {
          isFindable: communitySettings.isFindable,
          hasPublicPage: communitySettings.hasPublicPage,
          nsfw: communitySettings.nsfw,
        }
      )

      await databases.updateDocument('hp_db', 'community', community.$id, {
        communitySettings: 'headpat-official',
      })
      toast.success('Community settings updated successfully.')
    } catch (error) {
      Sentry.captureException(error)
      toast.error('Error updating community data. Please try again later.')
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  const handleDelete = async () => {
    const loadingToast = toast.loading('Deleting community...')
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community?communityId=${community.$id}`,
        ExecutionMethod.DELETE
      )
      const response = JSON.parse(data.responseBody)

      if (response.type === 'community_delete_missing_id') {
        toast.error('Community ID is missing')
        return
      } else if (response.type === 'unauthorized') {
        toast.error('Unauthorized')
        return
      } else if (response.type === 'community_delete_no_permission') {
        toast.error('No permission')
        return
      } else if (response.type === 'community_delete_error') {
        toast.error('Failed to delete community')
        return
      } else if (response.type === 'community_deleted') {
        router.push('/community')
        toast.success('Community deleted successfully.')
        return
      }
    } catch (error) {
      toast.error('Failed to delete community. Please try again later.')
      Sentry.captureException(error)
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">
              Advanced Settings
            </h4>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              These settings will affect how your community is displayed and
              interacted with.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2">
            <div className="mt-12 gap-x-6 space-y-8 sm:max-w-full">
              <div className="flex items-center gap-2">
                <Switch
                  id={'isFindable'}
                  checked={communitySettings?.isFindable}
                  onCheckedChange={() =>
                    setCommunitySettings((prev) => ({
                      ...prev,
                      isFindable: !prev.isFindable,
                    }))
                  }
                />
                <Label
                  id={'isFindable'}
                  onClick={() => {
                    setCommunitySettings((prev) => ({
                      ...prev,
                      isFindable: !prev.isFindable,
                    }))
                  }}
                >
                  Is findable?
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id={'hasPublicPage'}
                  checked={communitySettings?.hasPublicPage}
                  onCheckedChange={() =>
                    setCommunitySettings((prev) => ({
                      ...prev,
                      hasPublicPage: !prev.hasPublicPage,
                    }))
                  }
                />
                <Label
                  id={'hasPublicPage'}
                  onClick={() => {
                    setCommunitySettings((prev) => ({
                      ...prev,
                      hasPublicPage: !prev.hasPublicPage,
                    }))
                  }}
                >
                  Is public accessible?
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id={'nsfw'}
                  checked={communitySettings?.nsfw}
                  onCheckedChange={() =>
                    setCommunitySettings((prev) => ({
                      ...prev,
                      nsfw: !prev.nsfw,
                    }))
                  }
                />
                <Label
                  id={'nsfw'}
                  onClick={() => {
                    setCommunitySettings((prev) => ({
                      ...prev,
                      nsfw: !prev.nsfw,
                    }))
                  }}
                >
                  Is NSFW?
                </Label>
              </div>
            </div>

            <div className="mt-8 flex">
              <Button type="submit">Save</Button>
            </div>

            <Separator className={'my-4'} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'destructive'}>Delete community</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>Are you sure?</AlertDialogHeader>
                <AlertDialogDescription>
                  <span className={'text-destructive'}>Warning:</span> This
                  action is irreversible. All data will be lost.
                </AlertDialogDescription>
                <div className={'flex-col'}>
                  <div className={'mb-2'}>
                    The following will be deleted:
                    <div>
                      <span className={'text-destructive'}>•</span> Your
                      community
                    </div>
                    <div>
                      <span className={'text-destructive'}>•</span> Community
                      posts
                    </div>
                    <div>
                      <span className={'text-destructive'}>•</span> Community
                      followers
                    </div>
                    <div>
                      <span className={'text-destructive'}>•</span> Community
                      settings
                    </div>
                    <div>
                      <span className={'text-destructive'}>•</span> Everything
                      else that is associated with your community
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <p>
                      If you are sure you want to delete your community, please
                      confirm below.
                    </p>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={'bg-destructive'}
                    onClick={handleDelete}
                  >
                    <span className={'text-white'}>Confirm deletion</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </div>
      </div>
    </>
  )
}
