'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { editSocials } from '@/utils/actions/account/socials'
import * as Sentry from '@sentry/nextjs'

export default function SocialsView({ userDataResponse }) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [userData, setUserData] = useState(userDataResponse)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setIsUploading(true)

    const discordname = (
      document.getElementById('discordname') as HTMLInputElement
    ).value
    const telegramname = (
      document.getElementById('telegramname') as HTMLInputElement
    ).value
    const furaffinityname = (
      document.getElementById('furaffinityname') as HTMLInputElement
    ).value
    const X_name = (document.getElementById('X_name') as HTMLInputElement).value
    const twitchname = (
      document.getElementById('twitchname') as HTMLInputElement
    ).value

    const promise = await editSocials(
      discordname,
      telegramname,
      furaffinityname,
      X_name,
      twitchname
    )

    if (promise.error) {
      toast({
        title: 'Error',
        description: 'Failed to upload Data.',
        variant: 'destructive',
      })
      Sentry.captureException(promise)
      setIsUploading(false)
    } else {
      setIsUploading(false)
      toast({
        title: 'Succees!',
        description: 'Data has been saved.',
      })
    }
  }

  return (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">Socials</h2>
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
                          discordname: e.target.value,
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
                          telegramname: e.target.value,
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
                          furaffinityname: e.target.value,
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
                          X_name: e.target.value,
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
                          twitchname: e.target.value,
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
