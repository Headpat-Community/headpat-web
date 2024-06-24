'use client'
import * as Sentry from '@sentry/nextjs'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useToast } from '@/components/ui/use-toast'
import {
  startMfaChallenge,
  updateMfaChallenge,
} from '@/utils/actions/account/account'
import { useEffect, useState } from 'react'
import { useRouter } from '@/navigation'

export default function MfaPageClient() {
  const { toast } = useToast()
  const router = useRouter()
  const [challengeId, setChallengeId] = useState('')

  const createMfaCode = async () => {
    try {
      const data = await startMfaChallenge()
      console.log(data)
      setChallengeId(data.$id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    createMfaCode().then()
  }, [])

  const handleMfaVerify = async (otp: string) => {
    try {
      const data = await updateMfaChallenge(challengeId, otp)

      router.push('/account')
    } catch (error) {
      if (error.type === 'user_invalid_token') {
        toast({
          title: 'Error',
          description:
            "Incorrect code. Please try again. If you're having trouble, please contact support.",
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description:
            "You encountered an error. But don't worry, we're on it.",
          variant: 'destructive',
        })
        Sentry.captureException(error)
      }
    }
  }

  return (
    <InputOTP
      maxLength={6}
      onComplete={(result) => {
        handleMfaVerify(result).catch((error) => {
          console.log(error)
          toast({
            title: 'Error',
            description:
              "You encountered an error. But don't worry, we're on it.",
            variant: 'destructive',
          })
          Sentry.captureException(error)
        })
      }}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
