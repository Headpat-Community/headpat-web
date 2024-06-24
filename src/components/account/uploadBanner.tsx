'use client'
import { useToast } from '@/components/ui/use-toast'
import { databases, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserData } from '@/utils/types/models'

export default function UploadBanner({
  isUploading,
  setIsUploading,
  userId,
  userData,
}) {
  const { toast } = useToast()

  const getBannerImageUrl = (profileBannerId: string) => {
    if (!profileBannerId) return
    const imageId = storage.getFileView('banners', `${profileBannerId}`)
    return imageId.href
  }

  const handleBannerChange = (event: any) => {
    const selectedFile = event.target.files[0]
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size exceeds 5MB. Please select a smaller image.',
        variant: 'destructive',
      })
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsDataURL(selectedFile)
    fileReader.onload = (event) => {
      const imgElement = document.getElementById(
        'banner-image'
      ) as HTMLImageElement
      if (typeof event.target.result === 'string') {
        imgElement.src = event.target.result
        const img = new Image()
        img.src = event.target.result
        //img.onload = () => {
        //  setSelectedFile(selectedFile)
        //}
      }
    }
  }

  const handleSubmitBanner = async (event: any) => {
    event.preventDefault()

    try {
      // Year-Month-Day (YYYY-MM-DD)

      setIsUploading(true) // Set isUploading to true before making the API call

      // Get the user's banner document
      const bannerDocument: UserData.UserDataDocumentsType =
        await databases.getDocument('hp_db', 'userdata', userId)
      // If the user already has an banner, delete it
      if (bannerDocument.profileBannerId) {
        // Delete the old banner
        await storage
          .deleteFile('banners', bannerDocument.profileBannerId)
          .catch((error) => {
            //console.error(error)
            Sentry.captureException('Failed to delete old banner.', error)
          })
      }

      // Upload the new banner
      const fileData = storage.createFile(
        'banners',
        bannerDocument.$id,
        (document.getElementById('banner-upload') as HTMLInputElement).files[0]
      )

      fileData.then(
        function (response) {
          // Update the user's bannerId
          databases.updateDocument('hp_db', 'userdata', userId, {
            profileBannerId: response.$id,
          })

          toast({
            title: 'Banner uploaded',
            description: 'Your banner has been uploaded successfully.',
          })
        },
        function (error) {
          if (error.type === 'storage_file_empty') {
            toast({
              title: 'Error',
              description: 'Missing file.',
              variant: 'destructive',
            })
          } else if (error.type === 'storage_invalid_file_size') {
            toast({
              title: 'Error',
              description:
                'The file size is either not valid or exceeds the maximum allowed size.',
              variant: 'destructive',
            })
          } else if (error.type === 'storage_file_type_unsupported') {
            toast({
              title: 'Error',
              description: 'The given file extension is not supported.',
              variant: 'destructive',
            })
          } else if (error.type === 'storage_invalid_file') {
            toast({
              title: 'Error',
              description:
                'The uploaded file is invalid. Please check the file and try again.',
              variant: 'destructive',
            })
          } else if (error.type === 'storage_device_not_found') {
            toast({
              title: 'Error',
              description: 'The requested storage device could not be found.',
              variant: 'destructive',
            })
          } else {
            toast({
              title: 'Error',
              description: 'Failed to upload banner.',
              variant: 'destructive',
            })
            Sentry.captureException(error)
          }
        }
      )

      setIsUploading(false)
    } catch (error) {
      setIsUploading(false)
      console.error(error)
      Sentry.captureException(error)
      toast({
        title: 'Error',
        description: 'Failed to upload banner.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <span>Banner image</span>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="banner-image"
            src={
              getBannerImageUrl(userData?.profileBannerId) ||
              '/logos/Headpat_Logo_web_512x512_240518-03.png'
            }
            alt="Banner"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
          />
          <div>
            <Input
              accept="image/*"
              className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/10 hover:bg-white/20 dark:ring-white/10"
              id="banner-upload"
              name="banner-upload"
              type="file"
              onChange={handleBannerChange}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-900 dark:text-gray-400">
                JPG, PNG or WebP. 5MB max.
              </p>
              <Button
                type="submit"
                onClick={handleSubmitBanner}
                disabled={isUploading}
                className={'mt-2'}
              >
                Submit
              </Button>
            </div>
            <p className="text-xs text-gray-900 dark:text-gray-400">
              1200x650 resolution recommended.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
