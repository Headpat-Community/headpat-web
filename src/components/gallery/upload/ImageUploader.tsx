'use client'
import React, { useRef, useState } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { centerAspectCrop, createBlob } from './uploadHelper'
import { toast } from 'sonner'
import { storage, ID } from '@/app/appwrite-client'

interface ImageUploaderProps {
  isUploading: boolean
  setIsUploading: (val: boolean) => void
  aspect: number
  maxSizeInBytes: number
  storageBucket: string
  currentImageId?: string
  getImageUrl: (id: string) => string | undefined
  onAfterUpload: (fileId: string, file: File) => Promise<void>
  onBeforeUpload?: (file: File) => Promise<boolean | void>
  label: string
  description: string
  recommendedResolution: string
  defaultImage?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isUploading,
  setIsUploading,
  aspect,
  maxSizeInBytes,
  storageBucket,
  currentImageId,
  getImageUrl,
  onAfterUpload,
  onBeforeUpload,
  label,
  description,
  recommendedResolution,
  defaultImage = '/logos/hp_logo_x512.webp'
}) => {
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

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > maxSizeInBytes) {
        toast.error(
          `File size exceeds the ${(maxSizeInBytes / 1024 / 1024).toFixed(1)} MB limit.`
        )
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      setOpen(true)
      setCrop(undefined)
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
    const formData = new FormData()
    formData.append('file', blob, name || 'Unnamed')
    try {
      const file = formData.get('file') as File
      setIsUploading(true)
      // Call onBeforeUpload if provided
      if (onBeforeUpload) {
        try {
          const result = await onBeforeUpload(file)
          if (result === false) {
            toast.error('Upload was cancelled.')
            setIsUploading(false)
            return
          }
        } catch {
          toast.error('Pre-upload check failed.')
          setIsUploading(false)
          return
        }
      }
      // Upload to Appwrite storage
      const fileData = await storage.createFile(
        storageBucket,
        ID.unique(),
        file
      )
      await onAfterUpload(fileData.$id, file)
      setImgSrc('')
      setOpen(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      toast.error('Failed to upload image.')
    } finally {
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

  return (
    <>
      <span>{label}</span>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(currentImageId) || defaultImage}
            alt="Preview"
            className="size-24 flex-none rounded-lg object-cover"
          />
          <div className={'space-y-2'}>
            <Input
              ref={fileInputRef}
              accept="image/*"
              className="rounded-md ring-1 ring-black/10 hover:bg-white/20 dark:ring-white/10"
              type="file"
              onChange={onSelectFile}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-900 dark:text-gray-400">
                {description}
              </p>
            </div>
            <p className="text-xs text-gray-900 dark:text-gray-400">
              {recommendedResolution}
            </p>
          </div>
        </div>
      </div>
      <div className={'flex'}>
        <AlertDialog onOpenChange={setOpen} open={open}>
          <AlertDialogContent className={'h-full lg:h-auto'}>
            <ScrollArea className={'h-[500px] lg:h-[700px]'}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Welcome to the custom crop tool
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please make sure your image is at least{' '}
                  {recommendedResolution.replace(
                    ' resolution recommended.',
                    ''
                  )}{' '}
                  for the best results.
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
                        transform: `scale(${scale}) rotate(${rotate}deg)`
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
                        height: completedCrop.height
                      }}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = ''
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
