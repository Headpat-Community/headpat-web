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
import { Input } from '@/components/ui/input'
import { databases } from '@/app/appwrite-client'
import { Location } from '@/utils/types/models'

export default function SettingsModal({
  openModal,
  setOpenModal,
  userStatus,
  setUserStatus,
  current,
}) {
  const saveStatus = async () => {
    try {
      await databases.updateDocument('hp_db', 'locations', current.$id, {
        status: userStatus.status,
        statusColor: userStatus.statusColor,
      })
    } catch (e) {
      console.error(e)
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
        <div className={'space-y-4'}>
          <div className="space-y-2">
            <Label id={'status'}>Status</Label>
            <Input
              id={'status'}
              value={userStatus?.status}
              onChange={(e) =>
                setUserStatus({ ...userStatus, status: e.target.value })
              }
              maxLength={40}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={'doNotDisturb'}
              checked={userStatus?.statusColor === 'red'}
              onCheckedChange={() =>
                setUserStatus((prev: Location.LocationDocumentsType) => ({
                  ...prev,
                  statusColor: prev.statusColor === 'red' ? 'green' : 'red',
                }))
              }
            />
            <Label
              id={'doNotDisturb'}
              onClick={() => {
                setUserStatus((prev: Location.LocationDocumentsType) => ({
                  ...prev,
                  statusColor: prev.statusColor === 'red' ? 'green' : 'red',
                }))
              }}
            >
              Do not disturb
            </Label>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={saveStatus}>Apply</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
