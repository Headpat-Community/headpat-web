import Client from './page.client'
import { getUserSelf } from '../../../utils/actions/user-actions'

export const metadata = {
  title: 'Gallerie',
  description: 'Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.',
}

export const runtime = 'edge'

export default async function Gallery () {
  const userSelf = await getUserSelf()
  let enableNsfw = userSelf?.enablensfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false}/>
    </div>
  )
}
