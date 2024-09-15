'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ShieldAlertIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Account, Gallery } from '@/utils/types/models'
import ReportGalleryModal from '@/components/gallery/moderation/ReportGalleryModal'

export default function ModerationModal({
  isOpen,
  setIsOpen,
  image,
  imagePrefs,
  current,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  image: Gallery.GalleryDocumentsType
  imagePrefs: Gallery.GalleryPrefsDocumentsType
  current: Account.AccountType
}) {
  const [reportGalleryModalOpen, setReportGalleryModalOpen] = useState(false)

  const handleReport = useCallback(() => {
    setIsOpen(false)
    setReportGalleryModalOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHide = async () => {
    console.log('test2')
  }

  return (
    <>
      <ReportGalleryModal
        image={image}
        open={reportGalleryModalOpen}
        setOpen={setReportGalleryModalOpen}
      />
      <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
        <AlertDialogTrigger asChild>
          <Button className={'text-center'} variant={'destructive'}>
            <ShieldAlertIcon color={'white'} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={'w-full'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Moderation</AlertDialogTitle>
            {current?.$id ? (
              <>
                <AlertDialogDescription>
                  What would you like to do?
                </AlertDialogDescription>
                <div className={'flex-row space-y-4'}>
                  <Button
                    className={'text-center flex w-full items-center'}
                    variant={'destructive'}
                    onClick={handleReport}
                  >
                    Report
                  </Button>
                  <Button
                    className={'text-center flex w-full items-center'}
                    variant={'destructive'}
                    onClick={handleHide}
                  >
                    {imagePrefs?.isHidden ? 'Unhide' : 'Hide'}
                  </Button>
                </div>
              </>
            ) : (
              <AlertDialogDescription>
                Please sign in to report or hide this image.
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className={'mt-8'}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
