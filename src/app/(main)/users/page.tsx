import Link from "next/link";
import { getUsers } from "utils/actions/user-actions";
import { UserDataDocumentsType } from "utils/types";

export const runtime = "edge";

export default async function Users() {
  const users: UserDataDocumentsType[] = await getUsers();

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mt-4 text-base font-semibold leading-6">Users</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Hier könnt ihr alle User sehen, die sich auf der Seite registriert
            haben.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={`/register`}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Eigenen Account erstellen
          </Link>
        </div>
      </div>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Pronouns
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Zum Profil</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-gray-50 dark:bg-gray-950">
                {users.map((user) => (
                  <tr key={user.$id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                      {user.displayName || "Keine Angabe"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {user.status || "Keine Angabe"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {user.pronouns || "Keine Angabe"}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href={`/user/${user.profileUrl}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Zum Profil
                        <span className="sr-only">, {user?.displayName}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
