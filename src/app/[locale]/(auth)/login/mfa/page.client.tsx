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
import { account } from '@/app/appwrite-client'

export default function MfaPageClient() {
  const { toast } = useToast()
  const router = useRouter()
  const [challengeId, setChallengeId] = useState('')
  const [needsMfa, setNeedsMfa] = useState(false)

  useEffect(() => {
    const checkMfa = async () => {
      try {
        const data = await account.get()
        console.log(data)
        router.push('/account')
      } catch (error) {
        if (error.type === 'general_unauthorized_scope') {
          router.push('/login')
        } else {
          setNeedsMfa(true)
        }
      }
    }
    checkMfa().then()
  })

  const createMfaCode = async () => {
    try {
      const data = await startMfaChallenge()
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
      await updateMfaChallenge(challengeId, otp)

      router.replace('/account')
    } catch (error) {
      if (error.type === 'user_invalid_token') {
        toast({
          title: 'Error',
          description:
            "Incorrect code. Please try again. If you're having trouble, please contact support.",
          variant: 'destructive',
        })
        return
      } else {
        toast({
          title: 'Error',
          description:
            "You encountered an error. But don't worry, we're on it.",
          variant: 'destructive',
        })
        Sentry.captureException(error)
        return
      }
    }
  }

  if (!needsMfa) {
    return (
      <div className="flex flex-1 justify-center items-center absolute inset-0">
        <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:bg-[#04050a]/85 dark:ring-white">
          <div className="mt-10">
            <div>
              <div className={'text-center'}>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                  Loading...
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-1 justify-center items-center absolute inset-0">
        {/* Add justify-center and items-center here */}
        <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:bg-[#04050a]/85 dark:ring-white">
          <div className="mt-10">
            <div>
              <div className={'text-center'}>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                  Please fill in your 2FA code
                </h2>
              </div>
              <div key="1" className="mx-auto max-w-4xl p-6 space-y-6">
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
                      return
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
