"use client"
import { account } from "@/app/appwrite-client"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { getMfaFactors } from "@/utils/server-api/account/user"
import * as Sentry from "@sentry/nextjs"
import { useRouter } from "next/navigation"
import { AuthenticationFactor } from "node-appwrite"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function MfaPageClient() {
  const router = useRouter()
  const [challengeId, setChallengeId] = useState("")
  const [needsMfa, setNeedsMfa] = useState(false)

  useEffect(() => {
    const checkMfa = async () => {
      try {
        await account.get()
        router.push("/account")
      } catch (error: any) {
        if (error.type === "general_unauthorized_scope") {
          router.push("/login")
        } else {
          setNeedsMfa(true)
        }
      }
    }
    checkMfa().then(createMfaCode)
  }, [router])

  const createMfaCode = async () => {
    try {
      const factors = await getMfaFactors()
      if (factors.totp) {
        const mfaData = await account.createMfaChallenge(
          AuthenticationFactor.Totp
        )
        setChallengeId(mfaData.$id)
      } else {
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMfaVerify = async (otp: string) => {
    try {
      await account.updateMfaChallenge(challengeId, otp)

      router.replace("/account")
    } catch (error: any) {
      if (error.type === "user_invalid_token") {
        toast.error(
          "Incorrect code. Please try again. If you're having trouble, please contact support."
        )
        return
      } else {
        toast.error("You encountered an error. But don't worry, we're on it.")
        Sentry.captureException(error)
        return
      }
    }
  }

  if (!needsMfa) {
    return (
      <div className="absolute inset-0 flex flex-1 items-center justify-center">
        <div className="min-w-1/3 mx-auto mt-14 rounded-2xl p-8 dark:ring-white">
          <div className="mt-10">
            <div>
              <div className={"text-center"}>
                <h4 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                  Loading...
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="absolute inset-0 flex flex-1 items-center justify-center">
        <div className="min-w-1/3 mx-auto mt-14 rounded-2xl p-8 dark:ring-white">
          <div className="mt-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div>
                <h4 className="mt-8 text-2xl font-bold tracking-tight">
                  Please fill in your 2FA code
                </h4>
              </div>
              <div key="1" className="space-y-6">
                <InputOTP
                  maxLength={6}
                  onComplete={(result) => {
                    handleMfaVerify(result).catch((error) => {
                      console.log(error)
                      toast.error(
                        "You encountered an error. But don't worry, we're on it."
                      )
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
