'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ErrorMessage, SuccessMessage } from '@/components/alerts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { databases, ID, storage } from '@/app/appwrite'
import { useGetUser } from '@/utils/getUserData'
import { Checkbox } from '@/components/ui/checkbox'
import { UserAvatarsDocumentType } from '@/utils/types'

export default function AccountPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { userMe, userData, setUserData } = useGetUser()

  const getAvatarImageUrl = (galleryId: string) => {
    if (!galleryId) return
    const imageId = storage.getFilePreview(
      '655842922bac16a94a25',
      `${galleryId}`,
      400
    )
    return imageId.href
  }

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile.size > 1024 * 1024) {
      setError('Dateigröße darf nur bis 1MB groß sein.')
      setTimeout(() => {
        setError(null)
      }, 5000)
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsDataURL(selectedFile)
    fileReader.onload = (event) => {
      const imgElement = document.getElementById(
        'avatar-image'
      ) as HTMLImageElement
      if (typeof event.target.result === 'string') {
        imgElement.src = event.target.result
        const img = new Image()
        img.src = event.target.result
        //img.onload = () => {
        //  setSelectedFile(selectedFile)
        //}
      }
    }
  }

  const handleSubmitAvatar = async (event) => {
    event.preventDefault()

    try {
      // Year-Month-Day (YYYY-MM-DD)

      setIsUploading(true) // Set isUploading to true before making the API call

      // Get the user's avatar document
      const avatarDocument: UserAvatarsDocumentType =
        await databases.getDocument('hp_db', 'userdata', userMe.$id)
      // If the user already has an avatar, delete it
      if (avatarDocument.galleryId) {
        // Delete the old avatar
        await storage.deleteFile(
          '655842922bac16a94a25',
          avatarDocument.galleryId
        )
      }

      // Upload the new avatar
      const fileData = storage.createFile(
        '655842922bac16a94a25',
        ID.unique(),
        (document.getElementById('avatar-upload') as HTMLInputElement).files[0]
      )

      fileData.then(
        function (response) {
          // Update the user's avatarId
          databases.updateDocument('hp_db', 'userdata', userMe.$id, {
            avatarId: response.$id,
          })
        },
        function (error) {
          console.log(error) // Failure
        }
      )

      setIsUploading(false) // Set isUploading to false after the API call is complete
    } catch (error) {
      console.error(error)
    }
  }

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
          setSuccess('Saved!')
        },
        function (error) {
          console.log(error) // Failure
          setIsUploading(false)
          setError('Failed to upload Data')
        }
      )

      setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
    } catch (error) {
      setIsUploading(false)
      setError('Failed to upload Data')
      console.error(error)
    }
  }

  const secondaryNavigation = [
    { name: 'Account', href: '/account', current: false },
    { name: 'Frontpage', href: '/account/profile/frontpage', current: true },
    { name: 'Socials', href: '/account/profile/socials', current: false },
  ]

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full flex items-center gap-x-8">
                <img
                  id="avatar-image"
                  src={
                    getAvatarImageUrl(userData?.avatarId) || '/logos/logo.webp'
                  }
                  alt="Avatar"
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                />
                <div>
                  <Input
                    accept="image/*"
                    className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/10 hover:bg-white/20 dark:ring-white/10"
                    id="avatar-upload"
                    name="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-900 dark:text-gray-400">
                      JPG, GIF or PNG. 2MB max.
                    </p>
                    <Button
                      type="submit"
                      onClick={handleSubmitAvatar}
                      className={'mt-2'}
                    >
                      Submit
                    </Button>
                  </div>
                  <p className="text-xs text-gray-900 dark:text-gray-400">
                    1024x1024 max. resolution
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="displayname">Display Name</Label>
                <div className="mt-2">
                  <Checkbox id="public_birthday" name="public_birthday" />
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
                      {userData ? userData.displayName.length : 0}
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
                      {userData ? userData.status.length : 0}
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
                      {userData ? userData.pronouns.length : 0}
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
                      userData
                        ? new Date(userData.birthday)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    } // Set the value from state in the correct format
                    onChange={(e) => {
                      setUserData({ ...userData, birthday: e.target.value })
                    }} // Update state when the input changes
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
                      {userData ? userData.location.length : 0}
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
                      {userData ? userData.bio.length : 0}
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
