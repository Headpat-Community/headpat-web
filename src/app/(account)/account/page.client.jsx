"use client";
import { useState } from "react";
import Link from "next/link";
import { ErrorMessage, SuccessMessage } from "components/alerts";
import {
  editUserData,
  editUserEmail,
  editUserPassword,
  handleNsfwChange,
} from "../../../utils/actions/user-actions";

export default function AccountPage({ userDataSelf, userSelf, userId }) {
  const [userData, setUserData] = useState(userDataSelf || []);
  const [userMe, setUserMe] = useState(userSelf || { enablensfw: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEmailChange = async (event) => {
    event.preventDefault();

    try {
      const email = document.getElementById("email").value;
      const email_password = document.getElementById("email_password").value;

      // Check if profileUrl has at least 4 characters
      if (email_password.length < 8) {
        setError("Please enter a valid password.");
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      const body = {
        email: email,
        password: email_password,
      };

      const responseData = await editUserEmail(body);
      console.log(responseData);
      if (responseData === 401) {
        setError("Passwort ist inkorrekt.");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      if (responseData === 409) {
        setError("Es existiert bereits ein Account mit dieser E-Mail-Adresse.");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      if (responseData.$id) {
        setSuccess("E-Mail-Adresse erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
        event.target.reset();
      } else {
        setError(
          "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        );
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    const currentPassword = event.target.currentpassword.value;
    const newPassword = event.target.newpassword.value;

    // Check if profileUrl has at least 4 characters
    if (newPassword.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    try {
      const body = {
        password: newPassword,
        oldPassword: currentPassword,
      };

      const response = await editUserPassword(body);

      if (response === 400) {
        const data = await response.json();
        setError(data.error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
      } else if (response) {
        setSuccess("Passwort erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
        event.target.reset();
      } else {
        setError("Password reset failed");
        setTimeout(() => {
          setError(null);
        }, 5000);
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

  const handleNsfw = async (event) => {
    const isChecked = event.target.checked;

    try {
      const body = { data: { enablensfw: isChecked } };
      const putResponse = await handleNsfwChange(userId, body);

      if (putResponse) {
        setSuccess("NSFW erfolgreich geändert.");
        setUserMe((prevUserData) => ({
          ...prevUserData,
          enablensfw: isChecked,
        }));
      } else {
        setError("Failed to update NSFW");
      }

      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleProfileUrlChange = async (event) => {
    event.preventDefault();

    try {
      const profileUrl = document.getElementById("profileurl").value;

      // Check if profileUrl has at least 4 characters
      if (profileUrl.length < 3) {
        setError("Profile URL must be at least 3 characters long.");
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      const body = {
        data: {
          profileurl: profileUrl,
        },
      };

      const responseData = await editUserData(userId, body);

      if (responseData.$id) {
        setSuccess("Profil URL erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);

        setUserData(responseData); // Set the userData state with the response data
        event.target.reset(); // Reset the form
        //window.location.reload();
      } else {
        setError(
          "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        );
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
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
      <div className="divide-y dark:divide-white/5 divide-black/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7">Change Email</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Ändere deine E-Mail-Adresse.
            </p>
          </div>

          <form onSubmit={handleEmailChange} className="md:col-span-2">
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
                    required
                    placeholder={userMe ? userMe.email : ""}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6"
                >
                  Current Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <input
                      type="password"
                      name="email_password"
                      id="email_password"
                      required
                      autoComplete="current-password"
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
            <h2 className="text-base font-semibold leading-7">Profile URL</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Dein Profil-URL ist der Link, den du mit anderen teilen kannst, um
              dein Profil zu zeigen.
            </p>
          </div>

          <form onSubmit={handleProfileUrlChange} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6"
                >
                  URL
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                      https://headpat.de/user/
                    </span>
                    <input
                      type="text"
                      name="profileurl"
                      id="profileurl"
                      required
                      placeholder={userData ? userData.profileurl : ""}
                      className="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                      minLength="4"
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
              Ändere dein Passwort.
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
                  required
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
                  onChange={handleNsfw}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
