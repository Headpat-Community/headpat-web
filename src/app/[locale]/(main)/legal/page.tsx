import { Paperclip } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "gt-next/server"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations("LegalMetadata")

  return {
    title: meta("title"),
    description: meta("description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/legal`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/legal`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/legal`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/legal`,
      },
    },
    openGraph: {
      title: meta("title"),
      description: meta("description"),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }
}

export default async function LegalPage() {
  const t = await getTranslations("LegalPage")
  return (
    <div className="mx-auto mb-4 mt-8 max-w-7xl p-4">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7">{t("legalInfo")}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {t("legalInfoDescription")}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">{t("about")}</dt>
            <dd className="mt-1 text-sm leading-6 text-black/80 sm:col-span-2 sm:mt-0 dark:text-white/80">
              {t("aboutDescription")}{" "}
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
            <dt className="text-sm font-medium leading-6">
              {t("attachments")}
            </dt>
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
                      <span className="truncate font-medium">
                        {t("impressum")}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/impressum"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
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
                        {t("termsOfService")}
                      </span>
                      <span className="shrink-0 text-gray-400">PDF</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/termsofservice.pdf"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
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
                        {t("privacyPolicy")}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/privacypolicy"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
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
                      <span className="truncate font-medium">{t("eula")}</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/eula"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
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
                        {t("disclaimer")}
                      </span>
                      <span className="shrink-0 text-gray-400">PDF</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/disclaimer.pdf"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
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
                        {t("acceptableUse")}
                      </span>
                      <span className="shrink-0 text-gray-400">PDF</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Link
                      href={"/legal/acceptableuse.pdf"}
                      className="text-link hover:text-link/80 font-medium"
                    >
                      {t("view")}
                    </Link>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
