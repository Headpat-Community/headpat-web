'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import MfaAlert from '@/components/account/profile/mfaAlert'
import * as Sentry from '@sentry/nextjs'
import { ExecutionMethod, Models } from 'node-appwrite'
import MfaRecoveryCodes from '@/components/account/profile/mfaRecoveryCodes'
import { Account, UserData } from '@/utils/types/models'
import { useRouter } from '@/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getDocument } from '@/components/api/documents'
import { toast } from 'sonner'
import { useUser } from '@/components/contexts/UserContext'
import { account, databases, functions } from '@/app/appwrite-client'

export default function GeneralAccountView({
  accountData,
  mfaList,
}: {
  accountData: Account.AccountPrefs
  mfaList: Models.MfaFactors
}) {
  const [userMe, setUserMe] = useState(accountData)
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  const { setUser } = useUser()

  useEffect(() => {
    getDocument('hp_db', 'userdata', accountData.$id)
      .then((data: UserData.UserDataDocumentsType) => setUserData(data))
      .catch(() => {
        // Sometimes the function is too slow and the data is not created yet
        window.location.reload()
      })
  }, [accountData])

  const handleEmailChange = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    // Check if email_password has at least 8 characters
    if (userData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }

    try {
      await account.updateEmail(userData.email, userData.password)
      toast.success('E-Mail updated successfully.')
      setUserData((prevUserData: any) => ({
        ...prevUserData,
        email: userData.email,
      }))
    } catch (error) {
      if (error.type == 'user_invalid_credentials') {
        toast.error("Password doesn't match.")
      } else if (error.type == 'user_target_already_exists') {
        toast.error('Account already exists with this email.')
      } else {
        toast.error('Failed to update email. Please try again.')
        Sentry.captureException(error)
      }
    }
  }

  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const target = event.target as typeof event.target & {
      currentpassword: { value: string }
      newpassword: { value: string }
      reset: () => void
    }

    const currentPassword = target.currentpassword.value
    const newPassword = target.newpassword.value

    // Check if profileUrl has at least 4 characters
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }

    try {
      await account.updatePassword(newPassword, currentPassword)
      toast.success('Password updated successfully.')
    } catch (error) {
      if (error.code === 400) {
        toast.error(error.message)
      } else if (error.code === 401) {
        toast.error("Password doesn't match.")
      } else {
        toast.error('Failed to update password. Please try again.')
        target.reset()
      }
    }
  }

  const handleNsfw = async (checked: boolean) => {
    const prefs = userMe.prefs

    try {
      await account.updatePrefs({
        ...prefs,
        nsfw: checked,
      })
      toast.success('NSFW updated successfully.')
      setUserMe((prevUserData: any) => ({
        ...prevUserData,
        prefs: {
          ...prevUserData.prefs,
          nsfw: checked,
        },
      }))
      router.refresh()
    } catch (error) {
      if (error) {
        toast.error('Failed to update NSFW. Please try again.')
      }
    }
  }

  const handleProfileUrlChange = async () => {
    const profileUrl = userData.profileUrl

    // Check if profileUrl has at least 4 characters
    if (profileUrl.length < 3) {
      toast.error('Profile URL must be at least 3 characters long.')
      return
    }

    const promise = await databases.updateDocument(
      'hp_db',
      'userdata',
      userMe?.$id,
      {
        profileUrl: profileUrl,
      }
    )

    if (promise.type === 'document_invalid_structure') {
      toast.error('Invalid structure.')
    } else if (promise.type === 'document_missing_data') {
      toast.error('Missing data.')
    } else if (promise.type === 'document_update_conflict') {
      toast('Cloud is newer than your local data. Please refresh.')
    } else {
      toast.success('Profile URL updated successfully.')
    }
  }

  const deleteAccountButton = async () => {
    try {
      await functions.createExecution(
        'user-endpoints',
        '',
        true,
        '/deleteAccount',
        ExecutionMethod.DELETE
      )
      await account.deleteSessions()

      setUser(null)
      toast.success('Account deleted successfully.')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete account.')
    }
  }

  return (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">Change Email</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Change your email address.
            </p>
          </div>

          <form onSubmit={handleEmailChange} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="email">Email address</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    minLength={3}
                    onChange={(e) => {
                      setUserData((prevUserData: any) => ({
                        ...prevUserData,
                        email: e.target.value,
                      }))
                    }}
                    placeholder={userMe ? userMe.email : ''}
                    autoComplete={'email'}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <Label htmlFor="email_password">Current Password</Label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 dark:ring-white/10">
                    <Input
                      type="password"
                      name="email_password"
                      id="email_password"
                      minLength={8}
                      maxLength={128}
                      onChange={(e) => {
                        setUserData((prevUserData: any) => ({
                          ...prevUserData,
                          password: e.target.value,
                        }))
                      }}
                      required
                      value={userMe ? userMe.password : ''}
                      autoComplete="password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <Button type="submit" variant={'outline'}>
                Save
              </Button>
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">Profile URL</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Your Profile URL is the link that you can share with others to
              showcase your profile.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will change your profile
                  URL to the one you entered. We will not redirect the old URL
                  to the new one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleProfileUrlChange}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <Label htmlFor="username">URL</Label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-background border border-input focus-within:border-primary">
                      <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                        headpat.place/user/
                      </span>
                      <Input
                        type="text"
                        name="profileurl"
                        id="profileurl"
                        required
                        onChange={(e) => {
                          setUserData((prevUserData: any) => ({
                            ...prevUserData,
                            profileUrl: e.target.value,
                          }))
                        }}
                        placeholder={userData ? userData.profileUrl : ''}
                        className="border-0 pl-0 align-middle bg-transparent ml-1 focus:ring-0 focus:outline-none focus:border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
                        minLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <AlertDialogTrigger asChild>
                  <Button type="button" variant={'outline'}>
                    Save
                  </Button>
                </AlertDialogTrigger>
              </div>
            </div>
          </AlertDialog>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="leading- text-base font-semibold">
              Change password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Change your password.
            </p>
          </div>

          <form className="md:col-span-2" onSubmit={handlePasswordReset}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <Label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Current password
                </Label>
                <Input
                  type="password"
                  name="currentpassword" // Updated name
                  id="currentpassword"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="col-span-full">
                <Label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium"
                >
                  New password
                </Label>
                <Input
                  type="password"
                  name="newpassword" // Updated name
                  id="newpassword"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="col-span-full">
                <Button type="submit" variant={'outline'}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="leading- text-base font-semibold">2FA / MFA</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Two-Factor-Authentication / Multi-Factor-Authentication
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-fullf flex gap-4">
              <MfaAlert mfaList={mfaList} />
              {mfaList.totp && <MfaRecoveryCodes />}
            </div>
          </div>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">Enable NSFW</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Checking this box will enable NSFW images. 18+ only.
            </p>
            <p className="text-sm leading-6 text-gray-400">
              Anyone under the age of 18 caught viewing NSFW content will be
              suspended.
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <Checkbox
                  id="nsfwtoggle"
                  aria-describedby="nsfwtoggle"
                  name="nsfwtoggle"
                  checked={userMe ? userMe.prefs.nsfw : false}
                  onCheckedChange={handleNsfw}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="leading- text-base font-semibold">Delete Account</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Warning: This action cannot be undone. This will permanently
              delete all your data, including images, comments, and profile
              information. You will not be able to recover your account.
            </p>
          </div>

          <form className="md:col-span-2" onSubmit={handlePasswordReset}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type={'button'} variant={'destructive'}>
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all your data, including images, comments, and profile
                      information. You will not be able to recover your account.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          className={
                            'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                          }
                          onClick={deleteAccountButton}
                        >
                          Delete Account
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
