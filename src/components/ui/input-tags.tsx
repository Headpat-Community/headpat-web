"use client";

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { Input, type InputProps } from './input'
import { cn } from '@/lib/utils'

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, maxLength, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("")

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ])
        onChange(Array.from(newDataPoints))
        setPendingDataPoint("")
      }
    }, [pendingDataPoint, onChange, value])

    const addPendingDataPoint = () => {
      if (pendingDataPoint.trim() !== "") {
        const newDataPoints = new Set([...value, pendingDataPoint.trim()])
        onChange(Array.from(newDataPoints))
        setPendingDataPoint("")
      }
    }

    return (
      <div
        className={cn(
          "has-[:focus-visible]:outline-none min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:ring-offset-neutral- items-center",
          className
        )}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary" className={"h-8"}>
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-3 w-3"
              onClick={() => {
                onChange(value.filter((i) => i !== item))
              }}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          className="flex-1 focus:ring-0 focus-visible:ring-0 active:ring-0 min-w-40"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              addPendingDataPoint()
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault()
              onChange(value.slice(0, -1))
            }
          }}
          {...props}
          ref={ref}
          maxLength={128}
        />
      </div>
    )
  }
)

InputTags.displayName = "InputTags";

export { InputTags };