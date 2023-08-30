"use client";
import Layout from "../../layouts/account-layout";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    discordname: "",
    telegramname: "",
    furaffinityname: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

        const userResponse = await fetch(
          "https://backend.headpat.de/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userResponseData = await userResponse.json();
        const userId = userResponseData.id;

        const userDataResponse = await fetch(
          `https://backend.headpat.de/api/user-data/${userId}?populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userDataResponseData = await userDataResponse.json();
        const userDataAttributes = userDataResponseData.data.attributes;
        setUserData({
          discordname: userDataAttributes.discordname || "",
          telegramname: userDataAttributes.telegramname || "",
          furaffinityname: userDataAttributes.furaffinityname || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const userResponse = await fetch(
        "https://backend.headpat.de/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userResponseData = await userResponse.json();
      const userId = userResponseData.id;

      const formData = new FormData();

      // Append the data for Discord, Telegram, and Furaffinity
      formData.append(
        "data",
        JSON.stringify({
          users_permissions_user: userId,
          discordname: document.getElementById("discordname").value,
          telegramname: document.getElementById("telegramname").value,
          furaffinityname: document.getElementById("furaffinityname").value,
          X_name: document.getElementById("X_name").value,
          twitchname: document.getElementById("twitchname").value,
        })
      );

      setIsUploading(true);

      const response = await fetch(
        `https://backend.headpat.de/api/user-data/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        console.log("Data uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        // Add the "Saved!" text to the form
        alert("Saved!");
      } else {
        alert("Failed to upload Data");
        console.error("Failed to upload Data:", responseData);
      }
    } catch (error) {
      alert("Failed to upload Data");
      console.error(error);
    }
  };

  const secondaryNavigation = [
    { name: "Account", href: "/account", current: false },
    { name: "Frontpage", href: "/account/frontpage", current: false },
    { name: "Socials", href: "/account/socials", current: true },
  ];

  return (
    <>
      <Layout>
        <header className="border-b border-white/5">
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={item.current ? "text-indigo-400" : ""}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <div className="divide-y divide-white/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
              <h2 className="text-base font-semibold leading-7 text-white">
                Socials
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Hier kannst du deine Links zu deinen Social Media Accounts eintragen.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="discordname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Discord ID
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="discordname"
                      id="discordname"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.discordname}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          discordname: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="telegramname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Telegram Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="telegramname"
                      id="telegramname"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.telegramname}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          telegramname: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="furaffinityname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Furaffinity Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="furaffinityname"
                      id="furaffinityname"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.furaffinityname}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          furaffinityname: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="furaffinityname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    X (Twitter) Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="X_name"
                      id="X_name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.X_name}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          X_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="furaffinityname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Twitch
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="twitchname"
                      id="twitchname"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.twitchname}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          twitchname: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
