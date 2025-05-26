'use client'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function FiltersModal({
  openModal,
  setOpenModal,
  filters,
  setFilters
}) {
  return (
    <AlertDialog onOpenChange={setOpenModal} open={openModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Need to change filters?</AlertDialogTitle>
          <AlertDialogDescription>
            Please select the filters you want to apply.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className={'space-y-4'}>
          <div className="flex items-center gap-2">
            <Switch
              id={'showEvents'}
              checked={filters.showEvents}
              onCheckedChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  showEvents: !prev.showEvents
                }))
              }
            />
            <Label
              id={'showEvents'}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  showEvents: !prev.showEvents
                }))
              }}
            >
              Show events
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={'showMutuals'}
              checked={filters.showUsers}
              onCheckedChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  showUsers: !prev.showUsers
                }))
              }
            />
            <Label
              id={'showMutuals'}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  showUsers: !prev.showUsers
                }))
              }
            >
              Show Users
            </Label>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
