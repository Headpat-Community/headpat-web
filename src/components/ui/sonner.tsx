'use client'

import { Toaster as Sonner } from 'sonner'
import React from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          error: [
            'border border-destructive text-destructive-foreground',
            'bg-linear-to-r from-destructive via-black to-black',
          ].join(' '),
          success: [
            'border border-primary dark:text-foreground text-background',
            'bg-linear-to-r from-primary via-black to-black',
          ].join(' '),
          loading: [
            'border dark:border-muted dark:text-foreground text-background',
            'bg-linear-to-r from-muted via-black to-black',
          ].join(' '),
        },
      }}
      icons={{
        error: <AlertCircle className="size-4" />,
        success: <CheckCircle className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
