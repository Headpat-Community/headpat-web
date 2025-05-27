'use client'

import { Toaster as Sonner } from 'sonner'
import React from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'p-4 rounded-md w-fit min-w-[360px] max-w-[420px] flex items-center gap-3 relative text-sm',
          error:
            'border border-destructive text-destructive-foreground bg-linear-to-r from-destructive via-black to-black items-center',
          success:
            'border border-primary dark:text-foreground text-background bg-linear-to-r from-primary via-black to-black items-center',
          loading:
            'border dark:border-muted dark:text-foreground text-background bg-linear-to-r from-loading via-black to-black items-center'
        }
      }}
      icons={{
        error: <AlertCircle className="size-4" />,
        success: <CheckCircle className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />
      }}
      {...props}
    />
  )
}

export { Toaster }
