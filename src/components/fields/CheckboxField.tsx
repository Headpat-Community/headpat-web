import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { CheckedState } from '@radix-ui/react-checkbox'

interface CheckboxFieldProps {
  label: string
  description: string
  field: any
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  description,
  field,
}) => {
  const [checked, setChecked] = useState<CheckedState>(field.value || false)

  const handleChange = (e: CheckedState) => {
    setChecked(e)
    field.onChange(e)
  }

  return (
    <FormItem>
      <div className="flex flex-col gap-3">
        <FormLabel>
          {label || 'Label'}
          {description && (
            <HoverCard openDelay={100} closeDelay={50}>
              <HoverCardTrigger>
                <span className="ml-2 text-gray-500">
                  <Info className="inline-block size-4" />
                </span>
              </HoverCardTrigger>
              <HoverCardContent>{description}</HoverCardContent>
            </HoverCard>
          )}
        </FormLabel>
        <FormControl>
          <Checkbox
            checked={checked}
            onCheckedChange={(e) => handleChange(e)}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  )
}

export default CheckboxField
