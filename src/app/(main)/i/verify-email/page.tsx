'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ErrorMessage } from '@/components/alerts'
import { emailVerification } from '@/utils/actions/user-actions'

export const runtime = 'edge'

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
            src="/logos/Headpat_new_logo.webp"
            alt="Headpat Logo"
            width={128}
            height={128}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Reset Password
          </h2>

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                User ID
              </label>
              <div className="mt-2">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Code
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  name="code"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleSubmit}
              >
                E-Mail bestätigen
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
