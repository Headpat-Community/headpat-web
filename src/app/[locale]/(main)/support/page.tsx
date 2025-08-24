import Link from "next/link"
import { getTranslations } from "gt-next/server"

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations("SupportMetadata")

  return {
    title: meta("title"),
    description: meta("description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/support`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/support`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/support`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/support`,
      },
    },
    openGraph: {
      title: meta("title"),
      description: meta("description"),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function Page() {
  const t = await getTranslations("SupportPage")
  return (
    <div className="mx-auto mb-4 mt-8 max-w-7xl p-4">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7">{t("helpTitle")}</h3>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
          {t("helpDescription")}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">{t("discord")}</dt>
            <dd className="mt-1 text-sm leading-6 text-black/80 sm:col-span-2 sm:mt-0 dark:text-white/80">
              {t("discordDescription")}{" "}
              <Link
                className="text-link hover:text-link/80"
                href="https://discord.gg/EaQTEKRg2A"
              >
                https://discord.gg/EaQTEKRg2A
              </Link>
              .
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">{t("email")}</dt>
            <dd className="mt-1 text-sm leading-6 text-black/80 sm:col-span-2 sm:mt-0 dark:text-white/80">
              {t("emailDescription")}{" "}
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
            <dt className="text-sm font-medium leading-6">{t("github")}</dt>
            <dd className="mt-1 text-sm leading-6 text-black/80 sm:col-span-2 sm:mt-0 dark:text-white/80">
              {t("githubDescription")}{" "}
              <Link
                className="text-link hover:text-link/80"
                href="https://github.com/Headpat-Community"
              >
                https://github.com/Headpat-Community
              </Link>
              .
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
