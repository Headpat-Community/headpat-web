import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

export default function BadgePageComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/tiff",
      "image/x-icon",
      "image/vnd.djvu",
    ];
    if (!validImageTypes.includes(selectedFile.type)) {
      alert(
        "Please select a valid image file type (JPEG, PNG, GIF, SVG, TIFF, ICO, DVU)."
      );
      return;
    }
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

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  }, []);

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

      formData.append(
        "data",
        JSON.stringify({
          users_permissions_user: userId,
          name: imagename.value,
          imgalt: imgalt.value,
          longtext: longtext.value,
          nsfw: nsfw.checked,
        })
      );

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch("https://backend.headpat.de/api/galleries", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        //console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        // Add the "Saved!" text to the form
        alert("Saved!");
        window.location.reload();
      } else {
        console.error("Failed to upload file:", responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main className="relative lg:min-h-full">
        <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <img
            src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
            alt="Badge Preview"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1 className="text-sm font-medium text-indigo-600">
                Badge Request
              </h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Thanks for considering!
              </p>
              <p className="mt-2 text-base text-gray-500">
                We appreciate your order, we’re currently processing it. So hang
                tight and we’ll send you confirmation very soon!
              </p>

              <ul
                role="list"
                className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
              >
                <li key="Badge" className="flex space-x-6 py-6">
                  <div className="text-center">
                    <h1 className="text-left text-xl">Upload image</h1>
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      onDrop={handleDrop}
                      onDragOver={(event) => event.preventDefault()}
                    >
                    <Image
                        id="selected-image"
                        className="h-32 w-32 rounded-md"
                        alt=""
                        src="/images/placeholder-image.webp"
                        onDrop={handleDrop}
                        onDragOver={(event) => event.preventDefault()}
                        width={200}
                        height={200}
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
                            onDrop={handleDrop}
                            onDragOver={(event) => event.preventDefault()}
                          />
                        </label>
                        <p className="pl-1">
                          PNG, JPEG, GIF, SVG, TIFF, ICO, DVU up to 1MB
                        </p>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>

              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-white">
                <div className="flex justify-between">
                  <dt>First Name</dt>
                  <input type="text" name="firstname" className="text-black rounded" />
                </div>

                <div className="flex justify-between">
                  <dt>Last name</dt>
                  <input type="text" name="lastname" className="text-black rounded" />
                </div>

                <div className="flex justify-between">
                  <dt>Address</dt>
                  <input type="text" name="address" className="text-black rounded" />
                </div>

                <div className="flex justify-between">
                  <dt>City</dt>
                  <input type="text" name="city" className="text-black rounded" />
                </div>

                <div className="flex justify-between">
                  <label htmlFor="country-select" className="text-white rounded">Country</label>
                  <select id="country-select" name="country" className="text-black appearance-none rounded">
                    <option value="Germany" className="bg-black text-white">Germany</option>
                    <option value="Austria" className="bg-black text-white">Austria</option>
                    <option value="Switzerland" className="bg-black text-white">Switzerland</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <dt>State</dt>
                  <input type="text" name="state" className="text-black rounded" />
                </div>

                <div className="flex justify-between">
                  <dt>Postal code</dt>
                  <input type="text" name="postalcode" className="text-black rounded" />
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
