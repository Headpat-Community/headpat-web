'use client'
import React, { useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { databases, ID, storage } from '@/app/appwrite-client'
import { useGetUser } from '@/utils/getUserData'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/navigation'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const { userMe } = useGetUser()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    setSelectedFile(file)

    reader.onload = function (e) {
      const img = document.getElementById('selected-image') as HTMLImageElement
      img.src = e.target.result as string
    }

    reader.readAsDataURL(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    setSelectedFile(file)

    reader.onload = function (e) {
      const img = document.getElementById('selected-image') as HTMLImageElement
      img.src = e.target.result as string
    }

    reader.readAsDataURL(file)
  }

  const handleClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.nativeEvent.stopImmediatePropagation() // Use the native event to stop propagation
    fileInputRef.current.click()
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsUploading(true) // Set isUploading to true before making the API call

      const fileData = storage.createFile('gallery', ID.unique(), selectedFile)

      fileData.then(
        function (fileDataResponse) {
          const postDocument = databases.createDocument(
            'hp_db',
            'gallery-images',
            fileDataResponse.$id,
            {
              name: (document.getElementById('imagename') as HTMLInputElement)
                .value,
              imgAlt: (document.getElementById('imgalt') as HTMLInputElement)
                .value,
              longText: (
                document.getElementById('longtext') as HTMLInputElement
              ).value,
              nsfw: (document.getElementById('nsfw') as HTMLInputElement)
                .checked,
              galleryId: fileDataResponse.$id,
              userId: userMe.$id,
            }
          )

          postDocument.then(
            function () {
              toast({
                title: 'Success!',
                description:
                  "Thanks for sharing your image with us. It's now live!",
              })
              router.push({
                pathname: `/account/gallery/[galleryId]`,
                params: { galleryId: fileDataResponse.$id },
              })
            },
            function (error) {
              console.log(error) // Failure
              storage.deleteFile('gallery', fileDataResponse.$id)
              Sentry.captureException(error)
              toast({
                title: 'Error',
                description:
                  "You encountered an error. But don't worry, we're on it.",
                variant: 'destructive',
              })
              setIsUploading(false)
            }
          )
        },
        function (error) {
          console.log(error) // Failure
          Sentry.captureException(error)
          toast({
            title: 'Error',
            description:
              "You encountered an error. But don't worry, we're on it.",
            variant: 'destructive',
          })
          setIsUploading(false)
        }
      )
    } catch (error) {
      console.error(error)
      Sentry.captureException(error)
      toast({
        title: 'Error',
        description: "You encountered an error. But don't worry, we're on it.",
        variant: 'destructive',
      })
      setIsUploading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="pb-12">
            <h2 className="text-base font-semibold leading-7">Image Upload</h2>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              Diese Informationen werden öffentlich angezeigt. Sei also
              vorsichtig, was du teilst.
            </p>

            <div className="mt-10 grid">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6"
                >
                  Cover photo
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-black/25 px-6 py-10 dark:border-white/25 relative cursor-pointer"
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleClick}
                >
                  <div className="text-center">
                    <Label className="rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">
                      <img
                        id="selected-image"
                        className="mx-auto h-96 min-w-full rounded-md object-contain cursor-pointer"
                        alt="Placeholder Image"
                        src="/images/placeholder-image-color.webp"
                      />
                    </Label>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only bg-transparent"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={'border-b border-white/10 pb-8'}>
            <div className="flex text-sm leading-6 text-gray-400">
              <Label htmlFor="file-upload"></Label>
              <p className="pl-1">
                PNG, JPEG, GIF, SVG, TIFF, ICO, DVU up to 16MB
              </p>
            </div>
          </div>

          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7">Informationen</h2>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              Alles mit ein asterisk (<span className="text-red-500">*</span>)
              ist nötig.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  <Input type="text" name="imagename" id="imagename" required />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label>Alternative Informationen (SEO)</Label>
                <div className="mt-2">
                  <Input type="text" name="imgalt" id="imgalt" />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label>NSFW</Label>
                <div className="mt-2">
                  <Checkbox name="nsfw" id="nsfw" />
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="biostatus">Description</Label>
                <div className="relative mt-2">
                  <Textarea id="longtext" name="longtext" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6">
            Cancel
          </button>
          <button
            type="submit"
            value="Submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            disabled={isUploading} // Disable the button if isUploading is true
          >
            {isUploading ? 'Uploading...' : 'Save'}{' '}
            {/* Show different text based on the upload state */}
          </button>
        </div>
      </form>
    </>
  )
}
