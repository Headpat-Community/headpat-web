"use client"
import { databases } from "@/app/appwrite-client"
import InputField from "@/components/fields/InputField"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { LocationDocumentsType } from "@/utils/types/models"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Sentry from "@sentry/nextjs"
import React, { memo, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const settingsFormSchema = z.object({
  status: z.string().max(40, "Status must be less than 40 characters"),
  statusColor: z.enum(["red", "green"]),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  userStatus: LocationDocumentsType
  setUserStatus: (status: LocationDocumentsType) => void
  current: { $id: string }
}

// Memoized form fields to prevent unnecessary re-renders
const StatusFormField = memo(function StatusFormField({
  control,
}: {
  control: any
}) {
  return (
    <FormField
      control={control}
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
  )
})

const StatusColorFormField = memo(function StatusColorFormField({
  control,
}: {
  control: any
}) {
  return (
    <FormField
      control={control}
      name="statusColor"
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Switch
            id="doNotDisturb"
            checked={field.value === "red"}
            onCheckedChange={(checked) =>
              field.onChange(checked ? "red" : "green")
            }
          />
          <Label htmlFor="doNotDisturb">Do not disturb</Label>
        </div>
      )}
    />
  )
})

const SettingsModal = memo(function SettingsModal({
  openModal,
  setOpenModal,
  userStatus,
  setUserStatus,
  current,
}: SettingsModalProps) {
  // Memoize default values to prevent unnecessary recalculations
  const defaultValues = useMemo(
    () => ({
      status: userStatus?.status || "",
      statusColor: (userStatus?.statusColor === "red" ? "red" : "green") as
        | "red"
        | "green",
    }),
    [userStatus?.status, userStatus?.statusColor]
  )

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  // Memoize form submission handler to prevent unnecessary re-renders
  const onSubmit = useCallback(
    async (values: SettingsFormValues) => {
      try {
        await databases.updateRow({
          databaseId: "hp_db",
          tableId: "locations",
          rowId: current.$id,
          data: {
            status: values.status,
            statusColor: values.statusColor,
          },
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
    },
    [current.$id, setUserStatus, setOpenModal, userStatus]
  )

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
            <StatusFormField control={form.control} />
            <StatusColorFormField control={form.control} />
            <AlertDialogFooter>
              <Button type="submit">Apply</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
})

export default SettingsModal
