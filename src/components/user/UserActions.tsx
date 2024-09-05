'use client'
import React, { Suspense, useCallback, useState } from 'react'
import { removeFollow } from '@/utils/actions/followers/removeFollow'
import { toast } from 'sonner'
import { addFollow } from '@/utils/actions/followers/addFollow'
import { Account, UserData } from '@/utils/types/models'
import {
  MailIcon,
  ShieldAlertIcon,
  UserMinusIcon,
  UserPlusIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { blockUser } from '@/utils/actions/user/blockUser'

const ReportUserModal = React.lazy(() => import('./moderation/ReportUserModal'))

interface UserActionsProps {
  userData: UserData.UserDataDocumentsType
  userPrefs: UserData.UserPrefsDocumentsType
  setUserPrefs: React.Dispatch<
    React.SetStateAction<UserData.UserPrefsDocumentsType>
  >
  isFollowing: boolean
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>
  current: Account.AccountType | null
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

  const handleFollow = useCallback(() => {
    if (isFollowing) {
      removeFollow(userData?.$id).then(() => {
        setIsFollowing(false)
        toast.success(`You have unfollowed ${userData?.displayName}.`)
      })
    } else {
      addFollow(userData?.$id).then(() => {
        setIsFollowing(true)
        toast.success(`You are now following ${userData?.displayName}.`)
      })
    }
  }, [isFollowing, setIsFollowing, userData?.$id, userData?.displayName])

  const handleMessage = useCallback(() => {
    toast('Ha! You thought this was a real button!')
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
      <Button className={'text-center'} onClick={handleFollow}>
        {isFollowing ? <UserMinusIcon /> : <UserPlusIcon />}
      </Button>
      <Button className={'text-center'} onClick={handleMessage}>
        <MailIcon />
      </Button>

      <AlertDialog
        onOpenChange={setModerationModalOpen}
        open={moderationModalOpen}
      >
        <AlertDialogTrigger asChild>
          <Button className={'text-center'} variant={'destructive'}>
            <ShieldAlertIcon color={'white'} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={'w-full'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Moderation</AlertDialogTitle>
            <AlertDialogDescription>
              What would you like to do?
            </AlertDialogDescription>
            <div className={'gap-4'}>
              <Button
                className={'text-center flex flex-row items-center'}
                variant={'destructive'}
                onClick={handleReport}
              >
                Report
              </Button>
              <Button
                className={'text-center flex flex-row items-center'}
                variant={'destructive'}
                onClick={handleBlockClick}
              >
                {userPrefs?.isBlocked ? 'Unblock' : 'Block'}
              </Button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className={'mt-8'}>
            <AlertDialogAction>Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UserActions
