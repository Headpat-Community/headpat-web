"use client";
import { useState } from "react";
import Layout from "../../layouts/account-layout";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 16 * 1024 * 1024) {
      alert("File size must be less than 16 MB.");
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = (event) => {
      const imgElement = document.getElementById("selected-image");
      imgElement.src = event.target.result;
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        if (img.width >= 128 && img.height >= 128) {
          setSelectedFile(selectedFile);
        } else {
          alert("Image resolution must be at least 128x128 pixels.");
        }
      };
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("files.img", selectedFile);

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

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      formData.append(
        "data",
        JSON.stringify({
          name: imagename.value,
          imgalt: imgalt.value,
          nsfw: nsfw.checked,
          date: formattedDate,
          users_permissions_user: userId,
        })
      );

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch("https://backend.headpat.de/api/galleries", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        // Add the "Saved!" text to the form
        alert("Saved!")
      } else {
        console.error("Failed to upload file:", responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Image Upload
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Diese Informationen werden öffentlich angezeigt. Sei also
                vorsichtig, was du teilst.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                    <div className="text-center">
                      <label
                        htmlFor="file-upload"
                        className="w-full text-center cursor-pointer"
                      >
                        <img
                          id="selected-image"
                          className="mx-auto h-96 min-w-full object-cover rounded-md"
                          alt=""
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                          >
                            <span className="p-4">Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only bg-transparent"
                              required
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">
                            PNG, JPEG, GIF, SVG, TIFF, ICO, DVU up to 16MB
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Informationen
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Alles mit ein asterisk (<span className="text-red-500">*</span>)
                ist nötig.
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
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-white">
                    NSFW
                  </label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      name="nsfw"
                      id="nsfw"
                      className="checked:bg-red-500 block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              value="Submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
}
