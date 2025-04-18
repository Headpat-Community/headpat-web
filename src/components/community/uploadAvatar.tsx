'use client'
import React, { useRef, useState } from 'react'

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from '../gallery/upload/canvasPreview'
import { useDebounceEffect } from '../gallery/upload/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { databases, functions, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

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
import * as Sentry from '@sentry/nextjs'
import {
  centerAspectCrop,
  createBlob,
} from '@/components/gallery/upload/uploadHelper'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExecutionMethod, ID } from 'node-appwrite'

export default function UploadAvatar({
  isUploading,
  setIsUploading,
  communityData,
}) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [type, setType] = useState('image/png')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const scale = 1
  const rotate = 0
  const aspect = 1
  const maxSizeInBytes = 1024 * 1024 // 1 MB

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      setOpen(true)
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      )
      setType(file.type)
      setName(file.name)
      reader.readAsDataURL(file)
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  async function onUploadCropClick() {
    const blob = await createBlob(imgRef, previewCanvasRef, completedCrop, type)
    const loadingToast = toast.loading('Uploading avatar...')

    // Upload the blob to your server or storage service
    const formData = new FormData()
    formData.append('file', blob, name || 'Unnamed')

    try {
      const file = formData.get('file') as File

      if (file.size > maxSizeInBytes) {
        toast.dismiss(loadingToast)
        toast.error('File size exceeds the 1 MB limit.')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Reset the input field
        }
        return
      }

      setIsUploading(true)

      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community/upload?communityId=${communityData.$id}&type=avatar`,
        ExecutionMethod.POST
      )
      const response = JSON.parse(data.responseBody)

      if (response.type === 'community_upload_missing_id') {
        toast.error('Community ID is missing. Please try again later.')
        return toast.dismiss(loadingToast)
      } else if (response.type === 'unauthorized') {
        toast.error('You are not authorized to upload.')
        return toast.dismiss(loadingToast)
      } else if (response.type === 'community_upload_missing_type') {
        toast.error('Missing upload type. Please try again later.')
        return toast.dismiss(loadingToast)
      }

      // Upload the new avatar
      const fileData = storage.createFile(
        'community-avatars',
        ID.unique(),
        file
      )

      fileData.then(
        async function (response) {
          // Update the user's avatarId
          await databases.updateDocument(
            'hp_db',
            'community',
            communityData.$id,
            {
              avatarId: response.$id,
            }
          )

          toast.dismiss(loadingToast)
          toast.success('Your avatar has been uploaded successfully.')
          setImgSrc(getAvatarImageUrl(response.$id))

          await functions.createExecution(
            'community-endpoints',
            '',
            true,
            `/community/upload/finish?communityId=${communityData.$id}`,
            ExecutionMethod.POST
          )
          window.location.reload()
        },
        function (error) {
          toast.dismiss(loadingToast)
          if (error.type === 'storage_file_empty') {
            toast.error('Missing file.')
          } else if (error.type === 'storage_invalid_file_size') {
            toast.error(
              'The file size is either not valid or exceeds the maximum allowed size.'
            )
          } else if (error.type === 'storage_file_type_unsupported') {
            toast.error('The given file extension is not supported.')
          } else if (error.type === 'storage_invalid_file') {
            toast.error(
              'The uploaded file is invalid. Please check the file and try again.'
            )
          } else if (error.type === 'storage_device_not_found') {
            toast.error('The requested storage device could not be found.')
          } else {
            toast.error('Failed to upload avatar.')
            Sentry.captureException(error)
          }
        }
      )

      setIsUploading(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload avatar.')
      setIsUploading(false)
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        await canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        )
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  const getAvatarImageUrl = (galleryId: string) => {
    if (!galleryId) return
    return storage.getFileView('community-avatars', `${galleryId}`)
  }

  return (
    <>
      <span>Avatar image</span>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              getAvatarImageUrl(communityData?.avatarId) ||
              '/logos/hp_logo_x512.webp'
            }
            alt="Avatar"
            className="h-24 w-24 flex-none rounded-lg object-cover"
          />
          <div className={'space-y-2'}>
            <Input
              ref={fileInputRef}
              accept="image/*"
              className="rounded-md px-3 py-2 text-sm font-semibold shadow-xs ring-1 ring-black/10 hover:bg-white/20 dark:ring-white/10"
              type="file"
              onChange={onSelectFile}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-900 dark:text-gray-400">
                JPG, PNG or WebP. 1MB max.
              </p>
            </div>
            <p className="text-xs text-gray-900 dark:text-gray-400">
              512x512 resolution recommended.
            </p>
          </div>
        </div>
      </div>

      <div className={'flex'}>
        <AlertDialog onOpenChange={(open) => setOpen(open)} open={open}>
          <AlertDialogContent className={'h-full lg:h-auto'}>
            <ScrollArea className={'h-[500px] lg:h-[700px]'}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Welcome to the custom crop tool
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please make sure your image is at least 512x512 resolution for
                  the best results.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div>
                {!!imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    maxHeight={750}
                    keepSelection={true}
                    className={''}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                )}
                {!!completedCrop && (
                  <div className={'hidden'}>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: '1px solid black',
                        objectFit: 'contain',
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  fileInputRef.current.value = '' // Reset the input field
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onUploadCropClick}
                disabled={isUploading}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
