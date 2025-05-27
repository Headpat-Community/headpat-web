'use client'

import { FunctionResponse } from '@/utils/types/models'
import { toast } from 'sonner'

type ToastHandlingProps = {
  response: FunctionResponse
  category: 'account' | 'products'
}

export function toastHandling({
  response,
  category
}: ToastHandlingProps): void {
  switch (category) {
    case 'account':
      switch (response.type) {
        case 'user_invalid_credentials':
          toast.error('E-Mail or Password incorrect.')
          break
        case 'user_blocked':
          toast.error('User is blocked.')
          break
        case 'user_oauth2_unauthorized':
          toast.error('OAuth2 not authorized.')
          break
        case 'user_session_already_exists':
          toast.error('Session already exists. Please logout first.')
          break
        default:
          console.error(response)
          toast.info('It seems that an error occurred')
      }
      break
    default:
      toast.error('Invalid toast handler category provided.')
  }
}
