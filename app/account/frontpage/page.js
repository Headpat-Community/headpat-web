"use client";
import Layout from "../../layouts/account-layout";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    status: "", // Initialize with an empty string
    bio: "", // Initialize with an empty string
    displayname: "", // Initialize with an empty string
    avatar: "", // Initialize with an empty string
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
        setUserData({
          status: userDataResponseData.data.attributes.status || "", // Set the status value or an empty string
          bio: userDataResponseData.data.attributes.bio || "", // Set the bio value or an empty string
          displayname: userDataResponseData.data.attributes.displayname || "", // Set the bio value or an empty string
          avatar:
            userDataResponseData.data.attributes.avatar.data.attributes.url ||
            "/logo.png", // Set the avatar value or an empty string
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2 MB.");
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = (event) => {
      const imgElement = document.getElementById("avatar-image");
      imgElement.src = event.target.result;
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        if (img.width <= 2048 && img.height <= 2048) {
          setSelectedFile(selectedFile);
        } else {
          alert("Image resolution darf nur bis 2048x2048 pixel groß sein.");
        }
      };
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("files.avatar", selectedFile);

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

      // Year-Month-Day (YYYY-MM-DD)

      formData.append(
        "data",
        JSON.stringify({
          users_permissions_user: userId,
          status: document.getElementById("status").value, // Get the value from the status input
          bio: document.getElementById("biostatus").value, // Get the value from the bio input
          displayname: document.getElementById("displayname").value, // Get the value from the displayname input
        })
      );

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch(
        `https://backend.headpat.de/api/user-data/${userId}?populate=*`,
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
        console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        setUserData(responseData); // Set the userData state with the response data
        // Add the "Saved!" text to the form
        alert("Saved!");
      } else {
        // Check for the specific error structure
        if (
          responseData.error &&
          responseData.error.message === "bio must be at most 256 characters"
        ) {
          // Show an error message to the user
          alert("Biografie darf nur bis 256 zeichen lang sein.");
        } else {
          console.error("Failed to upload file:", responseData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const secondaryNavigation = [
    { name: "Account", href: "/account", current: false },
    { name: "Frontpage", href: "/account/frontpage", current: true },
    { name: "Socials", href: "/account/socials", current: false },
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
                Frontpage Einstellungen
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Hier kannst du deine biografie, profilbild etc. verwalten.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <img
                    id="avatar-image"
                    src={userData.avatar || "/logo.png"}
                    alt=""
                    className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                  />
                  <div>
                    <input
                      accept="image/*"
                      className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                      id="avatar-upload"
                      name="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      1024x1024 max. resolution
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6 mt-12">
                <div className="col-span-full">
                  <label
                    htmlFor="displayname"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Display Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="displayname"
                      name="displayname"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.displayname} // Set the value from state
                      onChange={(e) =>
                        setUserData({ ...userData, displayname: e.target.value })
                      } // Update state when the input changes
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    status
                  </label>
                  <div className="mt-2">
                    <input
                      id="status"
                      name="status"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.status} // Set the value from state
                      onChange={(e) =>
                        setUserData({ ...userData, status: e.target.value })
                      } // Update state when the input changes
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="biostatus"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    bio
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="biostatus"
                      name="biostatus"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 h-72"
                      value={userData.bio} // Set the value from state
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      } // Update state when the input changes
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
