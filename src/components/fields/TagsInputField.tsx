'use client'
import React from 'react'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { InputTags } from '../ui/input-tags'

interface TagInputFieldProps {
  label: string
  description: string
  placeholder: string
  field: any
  error?: any
  maxLength?: number
}

const TagsInputField: React.FC<TagInputFieldProps> = ({
  label,
  description,
  placeholder,
  field,
  error,
  maxLength,
}) => {
  const handleTagsChange = (newTags: string[]) => {
    field.onChange(newTags)
  }

  return (
    <FormItem>
      <FormLabel>
        {label}
        {description && (
          <HoverCard openDelay={100} closeDelay={50}>
            <HoverCardTrigger>
              <span className="ml-2 text-gray-500">
                <Info className="inline-block h-4 w-4" />
              </span>
            </HoverCardTrigger>
            <HoverCardContent>{description}</HoverCardContent>
          </HoverCard>
        )}
      </FormLabel>
      <FormControl>
        <InputTags
          value={field.value || []} // Ensure it uses the value from the form state
          onChange={handleTagsChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </FormControl>
      {error && (
        <span className="text-sm text-red-500 dark:text-red-900">
          {error.message}
        </span>
      )}
    </FormItem>
  )
}

export default TagsInputField
