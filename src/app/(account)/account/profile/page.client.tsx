'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ErrorMessage, SuccessMessage } from '@/components/alerts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { account, databases } from '@/app/appwrite-client'
import { useGetUser } from '@/utils/getUserData'
import MfaAlert from '@/components/account/profile/mfaAlert'

export default function AccountPage() {
  const [error, setError] = useState<string>(null)
  const [success, setSuccess] = useState<string>(null)
  const { userMe, setUserMe, userData } = useGetUser()

  const handleEmailChange = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    try {
      const email = (document.getElementById('email') as HTMLInputElement).value
      const email_password = (
        document.getElementById('email_password') as HTMLInputElement
      ).value

      // Check if profileUrl has at least 4 characters
      if (email_password.length < 8 || email_password.length > 256) {
        setError('Please enter a valid password with at least 8 characters.')
        setTimeout(() => {
          setError(null)
        }, 5000)
        return
      }

      const promise = account.updateEmail(email, email_password)

      promise.then(
        function () {
          setSuccess('E-Mail updated successfully.')
        },
        function (error) {
          console.log(error?.code) // Failure
          if (error.code === 401) {
            setError('Password is incorrect.')
            setTimeout(() => {
              setError(null)
            }, 5000)
          }
          if (error.code === 409) {
            setError('Account already exists with this email.')
            setTimeout(() => {
              setError(null)
            }, 5000)
          }
        }
      )
    } catch (error) {
      console.error(error)
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
      setError('Password must be at least 8 characters long.')
      setTimeout(() => {
        setError(null)
      }, 5000)
      return
    }

    try {
      const promise = account.updatePassword(newPassword, currentPassword)

      promise.then(
        function () {
          setSuccess('Passwort erfolgreich geändert.')
          setTimeout(() => {
            setSuccess(null)
          }, 5000)
          target.reset()
        },
        function (error) {
          console.log(error) // Failure
          if (error.code === 400) {
            setError(error.message)
            setTimeout(() => {
              setError(null)
            }, 5000)
          } else if (error.code === 401) {
            setError("Password doesn't match.")
            setTimeout(() => {
              setError(null)
            }, 5000)
          } else {
            setError(error.message)
            setTimeout(() => {
              setError(null)
            }, 5000)
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleNsfw = async (checked: boolean) => {
    try {
      const prefs = userMe.prefs
      const putResponse = account.updatePrefs({
        ...prefs,
        nsfw: checked,
      })

      putResponse.then(
        function (response: any) {
          console.log(response) // Success
          setSuccess('NSFW updated successfully.')
          setUserMe((prevUserData: any) => ({
            ...prevUserData,
            prefs: {
              ...prevUserData.prefs,
              nsfw: checked,
            },
          }))
        },
        function (error: any) {
          console.log(error) // Failure
          setError('Failed to update NSFW. Please try again.')
        }
      )

      setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleProfileUrlChange = async (event: any) => {
    event.preventDefault()

    try {
      const profileUrl = (
        document.getElementById('profileurl') as HTMLInputElement
      ).value

      // Check if profileUrl has at least 4 characters
      if (profileUrl.length < 3) {
        setError('Profile URL must be at least 4 characters long.')
        setTimeout(() => {
          setError(null)
        }, 5000)
        return
      }

      const promise = databases.updateDocument(
        'hp_db',
        'userdata',
        userMe?.$id,
        {
          profileUrl: profileUrl,
        }
      )

      promise.then(
        function (response) {
          console.log(response) // Success
          setSuccess('Profile URL updated successfully.')
          event.target.reset() // Reset the form
        },
        function (error) {
          console.log(error) // Failure
          setError('An error occurred. Please try again later.')
        }
      )

      setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
    } catch (error) {
      console.error(error)
    }
  }

  const secondaryNavigation = [
    { name: 'Account', href: '/account', current: true },
    { name: 'Frontpage', href: '/account/profile/frontpage', current: false },
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
                    placeholder={userMe ? userMe.email : ''}
                    autoComplete={'email'}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <Label htmlFor="password">Current Password</Label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 dark:ring-white/10">
                    <Input
                      type="password"
                      name="email_password"
                      id="email_password"
                      required
                      autoComplete="current-password"
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

          <form onSubmit={handleProfileUrlChange} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="username">URL</Label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-background ring-1 ring-offset-background ring-inset focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 dark:ring-white/10">
                    <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                      https://headpat.de/user/
                    </span>
                    <Input
                      type="text"
                      name="profileurl"
                      id="profileurl"
                      required
                      placeholder={userData ? userData.profileUrl : ''}
                      className="border-0 pl-0 align-middle bg-transparent ml-1 focus:ring-0 focus:outline-none focus:border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
                      minLength={4}
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
            <h2 className="leading- text-base font-semibold">
              Change password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Ändere dein Passwort.
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
            <div className="col-span-full">
              <MfaAlert />
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
      </div>
    </>
  )
}
