'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ErrorMessage } from '@/components/alerts'
import { emailVerification } from '@/utils/actions/user-actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ResetPassword = () => {
  const [code, setCode] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userIdParam = urlParams.get('userId')
    const codeParam = urlParams.get('secret')
    if (userIdParam) {
      setUserId(userIdParam)
    }
    if (codeParam) {
      setCode(codeParam)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const body = {
      userId: userId,
      secret: code,
    }

    const response = await emailVerification(body)
    if (!response) {
      setError('Fehler, bitte versuche es später erneut oder kontaktiere uns.')
    }
  }

  return (
    <>
      {error && <ErrorMessage attentionError={error} />}
      <div className="flex items-center justify-center px-6 py-12 lg:px-8 lg:pt-[200px]">
        <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-24 w-auto"
            src="/logos/hp_logo_x512.webp"
            alt="Headpat Logo"
            width={128}
            height={128}
          />
          <h4 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Verify E-Mail
          </h4>

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <div className="mt-2">
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <div className="mt-2">
                <Input
                  id="code"
                  name="code"
                  type="password"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" onClick={handleSubmit}>
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
