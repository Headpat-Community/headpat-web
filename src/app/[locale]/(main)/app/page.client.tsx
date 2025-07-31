'use client'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useDict } from 'gt-next/client'

interface DeviceType {
  model?: string
  type?: string
  vendor?: string
}

const isMobileDevice = async () => {
  const deviceType: DeviceType = await fetch('/api/device').then((res) =>
    res.json()
  )

  if (deviceType.type === 'mobile') {
    if (deviceType.vendor === 'Apple') {
      window.location.href = 'https://apps.apple.com/app/headpat/id6502715063'
    } else if (deviceType.vendor === 'Google') {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.headpat.app'
    }
  }
  return 'unknown'
}

export default function PageClient() {
  const t = useDict('AppPage')

  useEffect(() => {
    const fetchDevice = async () => {
      await isMobileDevice()
    }

    fetchDevice().then()
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('googlePlay')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('downloadAndroid')}</p>
          <Link
            href={
              'https://play.google.com/store/apps/details?id=com.headpat.app'
            }
            target={'_blank'}
          >
            <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white">
              <DownloadIcon className="mr-2 size-4" /> {t('getItOnGooglePlay')}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{t('ios')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('downloadIOS')}</p>
          <Link
            href={'https://apps.apple.com/app/headpat/id6502715063'}
            target={'_blank'}
          >
            <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white">
              <DownloadIcon className="mr-2 size-4" /> {t('downloadOnAppStore')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
