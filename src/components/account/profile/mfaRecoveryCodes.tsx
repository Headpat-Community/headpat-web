import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { account } from '@/app/appwrite-client'
import { AuthenticationFactor } from 'appwrite'
import { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function MfaRecoveryCodes() {
  const [open, setOpen] = useState<boolean>(false)
  const [mfaMode, setMfaMode] = useState<string>('needsChallenge')
  const [challengeId, setChallengeId] = useState<string>('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const { toast } = useToast()

  const handleStartChallenge = async () => {
    if (mfaMode === 'needsChallenge') {
      const mfaRequestResult = await account.createMfaChallenge(
        AuthenticationFactor.Totp
      )

      if (mfaRequestResult) {
        setChallengeId(mfaRequestResult.$id)
        setMfaMode('challengeStarted')
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleGetRecoveryCodes = async (code: string) => {
    if (mfaMode === 'challengeStarted') {
      const mfaVerifyResult = await account.updateMfaChallenge(
        challengeId,
        code
      )

      let recoveryCodesResult = null
      if (mfaVerifyResult) {
        try {
          recoveryCodesResult = await account.updateMfaRecoveryCodes()
        } catch (error) {
          recoveryCodesResult = await account.createMfaRecoveryCodes()
        }
        setRecoveryCodes(recoveryCodesResult.recoveryCodes)
        setMfaMode('hasRecoveryCodes')
      } else {
        toast({
          title: 'Error',
          description: 'Invalid code. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogTrigger asChild>
          <Button
            type="submit"
            variant={'outline'}
            onClick={() => {
              setOpen(true)
              handleStartChallenge().catch((error) => {
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
            See Recovery Codes
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recovery Codes</AlertDialogTitle>
            <AlertDialogDescription>
              Save these codes in a safe place. You can use them to access your
              account if you lose your device.
            </AlertDialogDescription>
            <div className={'flex flex-col'}>
              {mfaMode === 'challengeStarted' && (
                <p>
                  Please enter the 6-digit code from your authenticator app.
                </p>
              )}
            </div>
            <div>
              {mfaMode === 'challengeStarted' && (
                <>
                  <InputOTP
                    maxLength={6}
                    onComplete={(result) => {
                      handleGetRecoveryCodes(result).catch((error) => {
                        toast({
                          title: 'Error',
                          description:
                            "Incorrect code. Please try again. If you're having trouble, please contact support.",
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
                </>
              )}
              {mfaMode === 'hasRecoveryCodes' && (
                <ScrollArea className="h-72 w-48 rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                      Tags
                    </h4>
                    {recoveryCodes.map((code, index) => (
                      <div key={index}>
                        <Separator className="my-2" />
                        <div className="text-sm">{code}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant={'outline'} onClick={() => setOpen(false)}>
                Close
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
