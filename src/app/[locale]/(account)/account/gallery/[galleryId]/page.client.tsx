'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { databases, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { Gallery } from '@/utils/types/models'
import { Link, useRouter } from '@/i18n/routing'
import { getGalleryImageUrlView } from '@/components/getStorageItem'
import { getDocument } from '@/components/api/documents'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

export default function FetchGallery({ singleGallery, galleryId }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userData, setUserData] = useState({
    name: singleGallery?.name,
    nsfw: singleGallery?.nsfw,
    createdAt: singleGallery?.$createdAt,
    modifiedAt: singleGallery?.$updatedAt,
    longText: singleGallery?.longText,
  })

  const deleteImage = async () => {
    try {
      // Get the ID from the URL
      setIsDeleting(true)

      const listDataResponse = getDocument(
        'hp_db',
        'gallery-images',
        `${galleryId}`
      )

      listDataResponse.then(
        function (response: Gallery.GalleryDocumentsType) {
          const documentId = response.$id
          const imageId = response.galleryId

          storage.deleteFile('gallery', imageId)
          databases.deleteDocument('hp_db', 'gallery-images', documentId)

          toast.success('Success', {
            description: 'Image successfully deleted! Sending you back...',
          })
          setTimeout(() => {
            router.push('/gallery')
          }, 3000)
        },
        function (error) {
          console.error(error)
          Sentry.captureException(error)
          toast.error('Error', {
            description: "Something went wrong, but don't worry, we are on it!",
          })
          setIsDeleting(false)
        }
      )
    } catch (error) {
      toast.error('Error', {
        description: "You encountered an error. But don't worry, we're on it.",
      })
      Sentry.captureException(error)
      setIsDeleting(false)
    }
  }

  const updateImage = async () => {
    setIsUploading(true)

    try {
      // Make the PATCH request
      await databases.updateDocument('hp_db', 'gallery-images', galleryId, {
        name: userData.name,
        longText: userData.longText,
        nsfw: userData.nsfw,
      })

      // Handle response and update state accordingly
    } catch (error) {
      toast.error('Error', {
        description: "Something went wrong, but don't worry, we are on it!",
      })
      setIsUploading(false)
    } finally {
      toast.success('Image updated', {
        description: 'Your image info has been updated successfully!',
      })
      setIsUploading(false)
    }
  }

  return (
    <div className="flex-wrap items-center justify-center gap-4 p-8">
      <div className="mx-auto flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getGalleryImageUrlView(singleGallery.galleryId)}
          alt={singleGallery.name || 'Headpat Community Image'}
          className={`imgsinglegallery max-h-[1000px] object-contain rounded-lg`}
        />
      </div>

      <div className="mt-2 mb-12">
        <h2 className="text-base font-semibold leading-7 text-white">
          Information
        </h2>
        <p className="text-sm leading-6 text-gray-400">
          Everything with an asterisk (<span className="text-red-500">*</span>)
          is required.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label htmlFor="imagename">
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                id="imagename"
                required
                value={userData.name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="createdAt">Created at</Label>
            <div className="mt-2">
              <Input
                type={'date'}
                value={new Date(userData.createdAt).toISOString().split('T')[0]}
                disabled
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="modifiedAt">Last updated</Label>
            <div className="mt-2">
              <Input
                type={'date'}
                value={
                  new Date(userData.modifiedAt).toISOString().split('T')[0]
                }
                disabled
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <Label htmlFor="nsfw">NSFW</Label>
            <div className="mt-2 flex">
              <Checkbox
                id="nsfw"
                checked={userData.nsfw}
                onCheckedChange={(e) =>
                  setUserData({
                    ...userData,
                    nsfw: e,
                  })
                }
              />
            </div>
          </div>

          <div className="col-span-full">
            <Label htmlFor="longtext">Description</Label>
            <div className="relative mt-2">
              <Textarea
                id="longtext"
                name="longtext"
                value={userData.longText || ''}
                maxLength={256}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    longText: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-x-6 justify-between">
          <div className="flex items-center gap-x-6">
            <Button variant={'link'} asChild>
              <Link
                href={{
                  pathname: '/gallery/[galleryId]',
                  params: {
                    galleryId: galleryId,
                  },
                }}
                className="text-sm font-semibold leading-6 text-white"
              >
                Go to image
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-x-6">
            <Button
              type="button"
              value="Submit"
              disabled={isUploading || isDeleting}
              onClick={updateImage}
            >
              {isUploading ? 'Uploading...' : 'Save'}{' '}
            </Button>
            <Button
              type="button"
              variant={'destructive'}
              disabled={isDeleting || isUploading}
              onClick={deleteImage}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}{' '}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
