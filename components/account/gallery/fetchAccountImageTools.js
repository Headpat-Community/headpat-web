import { useState, useEffect } from "react";
import Link from "next/link";

export default function FetchGallery() {
  const [username, setUsername] = useState(null);
  const [gallery, setGallery] = useState({});
  const [galleryUsername, setGalleryUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState({
    name: "", // Initialize with an empty string
    imgalt: "", // Initialize with an empty string
    nsfw: "", // Initialize with an empty string
    createdAt: "", // Initialize with an empty string
    modifiedAt: "", // Initialize with an empty string
    longtext: "", // Initialize with an empty string
  });

  const fetchUserId = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) return; // Return if "jwt" token does not exist

    try {
      const response = await fetch(`https://backend.headpat.de/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      setError(error);
    }
  };

  const deleteImage = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) return; // Return if "jwt" token does not exist

    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split("/");
      const uniqueId = pathParts[3];

      // Fetch the gallery data
      const response = await fetch(
        `https://backend.headpat.de/api/galleries/${uniqueId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      // Get the image ID from the userData state
      const imageId = data.data.attributes.img.data.id;

      // Delete the image file
      await fetch(`https://backend.headpat.de/api/upload/files/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Delete the gallery
      await fetch(`https://backend.headpat.de/api/galleries/${uniqueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Image deleted successfully!");
      // Redirect to the gallery list page
      window.location.href = ".";
    } catch (error) {
      setError(error);
    }
  };

  const updateImage = async () => {
    setIsUploading(true);

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      setIsUploading(false);
      return;
    }

    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split("/");
      const uniqueId = pathParts[3];

      // Create the form data
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name: document.getElementById("imagename").value,
          imgalt: document.getElementById("imgalt").value,
          longtext: document.getElementById("longtext").value,
          nsfw: document.getElementById("nsfw").checked,
        })
      );
      // Make the PUT request
      const response = await fetch(
        `https://backend.headpat.de/api/galleries/${uniqueId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Handle response and update state accordingly
    } catch (error) {
      setError(error);
    } finally {
      alert("Image updated successfully!");
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const uniqueId = pathParts[3];

    const apiUrl = `https://backend.headpat.de/api/galleries/${uniqueId}?populate=*`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        // Set the gallery data
        setGallery(data);

        // Set the galleryUsername and userData based on the fetched data
        setGalleryUsername(
          data.data.attributes.users_permissions_user.data.attributes.username
        );

        // Set the userData state with the fetched data
        setUserData({
          name: data.data.attributes.name,
          imgalt: data.data.attributes.imgalt,
          nsfw: data.data.attributes.nsfw,
          createdAt: data.data.attributes.createdAt,
          modifiedAt: data.data.attributes.updatedAt,
          longtext: data.data.attributes.longtext,
          imageId: data.data.attributes.img.data.id,
        });

        setIsLoading(false);
      })
      .catch((error) => {
        if (error.message === "404") {
          window.location.href = "/account/gallery";
        } else {
          setError(error.message);
        }
        setIsLoading(false);
      });
  }, [galleryUsername]);

  useEffect(() => {
    if (!galleryUsername) return; // Wait for userId to be available
    if (!username) return; // Wait for userId to be available

    if (galleryUsername != username) {
      window.location.href = "/account/gallery";
    }
  }, [galleryUsername, username]);

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500 font-bold my-8">Loading...</p>
      ) : (
        <div className="p-8 flex flex-wrap gap-4 justify-center items-center">
          <div>
            {(() => {
              const imgAttributes =
                gallery?.data?.attributes?.img?.data?.attributes;
              const url = imgAttributes?.url;
              const name = gallery?.data?.attributes?.name;
              const createdAt = gallery?.data?.attributes?.createdAt;
              const modifiedAt = gallery?.data?.attributes?.updatedAt;
              const imgalt = gallery?.data?.attributes?.imgalt;
              const longtext = gallery?.data?.attributes?.longtext;
              const nsfw = gallery?.data?.attributes?.nsfw;
              const width =
                gallery?.data?.attributes?.img?.data?.attributes?.width;
              const height =
                gallery?.data?.attributes?.img?.data?.attributes?.height;

              return (
                <div className="flex flex-wrap items-start">
                  <img
                    src={url}
                    alt={name || "Headpat Community Image"}
                    className={`rounded-lg imgsinglegallery ${
                      width < 800
                        ? `w-${width}`
                        : `h-[400px] sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]`
                    }`}
                    style={{ objectFit: "contain" }} // Use object-fit: contain to maintain aspect ratio
                  />

                  <div className="pb-12 ml-8 mt-2">
                    <h2 className="text-base font-semibold leading-7 text-white">
                      Informationen
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      Alles mit ein asterisk (
                      <span className="text-red-500">*</span>) ist nötig.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="imagename"
                            id="imagename"
                            required
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            value={userData.name} // Use userData.displayname
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Alternative Informationen (SEO)
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="imgalt"
                            id="imgalt"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            value={userData.imgalt} // Use userData.imgalt
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                imgalt: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Creation Date
                        </label>
                        <div className="mt-2">
                          <span
                            type="text"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          >
                            {userData.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Modified Date
                        </label>
                        <div className="mt-2">
                          <span
                            type="text"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          >
                            {userData.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Width
                        </label>
                        <div className="mt-2">
                          <span
                            type="text"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          >
                            {width}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Height
                        </label>
                        <div className="mt-2">
                          <span
                            type="text"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          >
                            {height}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium leading-6 text-white">
                          NSFW
                        </label>
                        <div className="mt-2">
                          <input
                            type="checkbox"
                            name="nsfw"
                            id="nsfw"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={userData.nsfw} // Use userData.nsfw
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                nsfw: e.target.checked, // Set nsfw to true or false
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium leading-6 text-white">
                          Description
                        </label>
                        <div className="mt-2 relative">
                          <textarea
                            id="longtext"
                            name="longtext"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 h-72"
                            value={userData.longtext || ""}
                            maxLength={256}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                longtext: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <Link
                        href={`/account/gallery`}
                        className="text-sm font-semibold leading-6 text-white"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        value="Submit"
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        disabled={isUploading || isDeleting} // Disable the button if isUploading is true
                        onClick={updateImage} // Call the deleteImage function on click
                      >
                        {isUploading ? "Uploading..." : "Save"}{" "}
                        {/* Show different text based on the upload state */}
                      </button>
                      <button
                        type="submit"
                        value="Submit"
                        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                        disabled={isDeleting || isUploading} // Disable the button if isUploading is true
                        onClick={deleteImage} // Call the deleteImage function on click
                      >
                        {isDeleting ? "Deleting..." : "Delete"}{" "}
                        {/* Show different text based on the upload state */}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
