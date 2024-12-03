import React from 'react'
import { FormControl, FormLabel, FormItem } from '@/components/ui/form'
import { Tag, TagInput } from 'emblor'
import { Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface TagInputFieldProps {
  label: string
  description: string
  placeholder: string
  field: any
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  activeTagIndex: number | null
  setActiveTagIndex: React.Dispatch<React.SetStateAction<number | null>>
  error?: any
}

const TagsInputField: React.FC<TagInputFieldProps> = ({
  label,
  description,
  placeholder,
  field,
  tags,
  setTags,
  activeTagIndex,
  setActiveTagIndex,
  error,
}) => {
  const handleTagsChange = (newTags: Tag[]) => {
    const tagsText = newTags.map((tag) => tag.text)
    setTags(newTags) // Update the state with the new tags
    field.onChange(tagsText) // Ensure the form gets the array of strings
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
        <TagInput
          {...field}
          placeholder={placeholder}
          tags={tags} // tags is an array of Tag objects
          setTags={handleTagsChange} // Use handleTagsChange to update the state correctly
          activeTagIndex={activeTagIndex}
          setActiveTagIndex={setActiveTagIndex}
          styleClasses={{
            tag: { body: 'pl-2' },
            inlineTagsContainer: 'p-2',
            input: 'border-none my-2 focus:ring-0',
          }}
          borderStyle="none"
          animation="fadeIn"
        />
      </FormControl>
      {Array.isArray(error) &&
        error.map((err, index) => (
          <span key={index} className="text-sm text-red-500 dark:text-red-900">
            {err.message}
          </span>
        ))}
    </FormItem>
  )
}

export default TagsInputField
