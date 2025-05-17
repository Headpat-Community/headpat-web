'use client'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { databases } from '@/app/appwrite-client'
import { useEffect, useState } from 'react'
import UploadAvatar from '@/components/account/uploadAvatar'
import UploadBanner from '@/components/account/uploadBanner'
import { AccountPrefs, UserDataDocumentsType } from '@/utils/types/models'
import { toast } from 'sonner'
import { getDocument } from '@/components/api/documents'
import z from 'zod'

const schema = z.object({
  status: z.string().max(24, 'Status: Max length is 24'),
  bio: z.string().max(2048, 'Bio: Max length is 2048').nullable(),
  displayName: z
    .string()
    .min(3, 'Display Name should be at least 3 characters')
    .max(32, 'Display Name: Max length is 32'),
  birthday: z.string().max(32, 'Max length is 32').nullable(),
  pronouns: z.string().max(16, 'Pronouns: Max length is 16').nullable(),
  location: z.string().max(48, 'Location: Max length is 48').nullable(),
})

export default function FrontpageView({
  accountData,
}: {
  accountData: AccountPrefs
}) {
  const [userData, setUserData] = useState<UserDataDocumentsType>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  useEffect(() => {
    getDocument('hp_db', 'userdata', accountData.$id).then(
      (data: UserDataDocumentsType) => setUserData(data)
    )
  }, [accountData])

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    try {
      // Validate the entire communitySettings object
      schema.parse(userData)
    } catch (error) {
      toast.error(error.errors[0].message)
      return
    }

    try {
      setIsUploading(true)

      const promise = databases.updateDocument(
        'hp_db',
        'userdata',
        accountData.$id,
        {
          status: userData.status,
          bio: userData.bio,
          displayName: userData.displayName,
          birthday: new Date(userData.birthday).toISOString().split('T')[0],
          pronouns: userData.pronouns,
          location: userData.location,
        }
      )

      promise.then(
        function () {
          setIsUploading(false)
          toast.success('Your data has been uploaded successfully.')
        },
        function (error) {
          console.log(error) // Failure
          setIsUploading(false)
          toast.error('Failed to upload data.')
        }
      )
    } catch (error) {
      setIsUploading(false)
      console.error(error)
      Sentry.captureException(error)
      toast.error('Failed to upload data.')
    }
  }

  return (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">
              Frontpage Settings
            </h4>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              Here you can change your public profile settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2">
            <UploadAvatar
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              userId={accountData && accountData.$id}
              userData={userData}
            />
            <div className={'my-4'} />
            <UploadBanner
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              userId={accountData && accountData.$id}
              userData={userData}
            />

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="displayname">Display Name</Label>
                <div className="relative mt-2">
                  <Input
                    id="displayname"
                    name="displayname"
                    type="text"
                    value={userData?.displayName || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          displayName: e.target.value,
                        })
                      }
                    }}
                    maxLength={32}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData?.displayName?.length || 0}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
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
                    value={userData?.status || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 24) {
                        setUserData({ ...userData, status: e.target.value })
                      }
                    }}
                    maxLength={24}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData?.status?.length || 0}
                    </span>
                    <span className="select-none text-gray-400">/{24}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="pronouns">Pronouns</Label>
                <div className="relative mt-2">
                  <Input
                    id="pronouns"
                    name="pronouns"
                    type="text"
                    value={userData?.pronouns || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 16) {
                        setUserData({
                          ...userData,
                          pronouns: e.target.value,
                        })
                      }
                    }}
                    maxLength={16}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData?.pronouns?.length || 0}
                    </span>
                    <span className="select-none text-gray-400">/{16}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="birthday">Birthday</Label>
                <div className="relative mt-2">
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={
                      !isNaN(Date.parse(userData?.birthday))
                        ? new Date(userData?.birthday)
                            .toISOString()
                            .split('T')[0]
                        : '01-01-1900T00:00:00'
                    }
                    onChange={(e) => {
                      setUserData({ ...userData, birthday: e.target.value })
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span
                      aria-disabled={true}
                      className="mr-6 select-none text-gray-400"
                    >
                      DD/MM/YYYY
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-2">
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={userData?.location || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 48) {
                        setUserData({
                          ...userData,
                          location: e.target.value,
                        })
                      }
                    }}
                    maxLength={48}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData?.location?.length || 0}
                    </span>
                    <span className="select-none text-gray-400">/{48}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium leading-6"
                >
                  Bio
                </Label>
                <div className="relative mt-2">
                  <Textarea
                    id="bio"
                    name="bio"
                    value={userData?.bio || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 2048) {
                        setUserData({ ...userData, bio: e.target.value })
                      }
                    }}
                    maxLength={2048}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-end pb-2 pr-4 text-sm leading-5">
                    <span className="select-none">
                      {userData?.bio?.length || 0}
                    </span>
                    <span className="select-none text-gray-400">/{2048}</span>
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
