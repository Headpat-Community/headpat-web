import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface TextareaFieldProps {
  label: string
  description: string
  placeholder: string
  field: any
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  description,
  placeholder,
  field,
}) => {
  const [textareaValue, setTextareaValue] = useState(field.value || '')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value)
    field.onChange(e)
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
        <Textarea
          placeholder={placeholder}
          value={textareaValue}
          onChange={handleChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TextareaField
