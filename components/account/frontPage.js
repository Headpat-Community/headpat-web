"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    status: "",
    bio: "",
    displayname: "",
    pronouns: "",
    birthday: "",
    location: "",
    avatar: "",
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
        //console.log(userDataResponseData.data.attributes);
        setUserData({
          status: userDataResponseData.data.attributes.status || "",
          bio: userDataResponseData.data.attributes.bio || "",
          displayname: userDataResponseData.data.attributes.displayname || "",
          birthday: userDataResponseData.data.attributes.birthday || "",
          pronouns: userDataResponseData.data.attributes.pronouns || "",
          location: userDataResponseData.data.attributes.location || "",
          avatar:
            userDataResponseData.data.attributes.avatar?.data?.attributes
              ?.url || "/logos/logo.png", // Set the avatar value or a placeholder image
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
        if (img.width <= 1024 && img.height <= 1024) {
          setSelectedFile(selectedFile);
        } else {
          alert("Image resolution darf nur bis 1024x1024 pixel groß sein.");
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
          status: document.getElementById("status").value,
          bio: document.getElementById("biostatus").value,
          displayname: document.getElementById("displayname").value,
          birthday: document.getElementById("birthday").value,
          pronouns: document.getElementById("pronouns").value,
          location: document.getElementById("location").value,
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
        //console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        setUserData(responseData); // Set the userData state with the response data
        // Reload the window
        alert("Saved!");
        window.location.reload();
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
              Hier kannst du deine Biografie, Profilbild etc. verwalten.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full flex items-center gap-x-8">
                <img
                  id="avatar-image"
                  src={userData.avatar || "/logos/logo.png"}
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
                    JPG, GIF or PNG. 2MB max.
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
                <div className="mt-2 relative">
                  <input
                    id="displayname"
                    name="displayname"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={userData.displayname || ""} // Set the value from state, or an empty string if it's undefined
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setUserData({
                          ...userData,
                          displayname: e.target.value,
                        });
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 32
                    maxLength={32} // Limit the maximum number of characters to 32
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <span className="text-white select-none">
                      {userData.displayname ? userData.displayname.length : 0}{" "}
                      {/* Check if userData.displayname is defined before accessing its length property */}
                    </span>
                    <span className="text-gray-400 select-none">/{32}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Status
                </label>
                <div className="mt-2 relative">
                  <input
                    id="status"
                    name="status"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={userData.status} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 24) {
                        setUserData({ ...userData, status: e.target.value });
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 24
                    maxLength={24} // Limit the maximum number of characters to 24
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <span className="text-white  select-none">
                      {userData.status ? userData.status.length : 0}{" "}
                    </span>
                    <span className="text-gray-400  select-none">/{24}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="pronouns"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Pronouns
                </label>
                <div className="mt-2 relative">
                  <input
                    id="pronouns"
                    name="pronouns"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={userData.pronouns} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 16) {
                        setUserData({
                          ...userData,
                          pronouns: e.target.value,
                        });
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 16
                    maxLength={16} // Limit the maximum number of characters to 16
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <span className="text-white  select-none">
                      {userData.pronouns ? userData.pronouns.length : 0}{" "}
                    </span>
                    <span className="text-gray-400  select-none">/{16}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Birthday
                </label>
                <div className="mt-2 relative">
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={userData.birthday} // Set the value from state
                    onChange={(e) => {
                      setUserData({ ...userData, birthday: e.target.value });
                    }} // Update state when the input changes
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <span aria-disabled className="text-gray-400 select-none">
                      DD/MM/YYYY
                    </span>{" "}
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Location
                </label>
                <div className="mt-2 relative">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={userData.location} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 256) {
                        setUserData({
                          ...userData,
                          location: e.target.value,
                        });
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 16
                    maxLength={256} // Limit the maximum number of characters to 16
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <span className="text-white  select-none">
                      {userData.location ? userData.location.length : 0}{" "}
                    </span>
                    <span className="text-gray-400  select-none">/{256}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="biostatus"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Bio
                </label>
                <div className="mt-2 relative">
                  <textarea
                    id="biostatus"
                    name="biostatus"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 h-72"
                    value={userData.bio} // Set the value from state
                    onChange={(e) => {
                      if (e.target.value.length <= 256) {
                        setUserData({ ...userData, bio: e.target.value });
                      }
                    }} // Update state when the input changes, only if the length is less than or equal to 256
                    maxLength={256} // Limit the maximum number of characters to 256
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 pb-2 flex items-end text-sm leading-5 pointer-events-none">
                    <span className="text-white select-none">
                      {userData.bio ? userData.bio.length : 0}{" "}
                    </span>
                    <span className="text-gray-400 select-none">/{256}</span>
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
      </div>
    </>
  );
}
