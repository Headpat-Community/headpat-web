'use client'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as Sentry from '@sentry/nextjs'
import { getDocument } from '@/components/api/documents'
import z from 'zod'
import { databases } from '@/app/appwrite-client'
import { toast } from 'sonner'
import { UserDataDocumentsType } from '@/utils/types/models'

const schema = z.object({
  discordname: z
    .string()
    .max(32, 'Discord name must be 32 characters or less')
    .nullable(),
  telegramname: z
    .string()
    .max(32, 'Telegram name must be 32 characters or less')
    .nullable(),
  furaffinityname: z
    .string()
    .max(32, 'Furaffinity name must be 32 characters or less')
    .nullable(),
  X_name: z
    .string()
    .max(32, 'X / Twitter name must be 32 characters or less')
    .nullable(),
  twitchname: z
    .string()
    .max(32, 'Twitch name must be 32 characters or less')
    .nullable(),
  blueskyname: z
    .string()
    .max(32, 'Bluesky name must be 32 characters or less')
    .nullable()
})

export default function SocialsView({ accountData }) {
  const [isUploading, setIsUploading] = useState(false)
  const [userData, setUserData] = useState(null)

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

      await databases.updateDocument('hp_db', 'userdata', accountData.$id, {
        discordname: userData.discordname,
        telegramname: userData.telegramname,
        furaffinityname: userData.furaffinityname,
        X_name: userData.X_name,
        twitchname: userData.twitchname,
        blueskyname: userData.blueskyname
      })

      toast.success('User data saved successfully.')
    } catch (error) {
      toast.error('Failed to save user data. Please try again later.')
      Sentry.captureException(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">Socials</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Here you can add your Social Media Accounts to your public
              profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Label htmlFor="discordname">Discord Name</Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="discordname"
                    id="discordname"
                    value={userData ? userData.discordname : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          discordname: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData?.discordname?.length : 0}
                      {/* Check if userData.discordname is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label
                  htmlFor="telegramname"
                  className="block text-sm font-medium leading-6"
                >
                  Telegram Name
                </Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="telegramname"
                    id="telegramname"
                    value={userData ? userData.telegramname : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          telegramname: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData?.telegramname?.length : 0}
                      {/* Check if userData.telegramname is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label htmlFor="furaffinityname">Furaffinity Name</Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="furaffinityname"
                    id="furaffinityname"
                    value={userData ? userData.furaffinityname : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          furaffinityname: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData?.furaffinityname?.length : 0}
                      {/* Check if userData.furaffinityname is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label
                  htmlFor="X_name"
                  className="block text-sm font-medium leading-6"
                >
                  X / Twitter Name
                </Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="X_name"
                    id="X_name"
                    value={userData ? userData.X_name : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          X_name: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData?.X_name?.length : 0}
                      {/* Check if userData.X_name is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label htmlFor="twitchname">Twitch</Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="twitchname"
                    id="twitchname"
                    value={userData ? userData.twitchname : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          twitchname: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.twitchname?.length : 0}
                      {/* Check if userData.twitchname is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label htmlFor="blueskyname">Bluesky</Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    name="blueskyname"
                    id="blueskyname"
                    value={userData ? userData.blueskyname : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          blueskyname: e.target.value
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.blueskyname?.length : 0}
                      {/* Check if userData.blueskyname is defined before accessing its length property */}
                    </span>
                    <span className="select-none text-gray-400">/{32}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <Button disabled={isUploading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
