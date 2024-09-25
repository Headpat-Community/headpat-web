'use client'
import { useEffect } from 'react'
import PageLayout from '@/components/pageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const isMobileDevice = () => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera
  if (/android/i.test(userAgent)) {
    return 'android'
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios'
  }
  return null
}

export default function PageClient() {
  useEffect(() => {
    const deviceType = isMobileDevice()
    if (deviceType === 'android') {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.headpat.app'
    } else if (deviceType === 'ios') {
      window.location.href = 'https://apps.apple.com/app/headpat/id6502715063'
    }
  }, [])

  return (
    <PageLayout title={'App'}>
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              Google Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Download Headpat for your Android device and start patting heads
              today!
            </p>
            <Link
              href={
                'https://play.google.com/store/apps/details?id=com.headpat.app'
              }
              target={'_blank'}
            >
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                <DownloadIcon className="mr-2 h-4 w-4" /> Get it on Google Play
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              iOS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Experience Headpat on your iPhone or iPad. Available on the App
              Store.
            </p>
            <Link
              href={'https://apps.apple.com/app/headpat/id6502715063'}
              target={'_blank'}
            >
              <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download on the App
                Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
