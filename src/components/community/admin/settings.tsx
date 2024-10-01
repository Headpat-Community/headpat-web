'use client'
import { Community } from '@/utils/types/models'
import { databases } from '@/app/appwrite-client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { Switch } from '@/components/ui/switch'

const communitySchema = z.object({
  isFindable: z.boolean(),
  hasPublicPage: z.boolean(),
  nsfw: z.boolean(),
})

export default function CommunityAdminSettings({
  community,
}: {
  community: Community.CommunityDocumentsType
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [communitySettings, setCommunitySettings] =
    useState<Community.CommunitySettingsDocumentsType>(null)

  const getSettings = async () => {
    const data: Community.CommunitySettingsDocumentsType =
      await databases.getDocument('hp_db', 'community-settings', community.$id)
    setCommunitySettings(data)
  }

  useEffect(() => {
    getSettings().then(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community])

  const handleSubmit = async (e) => {
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
      toast.success('Community settings updated successfully.')
    } catch (error) {
      Sentry.captureException(error)
      toast.error('Error updating community data. Please try again later.')
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
            <h2 className="text-base font-semibold leading-7">
              Advanced Settings
            </h2>
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
          </form>
        </div>
      </div>
    </>
  )
}
