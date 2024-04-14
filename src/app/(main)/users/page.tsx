import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { createAdminClient } from '@/app/appwrite-session'

export const runtime = 'edge'

export default async function Users() {
  const { databases } = await createAdminClient()

  const usersData = await databases.listDocuments('hp_db', 'userdata')
  const users = usersData.documents

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8 mt-8 mx-auto max-w-7xl">
        <div className="sm:flex-auto">
          <h1 className="mt-4 text-base font-semibold leading-6">Users</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Here you can see all users that are registered on the platform.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href={`/register`}>
            <Button>Create account</Button>
          </Link>
        </div>
      </div>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <Table className={'max-w-7xl mx-auto'}>
              <TableCaption>A list current registered users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pronouns</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Zum Profil</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.$id}>
                    <TableCell className="font-medium">
                      {user.displayName || 'Keine Angabe'}
                    </TableCell>
                    <TableCell>{user.status || 'Keine Angabe'}</TableCell>
                    <TableCell>{user.pronouns || 'Keine Angabe'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/user/${user.profileUrl}`}>
                        <Button variant={'ghost'} className={'h-8'}>
                          Zum Profil
                          <span className="sr-only">, {user?.displayName}</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
