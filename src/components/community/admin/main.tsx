'use client'
import { databases } from '@/app/appwrite-client'
import { useCallback, useEffect, useState } from 'react'
import UploadAvatar from '@/components/community/uploadAvatar'
import UploadBanner from '@/components/community/uploadBanner'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { CommunityDocumentsType } from '@/utils/types/models'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import InputField from '@/components/fields/InputField'
import TextareaField from '@/components/fields/TextareaField'

const formSchema = z.object({
  name: z
    .string()
    .min(4, 'Name must be 4 characters or more')
    .max(32, 'Name must be 32 characters or less'),
  description: z
    .string()
    .trim()
    .max(4096, 'Description must be 4096 characters or less')
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  status: z
    .string()
    .trim()
    .max(24, 'Status must be 24 characters or less')
    .nullable()
    .transform((val) => (val === '' ? null : val)),
})

type FormValues = z.infer<typeof formSchema>

export default function CommunityAdminMain({
  community,
}: {
  community: CommunityDocumentsType
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [communityData, setCommunityData] =
    useState<CommunityDocumentsType | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: '',
    },
  })

  const getCommunity = useCallback(async () => {
    const data: CommunityDocumentsType = await databases.getDocument(
      'hp_db',
      'community',
      community.$id
    )
    setCommunityData(data)
    // Update form values when we get the data
    form.reset({
      name: data.name,
      description: data.description,
      status: data.status,
    })
  }, [community.$id, form])

  useEffect(() => {
    getCommunity().then(() => setIsLoading(false))
  }, [community, getCommunity])

  const onSubmit = async (values: FormValues) => {
    const loadingToast = toast.loading('Updating community data...')
    try {
      const dataToUpdate = {
        name: values.name,
        description: values.description || null,
        status: values.status || null,
      }
      await databases.updateDocument(
        'hp_db',
        'community',
        community.$id,
        dataToUpdate
      )
      toast.success('Community data updated successfully.')
    } catch (error) {
      Sentry.captureException(error)
      toast.error('Error updating community data. Please try again later.')
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h4 className="text-base font-semibold leading-7">
              General Settings
            </h4>
            <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-gray-400">
              Update your community&apos;s general settings.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="md:col-span-2"
            >
              <UploadAvatar
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                communityData={communityData}
              />
              <div className={'my-4'} />
              <UploadBanner
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                communityData={communityData}
              />

              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <InputField
                        label="Display Name"
                        description="The name of your community"
                        placeholder="Enter community name"
                        field={field}
                        maxLength={32}
                      />
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <TextareaField
                        label="Description"
                        description="Describe your community"
                        placeholder="Enter community description"
                        field={field}
                        resizable={false}
                      />
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <InputField
                        label="Status"
                        description="Current status of your community"
                        placeholder="Enter community status"
                        field={field}
                        maxLength={24}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mt-8 flex">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
