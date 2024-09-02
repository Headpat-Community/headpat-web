import Link from 'next/link'
import PageLayout from '@/components/pageLayout'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const meta = await getTranslations({ locale, namespace: 'SupportMetadata' })

  return {
    title: {
      default: meta('title'),
      template: `%s - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    },
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/support`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/support`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/support`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/support`,
      },
    },
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export const runtime = 'edge'

export default function Page() {
  return (
    <PageLayout title={'Support'}>
      <div className="mx-auto mb-4 mt-8 max-w-7xl">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7">
            Do you require help?
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Check below for all the ways you can get in touch with us.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Discord</dt>
              <dd className="mt-1 text-sm leading-6 text-black/80 dark:text-white/80 sm:col-span-2 sm:mt-0">
                Join our Discord server and ask for help by creating a ticket at{' '}
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  // @ts-ignore
                  href="https://discord.gg/EaQTEKRg2A"
                >
                  https://discord.gg/EaQTEKRg2A
                </Link>
                .
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">E-Mail</dt>
              <dd className="mt-1 text-sm leading-6 text-black/80 dark:text-white/80 sm:col-span-2 sm:mt-0">
                Sending us an E-Mail will get you the support you need, however
                it might take 24-48 hours. If you require faster help, please
                send us a message via Discord. Our E-Mail is{' '}
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  // @ts-ignore
                  href="mailto:help@headpat.place"
                >
                  help@headpat.place
                </Link>
                .
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PageLayout>
  )
}
