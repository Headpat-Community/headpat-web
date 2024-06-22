'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { databases, Query, storage } from '@/app/appwrite-client'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'
import { useRouter } from 'next/navigation'
import { Gallery } from '@/utils/types/models'

export default function FetchGallery({ singleGallery }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userData, setUserData] = useState({
    name: singleGallery.name,
    imgAlt: singleGallery.imgAlt,
    nsfw: singleGallery.nsfw,
    createdAt: singleGallery.$createdAt,
    modifiedAt: singleGallery.$updatedAt,
    longText: singleGallery.longText,
  })

  const getGalleryImageUrl = (galleryId: string) => {
    if (!galleryId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/gallery/files/${galleryId}/view?project=6557c1a8b6c2739b3ecf`
  }

  const deleteImage = async () => {
    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split('/')
      const uniqueId = pathParts[3]
      setIsDeleting(true)

      const listDataResponse = databases.listDocuments(
        'hp_db',
        'gallery-images',
        [Query.equal('$id', uniqueId)]
      )

      listDataResponse.then(
        function (response: Gallery.GalleryType) {
          const documentId = response.documents[0].$id
          const imageId = response.documents[0].galleryId

          storage.deleteFile('gallery', imageId)
          databases.deleteDocument('hp_db', 'gallery-images', documentId)

          toast({
            title: 'Success',
            description: 'Image successfully deleted! Sending you back...',
          })
          setTimeout(() => {
            router.push('/account/gallery')
          }, 5000)
        },
        function (error) {
          console.error(error)
          Sentry.captureException(error)
          toast({
            title: 'Error',
            description: "Something went wrong, but don't worry, we are on it!",
            variant: 'destructive',
            security: 'true',
          })
          setIsDeleting(false)
        }
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: "You encountered an error. But don't worry, we're on it.",
        variant: 'destructive',
      })
      Sentry.captureException(error)
      setIsDeleting(false)
    }
  }

  const updateImage = async () => {
    setIsUploading(true)

    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split('/')
      const uniqueId = pathParts[3]

      // Create the form data
      const data = {
        name: (document.getElementById('imagename') as HTMLInputElement).value,
        imgAlt: (document.getElementById('imgalt') as HTMLInputElement).value,
        longText: (document.getElementById('longtext') as HTMLInputElement)
          .value,
        nsfw: (document.getElementById('nsfw') as HTMLInputElement).checked,
      }

      // Make the PATCH request
      await databases.updateDocument('hp_db', 'gallery-images', uniqueId, {
        name: data.name,
        imgAlt: data.imgAlt,
        longText: data.longText,
        nsfw: data.nsfw,
      })

      // Handle response and update state accordingly
    } catch (error) {
      toast({
        title: 'Error',
        description: "Something went wrong, but don't worry, we are on it!",
        variant: 'destructive',
      })
      setIsUploading(false)
    } finally {
      toast({
        title: 'Image updated',
        description: 'Your image info has been updated successfully!',
      })
      setIsUploading(false)
    }
  }

  return (
    <div className="flex-wrap items-center justify-center gap-4 p-8">
      <div className="mx-auto flex">
        <img
          src={getGalleryImageUrl(singleGallery.galleryId)}
          alt={singleGallery.imgAlt || 'Headpat Community Image'}
          className={`imgsinglegallery max-h-[1000px] object-contain rounded-lg`}
        />
      </div>

      <div className="mt-2 mb-12">
        <h2 className="text-base font-semibold leading-7 text-white">
          Information
        </h2>
        <p className="text-sm leading-6 text-gray-400">
          Everything with a asterisk (<span className="text-red-500">*</span>)
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
                name="imagename"
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
            <Label htmlFor="imgalt">Alternative info (SEO)</Label>
            <div className="mt-2">
              <Input
                type="text"
                name="imgalt"
                id="imgalt"
                value={userData.imgAlt}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    imgAlt: e.target.value,
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
            <div className="mt-2">
              <input
                type="checkbox"
                name="nsfw"
                id="nsfw"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={userData.nsfw} // Use userData.nsfw
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    nsfw: e.target.checked, // Set nsfw to true or false
                  })
                }
              />
            </div>
          </div>

          <div className="col-span-full">
            <Label htmlFor="longtext">Beschreibung</Label>
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

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            href={`/account/gallery`}
            className="text-sm font-semibold leading-6 text-white"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            value="Submit"
            disabled={isUploading || isDeleting} // Disable the button if isUploading is true
            onClick={updateImage} // Call the deleteImage function on click
          >
            {isUploading ? 'Uploading...' : 'Save'}{' '}
            {/* Show different text based on the upload state */}
          </Button>
          <Button
            type="submit"
            value="Submit"
            disabled={isDeleting || isUploading} // Disable the button if isUploading is true
            onClick={deleteImage} // Call the deleteImage function on click
          >
            {isDeleting ? 'Deleting...' : 'Delete'}{' '}
            {/* Show different text based on the upload state */}
          </Button>
        </div>
      </div>
    </div>
  )
}
