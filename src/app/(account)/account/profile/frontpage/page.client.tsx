'use client'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { databases } from '@/app/appwrite-client'
import { useGetUser } from '@/utils/getUserData'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import UploadAvatar from '@/app/(account)/account/profile/frontpage/uploadAvatar'
import { CheckedState } from '@radix-ui/react-menu'

export default function AccountPage() {
  const { userMe, userData, setUserData } = useGetUser()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [hiddenBirthday, setHiddenBirthday] = useState<boolean>(false)
  const [hiddenPronouns, setHiddenPronouns] = useState<boolean>(false)
  const { toast } = useToast()

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    try {
      setIsUploading(true)

      const promise = databases.updateDocument(
        'hp_db',
        'userdata',
        userMe?.$id,
        {
          status: (document.getElementById('status') as HTMLInputElement).value,
          bio: (document.getElementById('biostatus') as HTMLInputElement).value,
          displayName: (
            document.getElementById('displayname') as HTMLInputElement
          ).value,
          birthday: new Date(
            (document.getElementById('birthday') as HTMLInputElement).value
          )
            .toISOString()
            .split('T')[0],
          pronouns: (document.getElementById('pronouns') as HTMLInputElement)
            .value,
          location: (document.getElementById('location') as HTMLInputElement)
            .value,
        }
      )

      promise.then(
        function () {
          setIsUploading(false)
          toast({
            title: 'Data uploaded',
            description: 'Your data has been uploaded successfully.',
          })
        },
        function (error) {
          console.log(error) // Failure
          setIsUploading(false)
          toast({
            title: 'Error',
            description: 'Failed to upload data.',
            variant: 'destructive',
          })
        }
      )
    } catch (error) {
      setIsUploading(false)
      console.error(error)
      Sentry.captureException(error)
      toast({
        title: 'Error',
        description: 'Failed to upload data.',
        variant: 'destructive',
      })
    }
  }

  const secondaryNavigation = [
    { name: 'Account', href: '/account', current: false },
    { name: 'Frontpage', href: '/account/profile/frontpage', current: true },
    { name: 'Socials', href: '/account/profile/socials', current: false },
  ]

  const hideBirthday = async (event: CheckedState) => {
    if (event) {
      await databases.updateDocument('hp_db', 'userdata', userMe.$id, {
        birthday: '1900-01-01T00:00:00',
      })

      setHiddenBirthday(true)
    }
  }

  return (
    <>
      <header className="border-b border-black/5 dark:border-white/5">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-400 sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={item.current ? 'text-indigo-400' : ''}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
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
              userMe={userMe}
              userData={userData}
            />

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
              <div className={'col-span-full grid grid-cols-2'}>
                <div className="col-span-1">
                  <Label htmlFor="hide_birthday">Hide Birthday?</Label>
                  <div className="mt-2">
                    <Checkbox
                      id="hide_birthday"
                      name="hide_birthday"
                      onCheckedChange={(e) => hideBirthday(e)}
                      disabled={hiddenBirthday}
                    />
                  </div>
                  <Label htmlFor="hide_location">Hide Location?</Label>
                  <div className="mt-2">
                    <Checkbox id="hide_location" name="hide_location" />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label htmlFor="hide_pronouns">Hide Pronouns?</Label>
                  <div className="mt-2">
                    <Checkbox id="hide_pronouns" name="hide_pronouns" />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="displayname">Display Name</Label>
                <div className="relative mt-2">
                  <Input
                    id="displayname"
                    name="displayname"
                    type="text"
                    value={userData ? userData.displayName : ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          displayName: e.target.value,
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.displayName?.length : 0}
                      {/* Check if userData.displayname is defined before accessing its length property */}
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
                    value={userData ? userData.status : ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 24) {
                        setUserData({ ...userData, status: e.target.value })
                      }
                    }}
                    maxLength={24}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.status?.length : 0}
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
                    value={userData ? userData.pronouns : ''}
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
                      {userData ? userData?.pronouns?.length : 0}
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
                      userData && !isNaN(Date.parse(userData.birthday))
                        ? new Date(userData.birthday)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      setUserData({ ...userData, birthday: e.target.value })
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span
                      aria-disabled
                      className="mr-6 select-none text-gray-400"
                    >
                      DD/MM/YYYY
                    </span>{' '}
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
                    value={userData ? userData.location : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 256) {
                        setUserData({
                          ...userData,
                          location: e.target.value,
                        })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 16
                    maxLength={256} // Limit the maximum number of characters to 16
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.location?.length : 0}
                    </span>
                    <span className="select-none text-gray-400">/{256}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <Label
                  htmlFor="biostatus"
                  className="block text-sm font-medium leading-6"
                >
                  Bio
                </Label>
                <div className="relative mt-2">
                  <Textarea
                    id="biostatus"
                    name="biostatus"
                    value={userData ? userData.bio : ''} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 2048) {
                        setUserData({ ...userData, bio: e.target.value })
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 256
                    maxLength={2048} // Limit the maximum number of characters to 256
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-end pb-2 pr-4 text-sm leading-5">
                    <span className="select-none">
                      {userData ? userData.bio?.length : 0}
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
