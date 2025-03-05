'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { ErrorMessage, SuccessMessage } from '@/components/alerts'
import { Link } from '@/i18n/routing'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/forgotPassword', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          url: `${process.env.NEXT_PUBLIC_DOMAIN}/i/reset-password`,
        }),
      })
      //console.log("User authenticated successfully");
      if (response.status === 400) {
        setError(`E-Mail inkorrekt!`)
        setTimeout(() => {
          setError(null)
        }, 5000)
      } else if (response.status === 429) {
        setError('Zu viele Anfragen! Bitte versuche es später erneut.')
        setTimeout(() => {
          setError(null)
        }, 5000)
      } else if (response.status === 500) {
        setError('Server Fehler! Bitte versuche es später erneut.')
        setTimeout(() => {
          setError(null)
        }, 5000)
      } else if (response.status === 200) {
        setSuccess('E-Mail gesendet! Bitte überprüfe deinen Posteingang.')
        setTimeout(() => {
          setSuccess(null)
        }, 10000)
      }
    } catch (error) {
      //console.log(error);
      setError('E-Mail inkorrekt!')
      setTimeout(() => {
        setError(null)
      }, 10000)
    }
  }

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <div className="flex items-center justify-center px-6 py-12 lg:px-8 lg:pt-[200px]">
        <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-24 w-auto"
            src="/logos/Headpat_Logo_web_1024x1024_240518-02.png"
            alt="Headpat Logo"
            width={128}
            height={128}
          />
          <h4 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Forgot password?
          </h4>

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button type="submit" onClick={handleSubmit} className="w-full">
                Send E-Mail
              </Button>
            </div>
            <div>
              <Button variant={'outline'} asChild>
                <Link href={'/login'} className="w-full">
                  &larr; Login
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
