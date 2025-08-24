import PageClient from "./page.client"

export default async function FollowerPage(props: {
  params: Promise<{ locale: string; communityId: string }>
}) {
  const params = await props.params

  const { communityId } = params

  return <PageClient communityId={communityId} />
}
