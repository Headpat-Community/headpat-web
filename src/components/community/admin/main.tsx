'use client'
import { Community } from '@/utils/types/models'
import { databases } from '@/app/appwrite-client'
import { useEffect, useState } from 'react'
import UploadAvatar from '@/components/community/uploadAvatar'
import UploadBanner from '@/components/community/uploadBanner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'

const communitySchema = z.object({
  name: z
    .string()
    .min(4, 'Name must be 4 characters or more')
    .max(64, 'Name must be 64 characters or less'),
  description: z
    .string()
    .max(4096, 'Description must be 4096 characters or less'),
  status: z.string().max(24, 'Status must be 24 characters or less'),
})

export default function CommunityAdminMain({
  community,
}: {
  community: Community.CommunityDocumentsType
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [communityData, setCommunityData] =
    useState<Community.CommunityDocumentsType>(null)
  const [isUploading, setIsUploading] = useState(false)

  const getCommunity = async () => {
    const data: Community.CommunityDocumentsType = await databases.getDocument(
      'hp_db',
      'community',
      community.$id
    )
    setCommunityData(data)
  }

  useEffect(() => {
    getCommunity().then(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community])

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">
              Frontpage Settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              Here you can change your public profile settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2">
            <UploadAvatar
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              communityData={communityData}
            />
            <div className={'my-4'} />
            <UploadBanner
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              communityData={communityData}
            />

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="name">Display Name</Label>
                <div className="relative mt-2">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={communityData ? communityData.name : ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setCommunityData({
                          ...communityData,
                          name: e.target.value,
                        })
                      }
                    }}
                    maxLength={32}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {communityData ? communityData.name?.length : 0}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="description">Description</Label>
                <div className="relative mt-2">
                  <Textarea
                    id="description"
                    name="description"
                    value={communityData ? communityData.description : ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setCommunityData({
                          ...communityData,
                          description: e.target.value,
                        })
                      }
                    }}
                    className="resize-none"
                    maxLength={4096}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {communityData ? communityData.description?.length : 0}
                    </span>
                    <span className="select-none text-gray-400">/{4096}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="status">Status</Label>
                <div className="relative mt-2">
                  <Input
                    id="status"
                    name="status"
                    type="text"
                    value={communityData ? communityData.status : ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 24) {
                        setCommunityData({
                          ...communityData,
                          status: e.target.value,
                        })
                      }
                    }}
                    maxLength={24}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {communityData ? communityData.status?.length : 0}
                    </span>
                    <span className="select-none text-gray-400">/{24}</span>
                  </div>
                </div>
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
