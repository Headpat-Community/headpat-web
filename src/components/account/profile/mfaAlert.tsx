import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { account, avatars } from '@/app/appwrite'
import { AuthenticatorType, Models } from 'appwrite'
import { useMemo, useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'

export default function MfaAlert() {
  const [open, setOpen] = useState<boolean>(false)
  const [mfaList, setMfaList] = useState<Models.MfaFactors>(null)
  const [mfaMode, setMfaMode] = useState<string>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const { toast } = useToast()

  useMemo(() => {
    const getMfaList = async () => {
      try {
        const mfaList = await account.listMfaFactors()
        console.log(mfaList)
        setMfaList(mfaList)
      } catch (error) {
        console.error(error)
        Sentry.captureException(error)
      }
    }

    getMfaList()
  }, [])

  const handleMfaAdd = async (mfaMode: string) => {
    if (mfaMode === 'totp') {
      const mfaRequestResult = await account.createMfaAuthenticator(
        AuthenticatorType.Totp
      )
      const qrCodeImage = avatars.getQR(mfaRequestResult.uri)
      setQrCodeImage(qrCodeImage.href)
    } else if (mfaMode === 'phone') {
      const mfaRequestResult = await account.createMfaAuthenticator(
        AuthenticatorType.Totp
      )
    }

    setMfaMode(mfaMode)
  }

  const handleMfaDelete = async (code: string) => {
    try {
      const mfaDeleteResult = await account.deleteMfaAuthenticator(
        AuthenticatorType.Totp,
        code
      )
      if (mfaDeleteResult) {
        toast({
          title: '2FA disabled',
          description: 'You have successfully disabled 2FA.',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleMfaVerify = async (code: string) => {
    try {
      const mfaVerifyResult = await account.updateMfaAuthenticator(
        AuthenticatorType.Totp, // type
        code // code
      )

      if (mfaVerifyResult) {
        toast({
          title: '2FA enabled',
          description: 'You have successfully enabled 2FA.',
        })
      }

      setOpen(false)
    } catch (error) {
      if (error.code === 401) {
        toast({
          title: 'Invalid code',
          description: 'The code you entered is invalid. Please try again.',
        })
      }
    }
  }

  return (
    <>
      <Toaster />
      <AlertDialog open={open}>
        <AlertDialogTrigger asChild>
          <Button
            type="submit"
            variant={'outline'}
            onClick={() => setOpen(true)}
          >
            Click to manage 2FA
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You are about to enable 2FA, great!
            </AlertDialogTitle>
            <p className={'text-sm text-muted-foreground'}>
              {mfaMode === 'totp'
                ? 'Please scan the QR code with your authenticator app and enter the code to enable 2FA.'
                : 'To enable 2FA, please select one of the following options.'}
            </p>
            <div className={'flex flex-col'}>
              {mfaList?.totp === false && !mfaMode && (
                <Button
                  className={'mt-4'}
                  onClick={async () => {
                    await handleMfaAdd('totp')
                  }}
                >
                  Enable OTP
                </Button>
              )}
              {mfaList?.phone === false && !mfaMode && (
                <Button
                  className={'mt-4'}
                  onClick={async () => {
                    await handleMfaAdd('phone')
                  }}
                >
                  Enable Phone
                </Button>
              )}
            </div>
            <div>
              {mfaMode === 'totp' && (
                <>
                  <img
                    src={qrCodeImage}
                    className={'h-64 w-auto mb-4'}
                    alt="QR Code"
                  />

                  <InputOTP
                    maxLength={6}
                    onComplete={(result) => {
                      console.log(result)
                      handleMfaVerify(result)
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
