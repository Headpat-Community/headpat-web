'use client'
import React, { useRef, useState } from 'react'
import { databases, ID, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { encode } from 'blurhash'

export default function UploadPage({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [selectedFileInput, setSelectedFileInput] = useState<string>(null)
  const [selectedFile, setSelectedFile] = useState<File>(null)
  const [blurHash, setBlurHash] = useState<string>(null)
  const fileInputRef = useRef(null)
  const [data, setData] = useState({
    name: '',
    longText: '',
    nsfw: false,
  })

  const maxSizeInBytes = 8 * 1024 * 1024 // 8 MB

  const generateBlurHash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Set canvas size to a small value for blurhash
        canvas.width = 32
        canvas.height = 32

        // Draw and scale image to fit canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Generate blurhash
        const hash = encode(
          imageData.data,
          canvas.width,
          canvas.height,
          4, // componentX
          4 // componentY
        )
        resolve(hash)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]

      // Handle GIFs and videos separately without compression
      if (file.type.includes('image/gif') || file.type.includes('video')) {
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
        // Compress the image first
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 8,
          alwaysKeepResolution: true,
          useWebWorker: true,
          onProgress: (progress) => {
            setProgress(progress)
          },
        })

        // Then check the size
        if (compressedFile.size > maxSizeInBytes) {
          toast.error(
            'File size exceeds the 8 MB limit even after compression.'
          )
          if (fileInputRef.current) {
            fileInputRef.current.value = '' // Reset the input
          }
          return
        }

        const imgSrc = await imageCompression.getDataUrlFromFile(compressedFile)
        const finalFile = await imageCompression.getFilefromDataUrl(
          imgSrc,
          file.name
        )

        // Convert Blob back to a File object
        const newFile = new File([finalFile], file.name, {
          type: finalFile.type,
          lastModified: file.lastModified,
        })

        // Generate blurhash for the image
        const hash = await generateBlurHash(newFile)
        setBlurHash(hash)

        setSelectedFileInput(imgSrc)
        setSelectedFile(newFile)
      } catch (error) {
        console.error('Error compressing file:', error)
        toast.error('Error compressing file.')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Reset the input
        }
      }
    } else {
      toast.error('No file selected.')
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]

      // Handle GIFs and videos separately without compression
      if (file.type.includes('image/gif') || file.type.includes('video')) {
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
        // Compress the image first
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 5,
          alwaysKeepResolution: true,
          useWebWorker: true,
          onProgress: (progress) => {
            setProgress(progress)
          },
        })

        // Then check the size
        if (compressedFile.size > maxSizeInBytes) {
          toast.error(
            'File size exceeds the 8 MB limit even after compression.'
          )
          if (fileInputRef.current) {
            fileInputRef.current.value = '' // Reset the input field
          }
          return
        }

        const imgSrc = await imageCompression.getDataUrlFromFile(compressedFile)
        const finalFile = await imageCompression.getFilefromDataUrl(
          imgSrc,
          file.name
        )

        // Convert Blob back to a File object
        const newFile = new File([finalFile], file.name, {
          type: finalFile.type,
          lastModified: file.lastModified,
        })

        // Generate blurhash for the image
        const hash = await generateBlurHash(newFile)
        setBlurHash(hash)

        setSelectedFileInput(imgSrc)
        setSelectedFile(newFile)
      } catch (error) {
        console.error('Error compressing file:', error)
        toast.error('Error compressing file.')
      }
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
              blurHash: blurHash, // Add blurhash to the document
            }
          )

          postDocument.then(
            function () {
              toast.success(
                "Thanks for sharing your image with us. It's now live!"
              )
              router.push(`/gallery/${fileDataResponse.$id}`)
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
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold leading-7">Image Upload</h4>
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
                    <Label>
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
                    aria-label="Gallery upload"
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
            <h4 className="text-base font-semibold leading-7">Informationen</h4>
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
            {isUploading ? 'Uploading...' : 'Save'}
            {/* Show different text based on the upload state */}
          </Button>
        </div>
      </form>
    </div>
  )
}
