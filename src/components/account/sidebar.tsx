import { Button } from 'components/ui/button'
import { LogOutIcon, SettingsIcon, User2Icon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-4 border-b">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            <Link href={'/account/profile'}>
              <Button variant="ghost" className="w-full justify-start">
                <User2Icon className={'pr-2 h-5'} />
                Profile
              </Button>
            </Link>
            <Link href={'/account/settings'}>
              <Button variant="ghost" className="w-full justify-start">
                <SettingsIcon className={'pr-2 h-5'} />
                Settings
              </Button>
            </Link>
            <Link href={'/logout'}>
              <Button variant="ghost" className="w-full justify-start">
                <LogOutIcon className={'pr-2 h-5'} />
                Logout
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            <Link href={'/account/community'}>
              <Button variant="ghost" className="w-full justify-start">
                <UsersIcon className={'pr-2 h-5'} />
                Manage Communities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
