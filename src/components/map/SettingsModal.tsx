'use client'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { databases } from '@/app/appwrite-client'
import { LocationDocumentsType } from '@/utils/types/models'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField } from '@/components/ui/form'
import InputField from '@/components/fields/InputField'
import { Button } from '../ui/button'
import * as Sentry from '@sentry/nextjs'

const settingsFormSchema = z.object({
  status: z.string().max(40, 'Status must be less than 40 characters'),
  statusColor: z.enum(['red', 'green']),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  userStatus: LocationDocumentsType
  setUserStatus: (status: LocationDocumentsType) => void
  current: { $id: string }
}

export default function SettingsModal({
  openModal,
  setOpenModal,
  userStatus,
  setUserStatus,
  current,
}: SettingsModalProps) {
  const defaultStatusColor = userStatus?.statusColor === 'red' ? 'red' : 'green'

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      status: userStatus?.status,
      statusColor: defaultStatusColor,
    },
  })

  const onSubmit = async (values: SettingsFormValues) => {
    console.log(values)
    try {
      await databases.updateDocument('hp_db', 'locations', current.$id, {
        status: values.status,
        statusColor: values.statusColor,
      })
      setUserStatus({
        ...userStatus,
        status: values.status,
        statusColor: values.statusColor,
      })
      setOpenModal(false)
    } catch (e) {
      console.error(e)
      Sentry.captureException(e)
    }
  }

  return (
    <AlertDialog onOpenChange={setOpenModal} open={openModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>What are you up to?</AlertDialogTitle>
          <AlertDialogDescription>
            Let others know what you are up to. You can always change this
            later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <InputField
                  label="Status"
                  description="Your current status"
                  placeholder="What are you up to?"
                  field={field}
                  maxLength={40}
                />
              )}
            />
            <FormField
              control={form.control}
              name="statusColor"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="doNotDisturb"
                    checked={field.value === 'red'}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? 'red' : 'green')
                    }
                  />
                  <Label htmlFor="doNotDisturb">Do not disturb</Label>
                </div>
              )}
            />
            <AlertDialogFooter>
              <Button type="submit">Apply</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
