import Image from 'next/image'
import { ChevronRightIcon } from 'lucide-react'
import PageLayout from '@/components/pageLayout'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'

export const runtime = 'edge'

export async function generateMetadata({ params }) {
  const paramsResponse = await params
  const meta = await getTranslations({
    locale: paramsResponse.locale,
    namespace: 'MainMetadata',
  })

  return {
    title: {
      default: meta('title'),
      template: `%s - Headpat`,
    },
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl`,
      },
    },
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
      locale: paramsResponse.locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function Home({ params }) {
  const paramsResponse = await params
  const main = await getTranslations({
    locale: paramsResponse.locale,
    namespace: 'HomePage',
  })

  return (
    <PageLayout title="Home">
      <div className="">
        <main>
          {/* Hero section */}
          <div className="relative isolate overflow-hidden">
            <svg
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full stroke-white/10"
            >
              <defs>
                <pattern
                  x="50%"
                  y={-1}
                  id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M.5 200V.5H200"
                    fill="none"
                    stroke="#6b7280"
                    strokeOpacity="0.5"
                  />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>
            <div
              aria-hidden="true"
              className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            >
              <div
                style={{
                  clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                }}
                className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
              />
            </div>
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
              <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                <div className="mt-24 sm:mt-32 lg:mt-16 flex space-x-6 items-center">
                  <Link href="/app">
                    <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl dark:shadow-zinc-900 shadow-zinc-100 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                        <span>{main('checkapp')}</span>
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                  </Link>
                  <Link href="/changelog">
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground hover:text-muted-foreground/90">
                      <span>{main('latestupdates')}</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </span>
                  </Link>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
                  {main('showoffwithconfidence')}
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {main('description1')}
                </p>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {main('description2')}
                </p>
              </div>
              <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-lg">
                  <Image
                    alt="App screenshot"
                    src="/images/headpat_frontpage.webp"
                    draggable={false}
                    priority
                    width={1580}
                    height={1848}
                    className="w-[30rem] md:w-[50rem] lg:w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  )
}
