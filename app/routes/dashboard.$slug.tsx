import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import checkMark from "public/checkMark.svg";
import pawPrint from "public/pawPrint.svg";
import pinDrop from "public/pinDrop.svg";
import phone from "public/phone.svg";
import email from "public/email.svg";

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

  //  code to fetch organization details

  const orgRes = await fetch(
    `https://api.petfinder.com/v2/organizations/${animalId.animal.organization_id}`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );
  const organization = await orgRes.json();

  return json({ animalId, organization });
};
export default function Component() {
  const [activeTab, setActiveTab] = useState("aboutMe");
  const { animalId, organization } = useLoaderData<typeof loader>();
  console.log(organization);
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
            <div className="m-auto">
              <div className="relative m-5 mt-20 border border-red-500">
                <div className="flex justify-center -top-16 ">
                  <img
                    src={
                      animalId.animal.primary_photo_cropped
                        ? animalId.animal.primary_photo_cropped.small
                        : ""
                    }
                    alt="animal"
                    className="rounded-full w-40 sm:w-52 sm:h-52 md:w-64 h-40 md:h-64 mx-auto "
                  />
                </div>
                {/* Content for animal */}
                <div className="mt-[1rem]">
                  {/* About me and Gallery div */}
                  <div className="flex flex-row justify-center space-x-6 ">
                    <div
                      id="aboutMe"
                      className={`cursor-pointer md:w-40 md:h-16 ${
                        activeTab === "aboutMe"
                          ? " btn btn-active btn-primary"
                          : "btn btn-outline btn-primary"
                      }`}
                      onClick={() => {
                        setActiveTab("aboutMe");
                        document
                          .getElementById("aboutMeDiv")
                          .classList.remove("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.add("hidden");
                      }}
                    >
                      <p className="text-lg">About Me</p>
                    </div>
                    <div
                      id="gallery"
                      className={`cursor-pointer md:w-40 md:h-16 ${
                        activeTab === "gallery"
                          ? " btn btn-active btn-primary"
                          : "btn btn-outline btn-primary"
                      }`}
                      onClick={() => {
                        setActiveTab("gallery");
                        document
                          .getElementById("aboutMeDiv")
                          .classList.add("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.remove("hidden");
                      }}
                    >
                      <p className="text-lg">Gallery</p>
                    </div>
                  </div>
                  <div id="aboutMeDiv">
                    {/* About Me Content */}
                    <div className="overflow-x-auto border-t-2 m-auto max-w-xl  ">
                      <h2 className="font-semibold text-2xl md:text-[4rem] md:leading-[4rem] ml-4 mt-4">
                        {animalId.animal.name}
                      </h2>
                      <div className="flex justify-between mt-6 text-lg ">
                        <h3 className="flex items-center ml-4">
                          <img
                            src={pawPrint}
                            alt="paw"
                            className="w-4 h-4 md:w-8 md:h-8"
                          />
                          <p className="md:text-[2rem] md:leading-[4rem]">
                            {animalId.animal.breeds.primary}
                          </p>
                        </h3>
                        <h3 className="flex items-center mr-14">
                          <img
                            className="w-4 h-4 md:w-8 md:h-8"
                            src={pinDrop}
                            alt="location"
                          />
                          <p className="md:text-[2rem] md:leading-[4rem]">
                            {animalId.animal.contact.address.city},
                            {animalId.animal.contact.address.state}
                          </p>
                        </h3>
                      </div>
                      <div className="mt-6 m-auto pl-[40%] md:text-[2rem] md:leading-[4rem] ">
                        {animalId.animal.attributes.shots_current ? (
                          <div className="flex items-center ">
                            <img
                              src={checkMark}
                              alt="check mark"
                              className="w-6 h-6 md:w-10 md:h-10"
                            />
                            <p className="">Vaccinated</p>
                          </div>
                        ) : (
                          ""
                        )}
                        {animalId.animal.attributes.spayed_neutered ? (
                          <div className="flex items-center   ">
                            <img
                              src={checkMark}
                              alt="check mark"
                              className="w-6 h-6 md:w-10 md:h-10"
                            />
                            <p className="">Spayed</p>
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
                          <div className="flex items-center ">
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
                      </div>
                      <div className="flex justify-around mt-8">
                        <div className="border-l-4 border-purple-500 inline-block p-2">
                          <p className="text-sm">Age</p>
                          <p className="font-bold">{animalId.animal.age}</p>
                        </div>
                        <div className="border-l-4 border-purple-500 inline-block p-2">
                          <p className="text-sm">Gender </p>
                          <p className="font-bold">{animalId.animal.gender}</p>
                        </div>
                        <div className="border-l-4 border-purple-500 inline-block p-2">
                          <p className="text-sm">Size</p>
                          <p className="font-bold">{animalId.animal.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* here is the code for the gallery */}
                  <div
                    id="galleryDiv"
                    className="hidden grid grid-cols-2 gap-4"
                  >
                    {animalId.animal.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center  overflow-hidden"
                      >
                        <img
                          className="h-auto max-w-full rounded-lg"
                          src={photo.small}
                          alt="animal"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Organization information */}
                  <div className="mt-8 border  flex flex-col justify-center items-center">
                    <h2 className="text-2xl">Organization Details</h2>
                    <p className="font-bold text-xl">
                      {organization.organization.name}
                    </p>
                    <div className="flex">
                      <img src={pinDrop} alt="location" className="w-4 h-4" />
                      <p className="text-lg">
                        {organization.organization.address.city},
                        {organization.organization.address.state}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center  ">
                    <button
                      onClick={displayCard}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md focus:outline-none focus:shadow-outline "
                    >
                      Adopt {animalId.animal.name}
                    </button>
                  </div>
                </div>

                {/* Pop up for adopting information */}

                <div id="cardPopup" className="hidden">
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-purple-300 p-12 rounded-lg shadow-md">
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
                      <div className="flex flex-col">
                        <div className="flex flex-col items-center justify center ">
                          <h2 className="text-xl">Contact</h2>{" "}
                          <h2 className="font-bold text-2xl">
                            {organization.organization.name}{" "}
                          </h2>
                          <p>
                            And Tell Them Your Interest In{" "}
                            {animalId.animal.name}!
                          </p>
                        </div>
                        {organization.organization.email ? (
                          <div className="flex items-center bg-gray-100 rounded-lg pr-4">
                            <img
                              className="w-4 h-4 mr-6 ml-2"
                              src={email}
                              alt="email"
                            />{" "}
                            <div className="flex flex-col">
                              <p>Email</p>
                              <a
                                className="underline"
                                href={`mailto:${organization.organization.email}`}
                              >
                                {organization.organization.email}
                              </a>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {organization.organization.phone ? (
                          <div className=" flex items-center bg-gray-100 rounded-lg">
                            <img
                              className="w-4 h-4 mr-6 ml-2"
                              src={phone}
                              alt="phone"
                            />{" "}
                            <div className="flex flex-col">
                              <p>Phone</p>
                              <a
                                href={`tel:${organization.organization.phone}`}
                              >
                                {organization.organization.phone}
                              </a>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Await>
      </Suspense>
    </main>
  );
}
