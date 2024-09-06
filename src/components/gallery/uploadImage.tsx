'use client'
import React, { useRef, useState } from 'react'
import { databases, ID, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/navigation'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function UploadPage({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [selectedFileInput, setSelectedFileInput] = useState<string>(null)
  const [selectedFile, setSelectedFile] = useState<File>(null)
  const fileInputRef = useRef(null)
  const [data, setData] = useState({
    name: '',
    longText: '',
    nsfw: false,
  })

  const maxSizeInBytes = 8 * 1024 * 1024 // 8 MB

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      let file: any = event.target.files[0]

      if (file.type.includes('image/gif' || 'video')) {
        if (file.size > maxSizeInBytes) {
          toast.error('File size exceeds the 8 MB limit.')
          if (fileInputRef.current) {
            fileInputRef.current.value = '' // Reset the input field
          }
          return
        }

        setSelectedFile(file)
        setSelectedFileInput(URL.createObjectURL(file))
        return
      }

      file = await imageCompression(file, {
        maxSizeMB: 0.5,
        alwaysKeepResolution: true,
        useWebWorker: true,
        onProgress: (progress) => {
          setProgress(progress)
        },
      })
        .then((compressedFile) => {
          console.log('compressedFile', compressedFile)
          if (compressedFile.size > maxSizeInBytes) {
            toast.error('File size exceeds the 8 MB limit.')
            if (fileInputRef.current) {
              fileInputRef.current.value = '' // Reset the input
            }
            return
          }
          return compressedFile
        })
        .catch((error) => {
          console.error('Error compressing file:', error)
          toast.error('Error compressing file.')
          return
        })

      const imgSrc = await imageCompression.getDataUrlFromFile(file)
      const compressedFile = await imageCompression.getFilefromDataUrl(
        imgSrc,
        file.name
      )

      // Convert Blob back to a File object
      const newFile = new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: file.lastModified,
      })

      setSelectedFileInput(imgSrc)
      setSelectedFile(newFile)
    } else {
      toast.error('No file selected.')
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      let file = event.dataTransfer.files[0]
      console.log(file)

      if (file.type.includes('image/gif' || 'video')) {
        if (file.size > maxSizeInBytes) {
          toast.error('File size exceeds the 8 MB limit.')
          if (fileInputRef.current) {
            fileInputRef.current.value = '' // Reset the input field
          }
          return
        }

        setSelectedFile(file)
        setSelectedFileInput(URL.createObjectURL(file))
        return
      }

      try {
        file = await imageCompression(file, {
          maxSizeMB: 0.5,
          alwaysKeepResolution: true,
          useWebWorker: true,
          onProgress: (progress) => {
            setProgress(progress)
          },
        })
      } catch (error) {
        console.error('Error compressing file:', error)
        toast.error('Error compressing file.')
        return
      }

      if (file.size > maxSizeInBytes) {
        toast.error('File size exceeds the 8 MB limit.')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Reset the input field
        }
        return
      }

      const imgSrc = await imageCompression.getDataUrlFromFile(file)
      const compressedFile = await imageCompression.getFilefromDataUrl(
        imgSrc,
        file.name
      )

      // Convert Blob back to a File object
      const newFile = new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: file.lastModified,
      })

      setSelectedFileInput(imgSrc)
      setSelectedFile(newFile)
    } else {
      toast.error('No file dropped.')
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.nativeEvent.stopImmediatePropagation() // Use the native event to stop propagation
    fileInputRef.current.click()
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (selectedFile.size > maxSizeInBytes) {
      toast.error('File size exceeds the 8 MB limit.')
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Reset the input field
      }
      return
    }

    try {
      setIsUploading(true) // Set isUploading to true before making the API call

      console.log('Uploading file:', selectedFile)
      const fileData = storage.createFile('gallery', ID.unique(), selectedFile)

      fileData.then(
        function (fileDataResponse) {
          const postDocument = databases.createDocument(
            'hp_db',
            'gallery-images',
            fileDataResponse.$id,
            {
              name: data.name,
              longText: data.longText,
              nsfw: data.nsfw,
              galleryId: fileDataResponse.$id,
              mimeType: fileDataResponse.mimeType,
              userId: userId,
            }
          )

          postDocument.then(
            function () {
              toast.success(
                "Thanks for sharing your image with us. It's now live!"
              )
              router.push({
                pathname: `/gallery/[galleryId]`,
                params: { galleryId: fileDataResponse.$id },
              })
            },
            function (error) {
              console.log(error) // Failure
              storage.deleteFile('gallery', fileDataResponse.$id)
              Sentry.captureException(error)
              toast.error(
                "You encountered an error. But don't worry, we're on it."
              )
              setIsUploading(false)
            }
          )
        },
        function (error) {
          console.log(error) // Failure
          Sentry.captureException(error)
          toast.error("You encountered an error. But don't worry, we're on it.")
          setIsUploading(false)
        }
      )
    } catch (error) {
      console.error(error)
      Sentry.captureException(error)
      toast.error("You encountered an error. But don't worry, we're on it.")
      setIsUploading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold leading-7">Image Upload</h2>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              This information will be displayed publicly so be careful what you
              share.
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        id="selected-image"
                        className="mx-auto h-96 min-w-full rounded-md object-contain cursor-pointer"
                        alt="Placeholder Image"
                        src={
                          selectedFileInput ||
                          '/images/placeholder-image-color.webp'
                        } // Fallback to a placeholder if selectedFileInput is null
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

          {/* Progress bar */}
          {progress !== 0 && progress !== 100 && (
            <div className={'border-b border-white/10 pb-8'}>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className={'border-b border-white/10 pb-8'}>
            <div className="flex text-sm leading-6 text-gray-400 items-center">
              <Label>Supported:</Label>
              <p className="pl-1">
                PNG, JPEG, GIF, SVG, TIFF, ICO, DVU up to 8MB
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
                  <Input
                    type="text"
                    name="imagename"
                    id="imagename"
                    required
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label>NSFW</Label>
                <div className="mt-2">
                  <Checkbox
                    name="nsfw"
                    id="nsfw"
                    onCheckedChange={(checked) =>
                      setData({ ...data, nsfw: checked === true })
                    }
                  />
                </div>
              </div>

              <div className="col-span-full">
                <Label htmlFor="biostatus">Description</Label>
                <div className="relative mt-2">
                  <Textarea
                    id="longtext"
                    name="longtext"
                    onChange={(e) =>
                      setData({ ...data, longText: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="submit"
            disabled={isUploading} // Disable the button if isUploading is true
          >
            {isUploading ? 'Uploading...' : 'Save'}{' '}
            {/* Show different text based on the upload state */}
          </Button>
        </div>
      </form>
    </>
  )
}
