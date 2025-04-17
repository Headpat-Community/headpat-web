import {
  createAdminClient,
  createSessionServerClient,
} from '@/app/appwrite-session'
import { Query } from '@/app/appwrite-server'
import { getAvatarImageUrlView } from '@/components/getStorageItem'
import PageClient from './page.client'
import { UserDataType } from '@/utils/types/models'
import sanitizeHtml from 'sanitize-html'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ profileUrl: string; locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { profileUrl, locale } = params

  const { databases } = await createSessionServerClient()
  const { users } = await createAdminClient()
  const userDataResponse: UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )
  const userAccountResponse = await users.get(
    userDataResponse.documents?.[0]?.$id
  )
  const indexingEnabled: boolean = userAccountResponse?.prefs?.indexingEnabled

  if (userDataResponse.total === 0) {
    return notFound()
  }

  const userData = userDataResponse?.documents[0]
  const sanitizedBio = sanitizeHtml(userData?.bio)

  return {
    title: userData.displayName || userData?.profileUrl,
    description: sanitizedBio,
    icons: {
      icon: getAvatarImageUrlView(userData?.avatarId),
      apple: getAvatarImageUrlView(userData?.avatarId),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/user/${profileUrl}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/user/${profileUrl}`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/user/${profileUrl}`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/user/${profileUrl}`,
      },
    },
    openGraph: {
      title: userData.displayName || userData?.profileUrl,
      description: sanitizedBio,
      images: getAvatarImageUrlView(userData.avatarId),
      locale: locale,
      type: 'profile',
    },
    robots: {
      index: indexingEnabled,
      follow: indexingEnabled,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function UserProfile(props) {
  const params = await props.params

  const { profileUrl } = params

  const { databases } = await createSessionServerClient()

  const userDataResponse: UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )

  if (userDataResponse.total === 0) {
    return notFound()
  }

  return (
    <PageClient
      user={userDataResponse.documents[0]}
      userId={userDataResponse.documents[0].$id}
    />
  )
}
