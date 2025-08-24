"use client"
import { useEffect, useState } from "react"
import {
  SiApple,
  SiDiscord,
  SiGithub,
  SiGoogle,
  SiSpotify,
  SiTwitch,
} from "@icons-pack/react-simple-icons"
import { Button } from "@/components/ui/button"
import { signInWithProvider } from "@/utils/actions/oauth-actions"
import Link from "next/link"
import { account, ID } from "@/app/appwrite-client"
import { toast } from "sonner"
import Image from "next/image"
import { Form, FormField } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "@/components/fields/InputField"
import CheckboxField from "@/components/fields/CheckboxField"
import { useTranslations } from "gt-next/client"
import { useUser } from "@/components/contexts/UserContext"
import { toastHandling } from "@/utils/toastHandling"
import { useRouter } from "next/navigation"
import { OAuthProvider } from "node-appwrite"

type LoginFormData = {
  email: string
  password: string
}

type RegisterFormData = {
  username: string
  email: string
  password: string
  acceptedTerms: boolean
}

export default function Login() {
  const { init } = useUser()
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()
  const zodTranslations = useTranslations("Zod.Login")

  const registerSchema = z.object({
    username: z.string().trim().min(3, zodTranslations("MinUsernameLength")),
    email: z.email(zodTranslations("InvalidEmail").trim()),
    password: z
      .string()
      .trim()
      .min(8, zodTranslations("MinPasswordLength"))
      .max(256, zodTranslations("MaxPasswordLength")),
    acceptedTerms: z.boolean().refine((value) => value === true, {
      message: zodTranslations("AcceptedTerms"),
    }),
  })

  const loginSchema = z.object({
    email: z.email(zodTranslations("InvalidEmail").trim()),
    password: z
      .string()
      .trim()
      .min(8, zodTranslations("MinPasswordLength"))
      .max(256, zodTranslations("MaxPasswordLength")),
  })

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      acceptedTerms: false,
    },
  })

  useEffect(() => {
    const checkAccount = async () => {
      const accountData = await account.get().catch((e) => {
        if (e.type === "user_more_factors_required") router.push("/login/mfa")
      })
      if (accountData) {
        router.push("/account")
      }
    }

    checkAccount().then()
  }, [router])

  const submitLogin = async (data: LoginFormData) => {
    const signIn = async () => {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      return response.json()
    }

    try {
      const response = await signIn()

      const isSuccess = toastHandling({
        response,
        category: "account",
      })

      if (!isSuccess) {
        return // Stop execution if there was an error
      }

      await init()
      toast.success("Logged in successfully.")
      router.push("/account")
    } catch (error: any) {
      toast.error("An unexpected error occurred")
    }
  }

  const submitRegister = async (data: RegisterFormData) => {
    const signIn = async () => {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      return response.json()
    }

    try {
      await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.username
      )
      const response = await signIn()

      const isSuccess = toastHandling({
        response,
        category: "account",
      })

      if (!isSuccess) {
        return // Stop execution if there was an error
      }

      await init()
      toast.success("Logged in successfully.")
      router.push("/account")
    } catch (error: any) {
      toast.error("An unexpected error occurred")
    }
  }

  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form
        className="space-y-6"
        onSubmit={loginForm.handleSubmit(submitLogin)}
      >
        <div key="1" className="mx-auto max-w-4xl space-y-6 p-6">
          <div className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <InputField
                  label="E-Mail"
                  description=""
                  placeholder=""
                  field={field}
                />
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <InputField
                  label="Password"
                  description=""
                  placeholder=""
                  field={field}
                  type={"password"}
                />
              )}
            />
            <Button className="w-full">Login</Button>
            <Link href={"/forgot-password"}>
              <Button variant={"link"} type={"button"} className={"p-0"}>
                Forgot password?
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )

  const renderRegisterForm = () => (
    <Form {...registerForm}>
      <form
        className="space-y-6"
        onSubmit={registerForm.handleSubmit(submitRegister)}
      >
        <div key="1" className="mx-auto max-w-4xl space-y-6 p-6">
          <div className="space-y-4">
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <InputField
                  label="Username"
                  description=""
                  placeholder=""
                  field={field}
                />
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <InputField
                  label="E-Mail"
                  description=""
                  placeholder=""
                  field={field}
                />
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <InputField
                  label="Password"
                  description=""
                  placeholder=""
                  field={field}
                  type={"password"}
                />
              )}
            />
            <FormField
              control={registerForm.control}
              name="acceptedTerms"
              render={({ field }) => (
                <CheckboxField
                  label="Accept terms and conditions"
                  description=""
                  field={field}
                />
              )}
            />
            <Button className="w-full">Register</Button>
            <Link href={"/forgot-password"}>
              <Button variant={"link"} type={"button"} className={"p-0"}>
                Forgot password?
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <div className="flex items-center justify-center">
      <div className="min-w-1/3 mx-auto rounded-2xl dark:ring-white">
        <div className={"text-center"}>
          <h4 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
            Welcome to Headpat!
          </h4>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isRegistering ? "Already registered?" : "Not yet registered?"}{" "}
            <Link
              href="#"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-link hover:text-link/80 font-semibold"
            >
              Click here!
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <div>{isRegistering ? renderRegisterForm() : renderLoginForm()}</div>

          <div className="mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="rounded-xl bg-white px-6 text-gray-900">
                  Or continue with
                </span>
              </div>
            </div>
            {/* OAuth Sign-In */}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <form action={() => signInWithProvider(OAuthProvider.Discord)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#5865F2] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20">
                  <SiDiscord className={"h-5"} />
                  <span className="text-sm font-semibold leading-6">
                    Discord
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Oidc)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#005953] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20">
                  <Image
                    src={"/logos/eurofurence.webp"}
                    alt={"Eurofurence Logo"}
                    className={"rounded-xl"}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-semibold leading-6">
                    Eurofurence
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Github)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  <SiGithub className={"h-5"} />
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Apple)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#000000] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  <SiApple className={"h-5"} />
                  <span className="text-sm font-semibold leading-6">Apple</span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Google)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#131314] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  <SiGoogle className={"h-4"} />

                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Spotify)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#1DB954] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  <SiSpotify className={"h-5"} />
                  <span className="text-sm font-semibold leading-6">
                    Spotify
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Microsoft)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#01A6F0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={"/logos/Microsoft_logo.svg.png"}
                    alt={"Microsoft"}
                    className={"h-5"}
                  />
                  <span className="text-sm font-semibold leading-6">
                    Microsoft
                  </span>
                </button>
              </form>

              <form action={() => signInWithProvider(OAuthProvider.Twitch)}>
                <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#6441A5] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                  <SiTwitch className={"h-5"} />
                  <span className="text-sm font-semibold leading-6">
                    Twitch
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
