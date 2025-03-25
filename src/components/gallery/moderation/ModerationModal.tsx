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
import {
  AccountPrefs,
  GalleryDocumentsType,
  GalleryPrefsDocumentsType,
} from '@/utils/types/models'
import ReportGalleryModal from '@/components/gallery/moderation/ReportGalleryModal'
import { ExecutionMethod } from 'node-appwrite'
import { functions } from '@/app/appwrite-client'
import { toast } from 'sonner'

export default function ModerationModal({
  isOpen,
  setIsOpen,
  image,
  imagePrefs,
  setImagePrefs,
  current,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  image: GalleryDocumentsType
  imagePrefs: GalleryPrefsDocumentsType
  setImagePrefs: (prefs: GalleryPrefsDocumentsType) => void
  current: AccountPrefs
}) {
  const [reportGalleryModalOpen, setReportGalleryModalOpen] = useState(false)

  const handleReport = useCallback(() => {
    setIsOpen(false)
    setReportGalleryModalOpen(true)
  }, [setIsOpen])

  const handleHide = async () => {
    const loadingToast = toast.loading(
      `${imagePrefs?.isHidden ? 'Unhiding' : 'Hiding'} image...`
    )
    try {
      const data = await functions.createExecution(
        'gallery-endpoints',
        JSON.stringify({
          galleryId: image.$id,
          isHidden: !imagePrefs?.isHidden,
        }),
        false,
        `/gallery/prefs`,
        ExecutionMethod.PUT
      )
      const response = JSON.parse(data.responseBody)
      toast.dismiss(loadingToast)
      if (response.code === 200) {
        toast.success(
          `${imagePrefs?.isHidden ? 'Unhidden' : 'Hidden'} image successfully`
        )
        setImagePrefs({ ...imagePrefs, isHidden: !imagePrefs?.isHidden })
        setIsOpen(false)
      } else {
        toast.error('Failed to hide image. Please try again later.')
      }
    } catch {
      toast.dismiss(loadingToast)
      toast.error(
        `Failed to ${imagePrefs?.isHidden ? 'unhide' : 'hide'} image. Please try again later.`
      )
    }
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
