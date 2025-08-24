"use client"
import React, { Suspense, useCallback, useState } from "react"
import { removeFollow } from "@/utils/actions/followers/removeFollow"
import { toast } from "sonner"
import { addFollow } from "@/utils/actions/followers/addFollow"
import {
  MailIcon,
  ShieldAlertIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { blockUser } from "@/utils/actions/user/blockUser"
import type {
  AccountPrefs,
  UserDataDocumentsType,
  UserPrefsDocumentsType,
} from "@/utils/types/models"
import { useQueryClient } from "@tanstack/react-query"

const ReportUserModal = React.lazy(() => import("./moderation/ReportUserModal"))

interface UserActionsProps {
  userData: UserDataDocumentsType
  userPrefs: UserPrefsDocumentsType
  setUserPrefs: React.Dispatch<React.SetStateAction<UserPrefsDocumentsType>>
  isFollowing: boolean
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>
  current: AccountPrefs | null
}

const UserActions = ({
  userData,
  userPrefs,
  setUserPrefs,
  isFollowing,
  setIsFollowing,
  current,
}: UserActionsProps) => {
  const [moderationModalOpen, setModerationModalOpen] = useState(false)
  const [reportUserModalOpen, setReportUserModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleFollow = useCallback(() => {
    if (isFollowing) {
      removeFollow(userData?.$id).then(() => {
        setIsFollowing(false)
        toast.success(`You have unfollowed ${userData?.displayName}.`)
        // Invalidate the user query to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["user", userData?.$id] })
        // Also invalidate the users list to update follower counts
        queryClient.invalidateQueries({ queryKey: ["users"] })
      })
    } else {
      addFollow(userData?.$id).then(() => {
        setIsFollowing(true)
        toast.success(`You are now following ${userData?.displayName}.`)
        // Invalidate the user query to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["user", userData?.$id] })
        // Also invalidate the users list to update follower counts
        queryClient.invalidateQueries({ queryKey: ["users"] })
      })
    }
  }, [
    isFollowing,
    setIsFollowing,
    userData?.$id,
    userData?.displayName,
    queryClient,
  ])

  const handleMessage = useCallback(() => {
    toast("Ha! You thought this was a real button!")
  }, [])

  const handleReport = useCallback(() => {
    setModerationModalOpen(false)
    setReportUserModalOpen(true)
  }, [])

  const handleBlockClick = useCallback(() => {
    setModerationModalOpen(false)
    blockUser({
      userId: userData?.$id,
      isBlocked: !userPrefs?.isBlocked,
    }).then((response) => {
      setUserPrefs(response)
      toast.success(
        userPrefs?.isBlocked
          ? `You have unblocked ${userData?.displayName}.`
          : `You have blocked ${userData?.displayName}.`
      )
    })
  }, [userData?.$id, userData?.displayName, userPrefs?.isBlocked, setUserPrefs])

  if (current?.$id === userData?.$id) return null

  return (
    <>
      <Suspense>
        <ReportUserModal
          open={reportUserModalOpen}
          setOpen={setReportUserModalOpen}
          user={userData}
        />
      </Suspense>
      <Button className={"text-center"} onClick={handleFollow}>
        {isFollowing ? <UserMinusIcon /> : <UserPlusIcon />}
      </Button>
      <Button className={"text-center"} onClick={handleMessage}>
        <MailIcon />
      </Button>

      <AlertDialog
        onOpenChange={setModerationModalOpen}
        open={moderationModalOpen}
      >
        <AlertDialogTrigger asChild>
          <Button className={"text-center"} variant={"destructive"}>
            <ShieldAlertIcon color={"white"} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={"w-full"}>
          <AlertDialogHeader>
            <AlertDialogTitle>Moderation</AlertDialogTitle>
            <AlertDialogDescription>
              What would you like to do?
            </AlertDialogDescription>
            <div className={"gap-4"}>
              <Button
                className={"flex flex-row items-center text-center"}
                variant={"destructive"}
                onClick={handleReport}
              >
                Report
              </Button>
              <Button
                className={"flex flex-row items-center text-center"}
                variant={"destructive"}
                onClick={handleBlockClick}
              >
                {userPrefs?.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className={"mt-8"}>
            <AlertDialogAction>Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UserActions
