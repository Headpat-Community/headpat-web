import { Link } from '@/i18n/routing'

export const metadata = {
  title: 'Impressum',
}

export const runtime = 'edge'

export default function ImpressumPage() {
  return (
    <>
      <div className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Impressum
          </h1>
          <br />
          <p>Information according to § 5 TMG.</p>
          <br />
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Contact
          </h1>
          <br />
          <p>Only on request: help@headpat.place</p>
          <br />
          <p>
            <strong>Contact info</strong>
          </p>
          <p>E-Mail: help@headpat.place</p>
          <p>Webseite: https://headpat.place</p>
          <br />
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Online dispute resolution
          </h1>
          <p>
            The European Commission provides a platform for online dispute
            resolution, available here:{' '}
            <Link
              className="text-link hover:text-link/80"
              // @ts-ignore
              href="https://ec.europa.eu/consumers/odr/"
            >
              https://ec.europa.eu/consumers/odr/
            </Link>
            <br />
            <br />I am neither willing nor obliged to participate in dispute
            resolution proceedings in front of a consumer arbitration board.
          </p>
          <br />
        </div>
      </div>
    </>
  )
}
