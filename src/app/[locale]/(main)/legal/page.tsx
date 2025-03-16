import { Paperclip } from 'lucide-react'
import Link from 'next/link'
import { getDict } from 'gt-next/server'
import PageLayout from '@/components/pageLayout'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getDict('LegalMetadata')

  return {
    title: meta('title'),
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/legal`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/legal`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/legal`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/legal`,
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

export default function LegalPage() {
  return (
    <PageLayout title={'Legal'}>
      <div className="mx-auto mb-4 mt-8 max-w-7xl">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7">
            Legal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            All the legal information about our website and app.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">About</dt>
              <dd className="mt-1 text-sm leading-6 text-black/80 dark:text-white/80 sm:col-span-2 sm:mt-0">
                Here you can download all the legal documents that are related
                to the use of our website or app. If you have any questions,
                please contact us at{' '}
                <Link
                  className="text-link hover:text-link/80"
                  href="mailto:help@headpat.place"
                >
                  help@headpat.place
                </Link>
                .
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Attachments</dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-700 dark:border-gray-200"
                >
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Impressum</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/impressum'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Terms of Service
                        </span>
                        <span className="shrink-0 text-gray-400">PDF</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/termsofservice.pdf'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Privacy Policy
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/privacypolicy'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">EULA</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/eula'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Disclaimer</span>
                        <span className="shrink-0 text-gray-400">PDF</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/disclaimer.pdf'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Acceptable Use
                        </span>
                        <span className="shrink-0 text-gray-400">PDF</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/acceptableuse.pdf'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                  {/*<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Return Policy
                        </span>
                        <span className="shrink-0 text-gray-400">
                          PDF
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href="/legal/returnpolicy.pdf"
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>*/}
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Shipping Policy
                        </span>
                        <span className="shrink-0 text-gray-400">PDF</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <Link
                        href={'/legal/returnpolicy.pdf'}
                        className="font-medium text-link hover:text-link/80"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PageLayout>
  )
}
