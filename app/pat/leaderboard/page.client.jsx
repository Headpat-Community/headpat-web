"use client";
import { useEffect, useState } from "react";

export default function PatLeaderBoardClient({ usersData }) {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = usersData;
      const sortedData = data.sort(
        (a, b) => parseInt(b.count) - parseInt(a.count)
      );

      setUserData(sortedData);
    };

    fetchData();
  }, [usersData]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Geklickt
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Als letztes geklickt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userData.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          {user.image ? (
                            <img
                              className="h-11 w-11 rounded-full"
                              src={user.image}
                              alt=""
                            />
                          ) : (
                            <div className="h-11 w-11 bg-gray-200 rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{user.displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="">{user.count}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="">{user.lastclicked}</div>
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
