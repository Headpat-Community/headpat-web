import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface InputFieldProps {
  label: string
  description: string
  placeholder: string
  field: any
  type?: string
  className?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  description,
  placeholder,
  field,
  type = 'text',
  className,
}) => {
  const [inputValue, setInputValue] = useState<string>(field.value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    field.onChange(value)
  }

  return (
    <FormItem>
      <FormLabel>
        {label || 'Label'}
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
        <Input
          type={type}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          className={className}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default InputField
