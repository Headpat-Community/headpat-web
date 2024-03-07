"use client";
import { useState } from "react";
import Link from "next/link";
import { ErrorMessage, SuccessMessage } from "../../../../../components/alerts";
import {
  getGallery,
  deleteGalleryImage,
  deleteGalleryDocument,
} from "../../../../../utils/actions/gallery-actions";

export default function FetchGallery({ singleGallery }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState({
    name: singleGallery.name,
    imgalt: singleGallery.imgalt,
    nsfw: singleGallery.nsfw,
    createdAt: singleGallery.$createdAt,
    modifiedAt: singleGallery.$updatedAt,
    longtext: singleGallery.longtext,
  });

  const getGalleryImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${galleryId}/view?project=6557c1a8b6c2739b3ecf`;
  };

  const deleteImage = async () => {
    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split("/");
      const uniqueId = pathParts[3];
      setIsDeleting(true);

      const data = await getGallery(`queries[]=equal("$id","${uniqueId}")`);

      // Get the image ID from the userData state
      const documentId = data.documents[0].$id;
      const imageId = data.documents[0].gallery_id;

      await deleteGalleryImage(imageId);
      await deleteGalleryDocument(documentId);

      if (!deleteGalleryImage || !deleteGalleryDocument) {
        setError("Fehler beim Löschen des Bildes!");
      }

      setSuccess("Bild erfolgreich gelöscht! Kehre dich zur Galerie zurück...");
      // Redirect to the gallery list page
      setTimeout(() => {
        window.location.href = ".";
      }, 3000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
      setIsDeleting(false);
    }
  };

  const updateImage = async () => {
    setIsUploading(true);

    try {
      // Get the ID from the URL
      const pathParts = window.location.pathname.split("/");
      const uniqueId = pathParts[3];

      // Create the form data
      const data = {
        name: document.getElementById("imagename").value,
        imgalt: document.getElementById("imgalt").value,
        longtext: document.getElementById("longtext").value,
        nsfw: document.getElementById("nsfw").checked,
      };

      // Make the PUT request
      const response = await fetch(`/api/gallery/editUserGallery/${uniqueId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }), // Nest the requestBody inside a "data" key
      });

      // Handle response and update state accordingly
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSuccess("Bild erfolgreich aktualisiert!");
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      setIsUploading(false);
    }
  };

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <div className="flex flex-wrap items-center justify-center gap-4 p-8">
        <div>
          {(() => {
            const name = singleGallery?.data?.attributes?.name;

            return (
              <div className="flex flex-wrap items-start">
                <div className="mx-auto flex">
                  <img
                    src={getGalleryImageUrl(singleGallery.gallery_id)}
                    alt={name || "Headpat Community Image"}
                    className={`imgsinglegallery h-[400px] rounded-lg object-contain sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]`}
                  />
                </div>

                <div className="ml-8 mt-2 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-white">
                    Informationen
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Alles mit ein asterisk (
                    <span className="text-red-500">*</span>) ist nötig.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="imagename"
                          id="imagename"
                          required
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                          value={userData.name}
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
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                        Alternative Informationen (SEO)
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="imgalt"
                          id="imgalt"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
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
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                        Erstellt am
                      </label>
                      <div className="mt-2">
                        <span
                          type="text"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                        >
                          {new Date(userData.createdAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                        Letztes Update
                      </label>
                      <div className="mt-2">
                        <span
                          type="text"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                        >
                          {new Date(userData.modifiedAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
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
                      <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                        Beschreibung
                      </label>
                      <div className="relative mt-2">
                        <textarea
                          id="longtext"
                          name="longtext"
                          className="block h-72 w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
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
    </>
  );
}
