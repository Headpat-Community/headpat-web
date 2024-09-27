'use client'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gallery } from '@/utils/types/models'
import { reportGalleryImage } from '@/utils/actions/moderation/reportGalleryImage'

export default function ReportGalleryModal({
  open,
  setOpen,
  image,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  image: Gallery.GalleryDocumentsType
}) {
  const [reportReason, setReportReason] = useState<string>('')
  const [otherReason, setOtherReason] = useState<string>('')

  const reportUser = async () => {
    try {
      const data = await reportGalleryImage({
        reportedGalleryId: image.$id,
        reason: reportReason === 'Other' ? otherReason : reportReason,
      })

      setOpen(false)
      if (data.type === 'report_success') {
        toast.success('Thanks for keeping the community safe!')
        setReportReason('')
        setOtherReason('')
      }
    } catch (e) {
      toast.error('Failed to report user. Please try again later.')
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
            <AlertDialogTitle>Report Image</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            What is the reason for reporting this image?
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
              <span className={'text-white'}>Report</span>
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
    <div className={'flex gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label id={`label-for-${value}`} onClick={onLabelPress}>
        {value}
      </Label>
    </div>
  )
}
