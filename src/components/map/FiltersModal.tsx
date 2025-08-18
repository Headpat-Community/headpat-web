'use client'
import React, { useCallback, memo } from 'react'
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

interface FiltersModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  filters: {
    showEvents: boolean
    showUsers: boolean
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      showEvents: boolean
      showUsers: boolean
    }>
  >
}

// Memoized filter toggle handlers to prevent unnecessary re-renders
const FilterToggleHandlers = memo(function FilterToggleHandlers({
  filters,
  setFilters
}: {
  filters: { showEvents: boolean; showUsers: boolean }
  setFilters: React.Dispatch<
    React.SetStateAction<{ showEvents: boolean; showUsers: boolean }>
  >
}) {
  const handleEventsToggle = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      showEvents: !prev.showEvents
    }))
  }, [setFilters])

  const handleUsersToggle = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      showUsers: !prev.showUsers
    }))
  }, [setFilters])

  return (
    <div className={'space-y-4'}>
      <div className="flex items-center gap-2">
        <Switch
          id={'showEvents'}
          checked={filters.showEvents}
          onCheckedChange={handleEventsToggle}
        />
        <Label id={'showEvents'} onClick={handleEventsToggle}>
          Show events
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id={'showMutuals'}
          checked={filters.showUsers}
          onCheckedChange={handleUsersToggle}
        />
        <Label id={'showMutuals'} onClick={handleUsersToggle}>
          Show Users
        </Label>
      </div>
    </div>
  )
})

const FiltersModal = memo(function FiltersModal({
  openModal,
  setOpenModal,
  filters,
  setFilters
}: FiltersModalProps) {
  return (
    <AlertDialog onOpenChange={setOpenModal} open={openModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Need to change filters?</AlertDialogTitle>
          <AlertDialogDescription>
            Please select the filters you want to apply.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FilterToggleHandlers filters={filters} setFilters={setFilters} />
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

export default FiltersModal
