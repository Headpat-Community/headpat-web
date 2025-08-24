"use client"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MfaAlert from "@/components/account/profile/mfaAlert"
import * as Sentry from "@sentry/nextjs"
import type { Models } from "node-appwrite"
import { ExecutionMethod } from "node-appwrite"
import MfaRecoveryCodes from "@/components/account/profile/mfaRecoveryCodes"
import type { AccountPrefs, UserDataDocumentsType } from "@/utils/types/models"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getDocument } from "@/components/api/documents"
import { toast } from "sonner"
import { useUser } from "@/components/contexts/UserContext"
import { account, databases, functions } from "@/app/appwrite-client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import InputField from "@/components/fields/InputField"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info } from "lucide-react"

const emailFormSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password must be at most 128 characters long."),
})

const profileUrlFormSchema = z.object({
  profileUrl: z
    .string()
    .trim()
    .min(2, "Profile URL must be at least 3 characters long."),
})

const passwordFormSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(264, "Password must be at most 264 characters long."),
  newpassword: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(264, "Password must be at most 264 characters long."),
})

export default function GeneralAccountView({
  accountData,
  mfaList,
}: {
  accountData: AccountPrefs
  mfaList: Models.MfaFactors
}) {
  const [userMe, setUserMe] = useState(accountData)
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  const { setUser } = useUser()

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const profileUrlForm = useForm<z.infer<typeof profileUrlFormSchema>>({
    resolver: zodResolver(profileUrlFormSchema),
    defaultValues: {
      profileUrl: "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      newpassword: "",
    },
  })

  useEffect(() => {
    getDocument("hp_db", "userdata", accountData.$id)
      .then((data: UserDataDocumentsType) => setUserData(data))
      .catch(() => {
        // Sometimes the function is too slow and the data is not created yet
        window.location.reload()
      })
  }, [accountData])

  const handleEmailChange = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      await account.updateEmail(values.email, values.password)
      toast.success("E-Mail updated successfully.")
      setUserData((prevUserData: any) => ({
        ...prevUserData,
        email: userData.email,
      }))
    } catch (error) {
      if (error.type == "user_invalid_credentials") {
        toast.error("Password doesn't match.")
      } else if (error.type == "user_target_already_exists") {
        toast.error("Account already exists with this email.")
      } else {
        toast.error("Failed to update email. Please try again.")
        Sentry.captureException(error)
      }
    }
  }

  const handlePasswordReset = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    try {
      await account.updatePassword(values.newpassword, values.password)
      toast.success("Password updated successfully.")
    } catch (error) {
      if (error.type === "general_argument_invalid") {
        toast.error(
          "Password must be at least 8 characters long and cannot be a common password."
        )
        return
      } else if (error.code === 400) {
        toast.error(error.message)
      } else if (error.type === "user_invalid_credentials") {
        toast.error("Password doesn't match.")
      } else {
        toast.error("Failed to update password. Please try again.")
        passwordForm.reset({
          password: "",
          newpassword: "",
        })
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
      toast.success("NSFW updated successfully.")
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
        toast.error("Failed to update NSFW. Please try again.")
      }
    }
  }

  const handleIndex = async (checked: boolean) => {
    const prefs = userMe.prefs

    try {
      await account.updatePrefs({
        ...prefs,
        indexingEnabled: checked,
      })
      toast.success("Indexing updated successfully.")
      setUserMe((prevUserData: any) => ({
        ...prevUserData,
        prefs: {
          ...prevUserData.prefs,
          indexingEnabled: checked,
        },
      }))
      router.refresh()
    } catch (error) {
      if (error) {
        toast.error("Failed to update indexing. Please try again.")
      }
    }
  }

  const handleProfileUrlChange = async (
    values: z.infer<typeof profileUrlFormSchema>
  ) => {
    const promise = await databases.updateDocument(
      "hp_db",
      "userdata",
      userMe?.$id,
      {
        profileUrl: values.profileUrl,
      }
    )

    if (promise.type === "document_invalid_structure") {
      toast.error("Invalid structure.")
    } else if (promise.type === "document_missing_data") {
      toast.error("Missing data.")
    } else if (promise.type === "document_update_conflict") {
      toast("Cloud is newer than your local data. Please refresh.")
    } else {
      toast.success("Profile URL updated successfully.")
    }
  }

  const deleteAccountButton = async () => {
    try {
      await functions.createExecution(
        "user-endpoints",
        "",
        true,
        "/deleteAccount",
        ExecutionMethod.DELETE
      )
      await account.deleteSessions()

      setUser(null)
      toast.success("Account deleted successfully.")
      router.push("/")
    } catch {
      toast.error("Failed to delete account.")
    }
  }

  return (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">Change Email</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Change your email address.
            </p>
          </div>

          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailChange)}
              className="md:col-span-2"
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <InputField
                          label="E-Mail"
                          description="Your new email address."
                          placeholder=""
                          field={field}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={emailForm.control}
                      name="password"
                      render={({ field }) => (
                        <InputField
                          label={"Password"}
                          description={"Your current password."}
                          placeholder={""}
                          field={field}
                          type={"password"}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <Button type="submit" variant={"outline"}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">Profile URL</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Your Profile URL is the link that you can share with others to
              showcase your profile.
            </p>
          </div>

          <Form {...profileUrlForm}>
            <form
              onSubmit={profileUrlForm.handleSubmit(handleProfileUrlChange)}
            >
              <div className="md:col-span-2">
                <div>
                  <Label htmlFor="profileUrl">URL</Label>
                  <HoverCard openDelay={100} closeDelay={50}>
                    <HoverCardTrigger>
                      <span className="ml-2 text-gray-500">
                        <Info className="inline-block size-4" />
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className={"w-96"}>
                      This action cannot be undone. This will change your
                      profile URL to the one you entered. We will not redirect
                      the old URL to the new one.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <FormField
                  control={profileUrlForm.control}
                  name="profileUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-full flex items-center">
                      <div className="mt-2 w-full">
                        <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex rounded-md border focus-within:ring-[3px]">
                          <span className="dark:bg-input/30 flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                            headpat.place/user/
                          </span>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              id="profileurl"
                              required
                              placeholder={userData ? userData.profileUrl : ""}
                              className="w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 pl-1 !ring-0 focus:ring-0 sm:text-sm"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="mt-8 flex">
                  <Button type="submit" variant={"outline"}>
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="leading- text-base font-semibold">
              Change password
            </h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Change your password.
            </p>
          </div>

          <Form {...passwordForm}>
            <form
              className="md:col-span-2"
              onSubmit={passwordForm.handleSubmit(handlePasswordReset)}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <InputField
                        label={"Current password"}
                        description={"Your current password."}
                        placeholder={""}
                        field={field}
                        type={"password"}
                      />
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={passwordForm.control}
                    name="newpassword"
                    render={({ field }) => (
                      <InputField
                        label={"New password"}
                        description={"Your new password."}
                        placeholder={""}
                        field={field}
                        type={"password"}
                      />
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <Button type="submit" variant={"outline"}>
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="leading- text-base font-semibold">2FA / MFA</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Two-Factor-Authentication / Multi-Factor-Authentication
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex gap-4">
              <MfaAlert mfaList={mfaList} />
              {mfaList.totp && <MfaRecoveryCodes />}
            </div>
          </div>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">Enable NSFW</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Checking this box will enable NSFW content. 18+ only.
            </p>
            <p className="text-destructive text-sm leading-6">
              Anyone under the age of 18 caught having NSFW enabled will be
              suspended.
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <Checkbox
                id="nsfwtoggle"
                aria-describedby="nsfwtoggle"
                checked={userMe ? userMe.prefs.nsfw : false}
                onCheckedChange={handleNsfw}
              />
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">Index profile</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Checking this box will enable your profile to be indexed by search
              engines.
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <Checkbox
                id="indexingtoggle"
                aria-describedby="indexingtoggle"
                checked={userMe ? userMe.prefs.indexingEnabled : false}
                onCheckedChange={handleIndex}
              />
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="leading- text-base font-semibold">Delete Account</h4>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Warning: This action cannot be undone. This will permanently
              delete all your data, including images, comments, and profile
              information. You will not be able to recover your account.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type={"button"} variant={"destructive"}>
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
                          "bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
        </div>
      </div>
    </>
  )
}
