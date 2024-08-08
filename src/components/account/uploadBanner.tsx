'use client'
import React, { useState, useRef } from 'react'

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from '../gallery/upload/canvasPreview'
import { useDebounceEffect } from '../gallery/upload/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { databases, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
import { UserData } from '@/utils/types/models'
import * as Sentry from '@sentry/nextjs'
import {
  centerAspectCrop,
  createBlob,
} from '@/components/gallery/upload/uploadHelper'
import { unstable_noStore } from 'next/cache'

export default function UploadBanner({
  isUploading,
  setIsUploading,
  userId,
  userData,
}) {
  unstable_noStore()
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [open, setOpen] = useState(false)
  const scale = 1
  const rotate = 0
  const aspect = 4.8

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const maxSizeInBytes = 5 * 1024 * 1024 // 5 MB

      if (file.size > maxSizeInBytes) {
        toast.error('File size exceeds the 5 MB limit.')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Reset the input field
        }
        return
      }

      setOpen(true)
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      )
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
    const blob = await createBlob(imgRef, previewCanvasRef, completedCrop)

    // Upload the blob to your server or storage service
    const formData = new FormData()
    formData.append('file', blob, 'image.png')

    try {
      const file = formData.get('file') as File
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
        `${bannerDocument.$id}`,
        file
      )

      fileData.then(
        function (response) {
          // Update the user's bannerId
          databases.updateDocument('hp_db', 'userdata', userId, {
            profileBannerId: response.$id,
          })

          toast.success('Your banner has been uploaded successfully.')
          setImgSrc(getBannerImageUrl(response.$id)) // Update the image source
        },
        function (error) {
          if (error.type === 'storage_file_empty') {
            toast('Missing file.')
          } else if (error.type === 'storage_invalid_file_size') {
            toast(
              'The file size is either not valid or exceeds the maximum allowed size.'
            )
          } else if (error.type === 'storage_file_type_unsupported') {
            toast('The given file extension is not supported.')
          } else if (error.type === 'storage_invalid_file') {
            toast(
              'The uploaded file is invalid. Please check the file and try again.'
            )
          } else if (error.type === 'storage_device_not_found') {
            toast.error('The requested storage device could not be found.')
          } else {
            toast.error('Failed to upload banner.')
            Sentry.captureException(error)
          }
        }
      )

      setIsUploading(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload banner.')
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

  const getBannerImageUrl = (profileBannerId: string) => {
    if (!profileBannerId) return
    const imageId = storage.getFileView('banners', `${profileBannerId}`)
    return imageId.href
  }

  return (
    <>
      <span>Banner image</span>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              getBannerImageUrl(userData?.profileBannerId) ||
              '/logos/Headpat_Logo_web_512x512_240518-03.png'
            }
            alt="Banner"
            className="h-24 w-24 flex-none rounded-lg object-cover"
          />
          <div>
            <Input
              ref={fileInputRef}
              accept="image/*"
              className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/10 hover:bg-white/20 dark:ring-white/10"
              type="file"
              onChange={onSelectFile}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-900 dark:text-gray-400">
                JPG, PNG or WebP. 5MB max.
              </p>
              <Button
                type="button"
                onClick={onUploadCropClick}
                disabled={isUploading}
                className={'mt-2'}
              >
                Submit
              </Button>
            </div>
            <p className="text-xs text-gray-900 dark:text-gray-400">
              1200x250 resolution recommended.
            </p>
          </div>
        </div>
      </div>

      <div className={'flex'}>
        <AlertDialog onOpenChange={(open) => setOpen(open)} open={open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Welcome to the custom crop tool
              </AlertDialogTitle>
              <AlertDialogDescription>
                Please make sure your image is at least 1200x250 resolution for
                the best results.
              </AlertDialogDescription>
            </AlertDialogHeader>
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
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
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
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  fileInputRef.current.value = '' // Reset the input field
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onUploadCropClick}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
