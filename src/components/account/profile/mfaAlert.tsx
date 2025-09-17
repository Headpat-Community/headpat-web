import { account, avatars } from "@/app/appwrite-client"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import * as Sentry from "@sentry/nextjs"
import { AuthenticationFactor, AuthenticatorType } from "appwrite"
import type { Models } from "appwrite"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function MfaAlert({ mfaList }: { mfaList: Models.MfaFactors }) {
  const [open, setOpen] = useState<boolean>(false)
  const [mfaMode, setMfaMode] = useState<string>("")
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const router = useRouter()

  const handleMfaAdd = async (mfaMode: string) => {
    if (mfaMode === "totp") {
      const mfaRequestResult = await account.createMfaAuthenticator(
        AuthenticatorType.Totp
      )
      const qrCodeImage = avatars.getQR(mfaRequestResult.uri)
      setQrCodeImage(qrCodeImage)
    }

    setMfaMode("totpEnable")
  }

  const handleMfaDelete = async (code: string) => {
    try {
      const createChallengeResult = await account.createMfaChallenge(
        AuthenticationFactor.Totp
      )
      await account.updateMfaChallenge(createChallengeResult.$id, code)

      const mfaDeleteResult = await account.deleteMfaAuthenticator({
        type: AuthenticatorType.Totp,
      })
      if (mfaDeleteResult) {
        toast.success("You have successfully disabled 2FA.")
        await account.updateMFA(false)
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      toast.error("You encountered an error. But don't worry, we're on it.")
      Sentry.captureException(error)
    }
  }

  const handleMfaVerify = async (code: string) => {
    try {
      const mfaVerifyResult = await account.updateMfaAuthenticator(
        AuthenticatorType.Totp, // type
        code // code
      )

      if (mfaVerifyResult) {
        toast.success("You have successfully enabled 2FA.")
        await account.updateMFA(true)
        router.refresh()
      }

      setMfaMode("totpFinished")
      setOpen(false)
    } catch (error: any) {
      if (error.code === 401) {
        toast.error("The code you entered is invalid. Please try again.")
      }
    }
  }

  if (!mfaList) {
    return
  }

  const handleClose = () => {
    setOpen(false)
    setMfaMode("")
    setQrCodeImage("")
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <AlertDialogTrigger asChild>
        <Button type="submit" variant={"outline"} onClick={() => setOpen(true)}>
          Click to manage 2FA
        </Button>
      </AlertDialogTrigger>
      {mfaList.totp === false ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You are about to enable 2FA, great!
            </AlertDialogTitle>
            <p className={"text-muted-foreground text-sm"}>
              {mfaMode === "totpEnable"
                ? "Please scan the QR code with your authenticator app and enter the code to enable 2FA."
                : "To enable 2FA, please select one of the following options."}
            </p>
            <div className={"flex flex-col"}>
              {!mfaMode && (
                <Button
                  className={"mt-4"}
                  onClick={async () => {
                    await handleMfaAdd("totp")
                  }}
                >
                  Enable 2FA
                </Button>
              )}
            </div>
            <div>
              {mfaMode === "totpEnable" && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeImage}
                    className={"mb-4 h-64 w-auto"}
                    alt="QR Code"
                  />

                  <InputOTP
                    maxLength={6}
                    onComplete={(result) => {
                      handleMfaVerify(result).catch((error) => {
                        toast.error(
                          "You encountered an error. But don't worry, we're on it."
                        )
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
              {mfaMode === "totpFinished" && (
                <p className={"text-muted-foreground text-sm"}>
                  2FA has been enabled. Would you like to show your recovery
                  codes?
                </p>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant={"outline"}>Close</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You are about to disable 2FA, are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sad to see you make this decision, but we&apos;re here to help!
              You can disable 2FA by entering your 2FA code after clicking the
              button below.
            </AlertDialogDescription>
            <div className={"flex flex-col"}>
              {!mfaMode && (
                <Button
                  className={"mt-4"}
                  onClick={() => setMfaMode("totpDisable")}
                >
                  Disable 2FA
                </Button>
              )}
            </div>
            <div>
              {mfaMode === "totpDisable" && (
                <>
                  <InputOTP
                    maxLength={6}
                    onComplete={(result) => {
                      handleMfaDelete(result).catch((error) => {
                        toast.error(
                          "You encountered an error. But don't worry, we're on it."
                        )
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
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant={"outline"} onClick={handleClose}>
                Close
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
