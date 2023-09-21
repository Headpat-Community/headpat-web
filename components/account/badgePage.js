import { useEffect, useCallback, useState, useRef } from "react";

export default function BadgePageComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deliverAtEurofurence, setDeliverAtEurofurence] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState("");
  const displaynameRef = useRef("");
  const pronounsRef = useRef("");
  const addressRef = useRef("");
  const cityRef = useRef("");
  const countryRef = useRef("");
  const stateRef = useRef("");
  const postalcodeRef = useRef("");

  useEffect(() => {
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox][name=languages]"
    );
    const hiddenInput = document.getElementById("selectedLanguages");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const selectedLanguages = Array.from(checkboxes)
          .filter((c) => c.checked)
          .map((c) => c.value)
          .join(", ");
        hiddenInput.value = selectedLanguages;
        setSelectedLanguages(selectedLanguages);
      });
    });
  }, []);

  const handleCheckboxChange = useCallback((event) => {
    setDeliverAtEurofurence(event.target.checked);
  }, []);

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
    if (selectedFile.size > 1 * 1024 * 1024) {
      alert("File size must be less than 1 MB.");
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
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox][name=languages]"
    );
    const selectedCheckboxes = Array.from(checkboxes).filter((c) => c.checked);
    if (selectedCheckboxes.length === 0) {
      setError("Bitte eine sprache auswählen.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

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

      const response = await fetch(
        `https://backend.headpat.de/api/badges?filters[users_permissions_user][id][$eq]=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
          },
        }
      );

      console.log("response:", response);

      const responseData = await response.json();
      if (response.ok) {
        formData.append(
          "data",
          JSON.stringify({
            users_permissions_user: userId,
            displayname: displaynameRef.current?.value,
            pronouns: pronounsRef.current?.value,
            languages: selectedLanguages,
            address: addressRef.current?.value,
            city: cityRef.current?.value,
            country: countryRef.current?.value,
            state: stateRef.current?.value,
            postalcode: postalcodeRef.current?.value,
            deliver_at_eurofurence: deliver_at_eurofurence.checked,
          })
        );

        setIsUploading(true); // Set isUploading to true before making the API call

        const response = await fetch("https://backend.headpat.de/api/badges", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
          },
          body: formData,
        });

        console.log("response:", response);

        const responseData = await response.json();
        if (response.ok) {
          console.log("File uploaded successfully");
          setIsUploading(false); // Set isUploading to false after the API call is complete
          // Add the "Saved!" text to the form
          alert("Saved!");
          window.location.reload();
        } else {
          console.error("Failed to upload file:", responseData);
        }
      } else {
        setInterval(() => {
          setError("Du darfst dies nur einmal anfragen.");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <main className="relative lg:min-h-full">
          <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12 flex items-center">
            <div className="flex-none">
              <img
                src="/images/badgefront.webp"
                alt="Badge Preview"
                className="h-full w-full object-contain object-center max-h-[600px] rounded"
              />

              <fieldset className="mt-4">
                <legend className="text-xl font-semibold leading-6 text-white">
                  Sprachen
                </legend>
                <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`german`}
                        className="select-none font-medium text-white"
                      >
                        German
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`german`}
                        name={`languages`}
                        type="checkbox"
                        value="German"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`english`}
                        className="select-none font-medium text-white"
                      >
                        English
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`english`}
                        name={`languages`}
                        type="checkbox"
                        value="English"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`dutch`}
                        className="select-none font-medium text-white"
                      >
                        Dutch
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`dutch`}
                        name={`languages`}
                        type="checkbox"
                        value="Dutch"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                  <input
                    type="hidden"
                    id="selectedLanguages"
                    name="selectedLanguages"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600" id="error">
                    {error}
                  </p>
                )}
              </fieldset>
            </div>
          </div>

          <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
              <div className="lg:col-start-2">
                <h1 className="text-sm font-medium text-indigo-600">
                  Badge Request
                </h1>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Danke für deine Überlegung!
                </p>
                <p className="mt-2 text-base text-gray-500">
                  Danke das du dich für einen Badge interessierst! Bitte fülle
                  das Formular aus und wir werden uns so schnell wie möglich bei
                  dir melden.
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
                        <img
                          id="selected-image"
                          className="h-32 w-32 rounded-md"
                          alt=""
                          src="/images/placeholder-image.webp"
                          onDrop={handleDrop}
                          onDragOver={(event) => event.preventDefault()}
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
                        </div>
                      </label>
                    </div>
                    <div className="mt-1 align-middle text-center">
                      <p className="text-red-500">
                        PNG, JPEG, SVG, TIFF, ICO, DVU, WEBP
                      </p>
                      <p className="text-red-500 pt-2">Max. 512x512px, 1MB</p>
                    </div>
                  </li>
                </ul>

                <div className="sm:col-span-3 mb-4">
                  <label className="block text-xl font-medium leading-6 text-white">
                    Bei Eurofurence abholen?
                  </label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      name="deliver_at_eurofurence"
                      id="deliver_at_eurofurence"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      checked={deliverAtEurofurence}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </div>

                <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-white">
                  <div className="flex justify-between">
                    <dt>Name</dt>
                    <input
                      type="text"
                      name="displayname"
                      id="displayname"
                      ref={displaynameRef}
                      className="text-black rounded"
                      required
                    />
                  </div>

                  <div className="flex justify-between">
                    <dt>Pronouns</dt>
                    <input
                      type="text"
                      name="pronouns"
                      id="pronouns"
                      ref={pronounsRef}
                      className="text-black rounded"
                    />
                  </div>

                  {!deliverAtEurofurence && (
                    <>
                      <div className="flex justify-between">
                        <dt>Address</dt>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          ref={addressRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <dt>City</dt>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          ref={cityRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <label
                          htmlFor="country-select"
                          className="text-white rounded"
                        >
                          Country
                        </label>
                        <select
                          name="country"
                          id="country"
                          ref={countryRef}
                          className="text-black appearance-none rounded"
                        >
                          <option
                            value="Germany"
                            className="bg-black text-white"
                          >
                            Germany
                          </option>
                          <option
                            value="Austria"
                            className="bg-black text-white"
                          >
                            Austria
                          </option>
                          <option
                            value="Switzerland"
                            className="bg-black text-white"
                          >
                            Switzerland
                          </option>
                        </select>
                      </div>

                      <div className="flex justify-between">
                        <dt>State</dt>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          ref={stateRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <dt>Postal code</dt>
                        <input
                          type="text"
                          name="postalcode"
                          id="postalcode"
                          ref={postalcodeRef}
                          className="text-black rounded"
                        />
                      </div>
                    </>
                  )}
                </dl>

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
                    disabled={isUploading} // Disable the button if isUploading is true
                  >
                    {isUploading ? "Uploading..." : "Save"}{" "}
                    {/* Show different text based on the upload state */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </>
  );
}
