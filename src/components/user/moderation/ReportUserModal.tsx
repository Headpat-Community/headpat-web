import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { UserData } from '@/utils/types/models'
import { toast } from 'sonner'
import { reportUserProfile } from '@/utils/actions/user/reportUserProfile'

export default function ReportUserModal({
  open,
  setOpen,
  user,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  user: UserData.UserDataDocumentsType
}) {
  const [reportReason, setReportReason] = useState<string>('')
  const [otherReason, setOtherReason] = useState<string>('')

  const reportUser = async () => {
    try {
      const data = await reportUserProfile({
        reportedUserId: user.$id,
        reason: reportReason === 'Other' ? otherReason : reportReason,
      })
      setOpen(false)
      if (data.type === 'report_success') {
        toast.success('Success', {
          description: 'Thanks for keeping the community safe!',
        })
        setReportReason('')
        setOtherReason('')
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occurred while reporting the user')
    }
  }

  function onLabelPress(label: string) {
    return () => {
      setReportReason(label)
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className={'w-full'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Report {user?.displayName}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            What is the reason for reporting this user?
          </AlertDialogDescription>
          <div className={'z-50'}>
            <RadioGroup
              value={reportReason}
              onValueChange={setReportReason}
              className="gap-3"
            >
              <RadioGroupItemWithLabel
                value="Inappropriate content"
                onLabelPress={onLabelPress('Inappropriate content')}
              />
              <RadioGroupItemWithLabel
                value="Spam"
                onLabelPress={onLabelPress('Spam')}
              />
              <RadioGroupItemWithLabel
                value="Harassment"
                onLabelPress={onLabelPress('Harassment')}
              />
              <RadioGroupItemWithLabel
                value="Impersonation"
                onLabelPress={onLabelPress('Impersonation')}
              />
              <RadioGroupItemWithLabel
                value="Other"
                onLabelPress={onLabelPress('Other')}
              />
              {reportReason === 'Other' && (
                <Input
                  placeholder="Please specify"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              )}
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              className={'bg-destructive'}
              onClick={reportUser}
              disabled={
                !reportReason || (reportReason === 'Other' && !otherReason)
              }
            >
              Report
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string
  onLabelPress: () => void
}) {
  return (
    <div className={'flex-row gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label>{value}</Label>
    </div>
  )
}
