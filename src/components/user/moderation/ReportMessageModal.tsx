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
import { Messaging } from '@/utils/types/models'
import { toast } from 'sonner'
import { reportUserProfile } from '@/utils/actions/user/reportUserProfile'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'

export default function ReportMessageModal({
  open,
  setOpen,
  message,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  message: Messaging.MessagesDocumentsType
}) {
  const [reportReason, setReportReason] = useState<string>('')
  const [otherReason, setOtherReason] = useState<string>('')

  const reportUser = async () => {
    try {
      const body = {
        reportedMessageId: message.$id,
        conversationId: message.conversationId,
        message: message.body,
        reason: reportReason === 'Other' ? otherReason : reportReason,
      }
      const data = await functions.createExecution(
        'moderation-endpoints',
        JSON.stringify(body),
        false,
        `/moderation/report/message`,
        ExecutionMethod.POST
      )
      const response = JSON.parse(data.responseBody)
      console.log(response)
      setOpen(false)
      if (response.type === 'report_success') {
        toast.success('Success', {
          description: 'Thanks for keeping the community safe!',
        })
        setReportReason('')
        setOtherReason('')
      } else if (response.type === 'report_error') {
        toast.error('An error occurred while reporting the message')
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occurred while reporting the message')
    }
  }

  function onLabelPress(label: string) {
    return () => {
      setReportReason(label)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={'w-full'}>
        <AlertDialogHeader>
          <AlertDialogTitle>Report message</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          What is the reason for reporting this message?
        </AlertDialogDescription>
        <div className={'z-50'}>
          <RadioGroup
            value={reportReason}
            onValueChange={setReportReason}
            className="gap-3"
          >
            <RadioGroupItemWithLabel
              value="Hate speech or discrimination"
              onLabelPress={onLabelPress('Hate speech or discrimination')}
            />
            <RadioGroupItemWithLabel
              value="Harassment or bullying"
              onLabelPress={onLabelPress('Harassment or bullying')}
            />
            <RadioGroupItemWithLabel
              value="Explicit sexual content"
              onLabelPress={onLabelPress('Explicit sexual content')}
            />
            <RadioGroupItemWithLabel
              value="Violence or threats"
              onLabelPress={onLabelPress('Violence or threats')}
            />
            <RadioGroupItemWithLabel
              value="Spam or scam"
              onLabelPress={onLabelPress('Spam or scam')}
            />
            <RadioGroupItemWithLabel
              value="Personal information"
              onLabelPress={onLabelPress('Personal information')}
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
    <div className={'flex gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label id={`label-for-${value}`} onClick={onLabelPress}>
        {value}
      </Label>
    </div>
  )
}
