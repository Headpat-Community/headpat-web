"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/loading";

export default function AccountPage() {
  const [userData, setUserData] = useState({ enablensfw: false }); // Initialize with an empty object and a default value
  const [userMe, setUserMe] = useState(null);
  const [nsfw, setNsfw] = useState(false);
  const [emailvalue, setEmailValue] = useState(userMe?.email || "");
  const [usernamevalue, setUsernameValue] = useState(userMe?.username || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        const userResponse = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });
        const userResponseData = await userResponse.json();
        setUserMe(userResponseData[0]);

        const userDataResponse = await fetch(`/api/user/getUserDataSelf`, {
          method: "GET",
        });
        const userDataResponseData = await userDataResponse.json();
        setUserData(userDataResponseData.documents[0]);
        setIsLoading(false); // Done loading
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Done loading, even if there's an error
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let userFormData = {};

    if (email.value) {
      userFormData.email = email.value;
    }

    if (username_login.value) {
      userFormData.username = username_login.value;
    }

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData.id;

      const userResponseUpdate = await fetch(`/api/user/editUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      });

      if (userResponseUpdate.status === 200) {
        alert("User data updated successfully");
        window.location.reload();
      } else if (userResponseUpdate.status === 400) {
        alert("Username needs to be at least 3 characters long");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    const currentPassword = event.target.currentpassword.value;
    const newPassword = event.target.newpassword.value;

    try {
      const response = await fetch("/api/user/editUserPassword", {
        method: "PATCH",
        body: JSON.stringify({
          password: newPassword,
          oldPassword: currentPassword,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        alert(data.error.message);
      } else if (response.ok) {
        alert("Password reset successful");
        window.location.reload();
      } else {
        alert("Password reset failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const secondaryNavigation = [
    { name: "Account", href: "/account", current: true },
    { name: "Frontpage", href: "/account/frontpage", current: false },
    { name: "Socials", href: "/account/socials", current: false },
  ];

  const handleNsfwChange = async (event) => {
    const { checked } = event.target;

    setUserData((prevUserData) => ({
      ...prevUserData,
      enablensfw: checked,
    }));

    const isChecked = checked; // Save the value before async operations

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });
      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;

      const putResponse = await fetch(`/api/user/handleNsfwChange/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            enablensfw: isChecked,
          },
        }),
      });

      if (!putResponse.ok) {
        throw new Error("PUT request failed");
      }

      // Update userMe state after successful request
      setUserMe((prevUserMe) => ({
        ...prevUserMe,
        enablensfw: isChecked,
      }));
    } catch (error) {
      console.error(error.message);
      if (error.response) {
        const response = await error.response.json();
        // console.log(response);
      }
    }
  };

  return (
    <>
      <header className="border-b dark:border-white/5 border-black/5">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 dark:text-gray-400 text-gray-900 sm:px-6 lg:px-8"
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
      {isLoading ? (
        <Loading />
      ) : (
        <div className="divide-y dark:divide-white/5 divide-black/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Use a permanent address where you can receive mail.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={userMe ? userMe.email : ""}
                      onChange={(e) => setEmailValue(e.target.value)}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                        https://headpat.de/user/
                      </span>
                      <input
                        type="text"
                        name="username"
                        id="username_login"
                        placeholder={userData ? userData.profileurl : ""}
                        onChange={(e) => setUsernameValue(e.target.value)}
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
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

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Update your password associated with your account.
              </p>
            </div>

            <form className="md:col-span-2" onSubmit={handlePasswordReset}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <span
                    htmlFor="current-password"
                    className="block text-sm font-medium mb-2"
                  >
                    Current password
                  </span>
                  <input
                    type="password"
                    name="currentpassword" // Updated name
                    id="currentpassword"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="col-span-full">
                  <span
                    htmlFor="new-password"
                    className="block text-sm font-medium mb-2"
                  >
                    New password
                  </span>
                  <input
                    type="password"
                    name="newpassword" // Updated name
                    id="newpassword"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="col-span-full">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7">Enable NSFW</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Checking this box will enable NSFW images. 18+ only.
              </p>
              <p className="text-sm leading-6 text-gray-400">
                Anyone under the age of 18 caught viewing NSFW content will be
                suspended.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <input
                    id="nsfwtoggle"
                    aria-describedby="nsfwtoggle"
                    name="nsfwtoggle"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={userMe?.enablensfw}
                    onChange={handleNsfwChange}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
