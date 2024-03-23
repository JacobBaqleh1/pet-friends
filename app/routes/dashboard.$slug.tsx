import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import checkMark from "public/checkMark.svg";
import pawPrint from "public/pawPrint.svg";
import pinDrop from "public/pinDrop.svg";
export const loader = async ({ params }: LoaderFunctionArgs) => {
  let id = params.slug;
  //fetching api token from the petfinder website
  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
      client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
    }),
  });
  const tokenData = await response.json();
  //fetching api data using the params and the api token

  const res = await fetch(`https://api.petfinder.com/v2/animals/${id}}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const animalId = await res.json();

  return json({ animalId });
};
export default function Component() {
  const { animalId } = useLoaderData<typeof loader>();
  console.log(animalId);
  // Contact Pop up animation
  function displayCard() {
    let cardPopup = document.getElementById("cardPopup");
    cardPopup.style.display = "block";
  }

  function closeCard() {
    let cardPopup = document.getElementById("cardPopup");
    cardPopup.style.display = "none";
  }
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={animalId}>
          <main>
            <div className="max-w-7xl mx-auto">
              <div className="relative m-5 mt-20 border border-red-500">
                <div className="flex justify-center -top-16 ">
                  <img
                    src={
                      animalId.animal.primary_photo_cropped
                        ? animalId.animal.primary_photo_cropped.small
                        : ""
                    }
                    alt="animal"
                    className="rounded-full w-32 h-32 mx-auto "
                  />
                </div>
                {/* Content for animal */}
                <div className="mt-[1rem]">
                  {/* About me and Gallery div */}
                  <div className="flex flex-row justify-center">
                    <div
                      id="aboutMe"
                      className="cursor-pointer"
                      onClick={() => {
                        document
                          .getElementById("aboutMeDiv")
                          .classList.remove("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.add("hidden");
                      }}
                    >
                      About Me /
                    </div>
                    <div
                      id="gallery"
                      className=" cursor-pointer"
                      onClick={() => {
                        document
                          .getElementById("aboutMeDiv")
                          .classList.add("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.remove("hidden");
                      }}
                    >
                      Gallery
                    </div>
                  </div>
                  <div id="aboutMeDiv">
                    {/* About Me Content */}
                    <div className="overflow-x-auto">
                      <h2 className="font-bold">{animalId.animal.name}</h2>
                      <h3 className="flex items-center">
                        <img src={pawPrint} alt="paw" className="w-4 h-4" />
                        {animalId.animal.breeds.primary}
                      </h3>
                      <h3 className="flex items-center">
                        <img className="w-4 h-4" src={pinDrop} alt="location" />
                        {animalId.animal.contact.address.city},
                        {animalId.animal.contact.address.state}
                      </h3>
                      {animalId.animal.attributes.shots_current ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Vaccinated</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.spayed_neutered ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Spayed</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.house_trained ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">House Trained</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.special_needs ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Special Needs</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-around">
                        <div className="border inline-block p-2">
                          <p>Age</p>
                          <p className="font-bold">{animalId.animal.age}</p>
                        </div>
                        <div className="border inline-block p-2">
                          <p>Gender </p>
                          <p className="font-bold">{animalId.animal.gender}</p>
                        </div>
                        <div className="border inline-block p-2">
                          <p>Size</p>
                          <p className="font-bold">{animalId.animal.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="galleryDiv" className="hidden">
                    Gallery Content
                  </div>
                </div>
                <div id="cardPopup" className="hidden">
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                      <div className="flex justify-end">
                        <button
                          onClick={closeCard}
                          className="btn btn-circle btn-outline "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <h2>Adoption Card</h2>
                      <p>Details</p>
                    </div>
                  </div>
                </div>
                <div className="fixed bottom-4 right-4">
                  <button
                    onClick={displayCard}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md focus:outline-none focus:shadow-outline sticky-button"
                  >
                    Adopt {animalId.animal.name}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </Await>
      </Suspense>
    </main>
  );
}
