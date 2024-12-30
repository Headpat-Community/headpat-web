import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CalendarIcon, Info } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'

interface DatetimeFieldProps {
  label: string
  description: string
  field: any
}

const DatetimeField: React.FC<DatetimeFieldProps> = ({
  label,
  description,
  field,
}) => {
  const [datetimeValue, setDatetimeValue] = useState(field.value || '')

  const handleChange = (e: string) => {
    setDatetimeValue(e)
    field.onChange(e)
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
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
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[230px] w-full justify-start text-left font-normal mt-2"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {datetimeValue ? (
                format(datetimeValue, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={datetimeValue}
              onSelect={(date) => handleChange(date.toISOString())}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default DatetimeField
