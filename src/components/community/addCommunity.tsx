'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ExecutionMethod, Models } from 'node-appwrite'
import { functions } from '@/app/appwrite-client'
import { useRouter } from 'next/navigation'
import { FunctionResponse } from '@/utils/types/models'

const communitySchema = z.object({
  name: z
    .string()
    .min(4, 'Name must be 4 characters or more')
    .max(64, 'Name must be 64 characters or less'),
  description: z
    .string()
    .max(4096, 'Description must be 4096 characters or less'),
  isPrivate: z.boolean(),
  nsfw: z.boolean()
})

export default function AddCommunity({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [communityData, setCommunityData] = React.useState({
    name: '',
    description: '',
    isPrivate: false,
    nsfw: false
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleClick = async () => {
    setIsSubmitting(true)
    const result = communitySchema.safeParse(communityData)
    if (!result.success) {
      result.error.issues.forEach((err) => {
        toast.error(err.message)
      })
      setIsSubmitting(false)
      return
    }

    const loadingToast = toast.loading('Creating community...')
    const data = await functions.createExecution(
      'community-endpoints',
      JSON.stringify(communityData),
      false,
      `/community/create`,
      ExecutionMethod.POST
    )
    const resultCreate: Models.Team<Models.Preferences> | FunctionResponse =
      JSON.parse(data.responseBody)

    if ('type' in resultCreate) {
      if (resultCreate.type === 'community_create_unauthorized') {
        toast.error(
          'You are not signed in. Please sign in to create a community.'
        )
        return
      } else if (resultCreate.type === 'community_create_no_name') {
        toast.success('No name provided for the community.')
      }
      toast.dismiss(loadingToast)
      setIsSubmitting(false)
    } else {
      toast.dismiss(loadingToast)
      toast.success('Community created successfully!')
      router.push(`/community/${resultCreate.$id}`)
    }
  }

  const handleClose = () => {
    setCommunityData({
      name: '',
      description: '',
      isPrivate: false,
      nsfw: false
    })
  }

  return (
    <AlertDialog onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create new community</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Ready to share your quirky interests with the world? Create a new
          community and start building your community today!
        </AlertDialogDescription>
        <div className={'space-y-4'}>
          <div>
            <Label>Name</Label>
            <Input
              maxLength={64}
              max={64}
              value={communityData.name}
              required
              onChange={(e) =>
                setCommunityData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              maxLength={4096}
              rows={8}
              value={communityData.description}
              className="resize-none"
              onChange={(e) =>
                setCommunityData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Is this community private?</Label>
            <Switch
              checked={communityData.isPrivate}
              onCheckedChange={() => {
                setCommunityData((prev) => ({
                  ...prev,
                  isPrivate: !prev.isPrivate
                }))
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Is this community NSFW?</Label>
            <Switch
              checked={communityData.nsfw}
              onCheckedChange={() => {
                setCommunityData((prev) => ({ ...prev, nsfw: !prev.nsfw }))
              }}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Button onClick={handleClick} disabled={isSubmitting}>
            Create
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
